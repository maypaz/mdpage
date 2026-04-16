import { Hono } from "hono";
import MarkdownIt from "markdown-it";
import type { Env } from "./types";
import { WELCOME_DOC_MARKDOWN, WELCOME_DOC_TITLE, WELCOME_DOC_SLUG } from "./templates";
import { generateId, extractMeta, hashKey, emit } from "./utils";
import { validateUsername } from "./username";

type HonoEnv = { Bindings: Env };

export const auth = new Hono<HonoEnv>();

// Session duration: 30 days
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;

// --- Helpers ----------------------------------------------------------------

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function sessionCookie(sessionId: string, maxAge: number): string {
  return `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=.md.page; Max-Age=${maxAge}`;
}

function oauthStateCookie(state: string): string {
  return `oauth_state=${state}; Path=/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
}

function clearOauthStateCookie(): string {
  return `oauth_state=; Path=/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function verifyOauthState(cookieHeader: string | null, stateParam: string | null): boolean {
  if (!cookieHeader || !stateParam) return false;
  const match = cookieHeader.match(/oauth_state=([a-f0-9]{64})/);
  if (!match) return false;
  return match[1] === stateParam;
}

/** Ensure a username is valid and unique, appending a random suffix if needed. */
async function ensureValidUsername(db: D1Database, candidate: string): Promise<string> {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomSuffix = () => Array.from(crypto.getRandomValues(new Uint8Array(4)), b => chars[b % chars.length]).join("");

  // If candidate is invalid (reserved, too short, etc.), append a suffix
  let username = candidate;
  if (!validateUsername(username).valid) {
    username = `${candidate}-${randomSuffix()}`;
  }

  // Ensure it's still valid after suffix (edge case: candidate was empty)
  if (!validateUsername(username).valid) {
    username = `user-${randomSuffix()}-${randomSuffix()}`;
  }

  return username;
}

// --- Session management -----------------------------------------------------

async function createSession(db: D1Database, userId: string): Promise<string> {
  const sessionId = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL).toISOString();
  await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, userId, expiresAt)
    .run();
  return sessionId;
}

export async function getUserFromCookie(db: D1Database, cookieHeader: string | null): Promise<{ id: string; username: string; display_name: string | null; avatar_url: string | null } | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/session=([a-f0-9]{64})/);
  if (!match) return null;

  const row = await db.prepare(`
    SELECT u.id, u.username, u.display_name, u.avatar_url
    FROM sessions s JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).bind(match[1]).first<{ id: string; username: string; display_name: string | null; avatar_url: string | null }>();

  return row || null;
}

export async function getUserFromApiKey(db: D1Database, authHeader: string | null): Promise<{ id: string; username: string; display_name: string | null; avatar_url: string | null } | null> {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer (mdp_[a-zA-Z0-9]{20,32})$/);
  if (!match) return null;

  const keyHash = await hashKey(match[1]);
  const row = await db.prepare(`
    SELECT u.id, u.username, u.display_name, u.avatar_url
    FROM api_keys ak JOIN users u ON ak.user_id = u.id
    WHERE ak.key_hash = ?
  `).bind(keyHash).first<{ id: string; username: string; display_name: string | null; avatar_url: string | null }>();

  if (row) {
    await db.prepare("UPDATE api_keys SET last_used_at = datetime('now') WHERE key_hash = ?")
      .bind(keyHash).run();
  }

  return row || null;
}

const welcomeMd = new MarkdownIt({ html: false });

async function createWelcomeDoc(db: D1Database, kv: KVNamespace, userId: string): Promise<void> {
  try {
    const count = await db.prepare("SELECT COUNT(*) as cnt FROM pages WHERE user_id = ?")
      .bind(userId).first<{ cnt: number }>();
    if (count && count.cnt > 0) return; // User already has pages

    const id = generateId();
    const meta = extractMeta(WELCOME_DOC_MARKDOWN);
    const renderedHtml = welcomeMd.render(WELCOME_DOC_MARKDOWN);
    const markdownPreview = WELCOME_DOC_MARKDOWN.slice(0, 1500);

    await kv.put(id, JSON.stringify({
      html: renderedHtml,
      title: WELCOME_DOC_TITLE,
      description: meta.description,
      markdownPreview,
      markdown: WELCOME_DOC_MARKDOWN,
    }));

    await db.prepare(
      "INSERT INTO pages (id, user_id, slug, title, visibility) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, userId, WELCOME_DOC_SLUG, WELCOME_DOC_TITLE, "public").run();
  } catch {
    // Non-critical — don't block login if welcome doc fails
  }
}

// --- GitHub OAuth ------------------------------------------------------------

auth.get("/github", (c) => {
  const state = generateToken();
  const redirectUri = `${new URL(c.req.url).origin}/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: c.env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state,
  });
  c.header("Set-Cookie", oauthStateCookie(state));
  return c.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

auth.get("/github/callback", async (c) => {
  const url = new URL(c.req.url);
  const code = url.searchParams.get("code");
  if (!code) return c.text("Missing code", 400);

  // Verify state to prevent CSRF
  if (!verifyOauthState(c.req.header("cookie") ?? null, url.searchParams.get("state"))) {
    return c.text("Invalid state parameter", 400);
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: c.env.GITHUB_CLIENT_ID,
      client_secret: c.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/auth/github/callback`,
    }),
  });
  const tokenData = await tokenRes.json<{ access_token?: string; error?: string }>();
  if (!tokenData.access_token) return c.text("OAuth failed", 400);

  // Fetch user profile
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, "User-Agent": "md.page" },
  });
  const ghUser = await userRes.json<{ id: number; login: string; name: string | null; avatar_url: string }>();

  // Validate and sanitize username
  const username = await ensureValidUsername(c.env.DB, ghUser.login.toLowerCase());

  // Upsert user
  const userId = crypto.randomUUID();
  await c.env.DB.prepare(`
    INSERT INTO users (id, github_id, username, display_name, avatar_url)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(github_id) DO UPDATE SET
      display_name = excluded.display_name,
      avatar_url = excluded.avatar_url
  `).bind(userId, ghUser.id, username, ghUser.name, ghUser.avatar_url).run();

  // Get the actual user id (may differ if existing user)
  const user = await c.env.DB.prepare("SELECT id FROM users WHERE github_id = ?")
    .bind(ghUser.id).first<{ id: string }>();

  // Detect signup vs login: if the DB id matches our generated id, it was an INSERT (new user)
  emit(c.env, user!.id === userId ? "user_signup" : "user_login", "github");

  await createWelcomeDoc(c.env.DB, c.env.PAGES, user!.id);

  const sessionId = await createSession(c.env.DB, user!.id);

  const finalUser = await c.env.DB.prepare("SELECT username FROM users WHERE github_id = ?")
    .bind(ghUser.id).first<{ username: string }>();
  c.header("Set-Cookie", sessionCookie(sessionId, SESSION_TTL / 1000));
  c.header("Set-Cookie", clearOauthStateCookie(), { append: true });
  return c.redirect(`https://${finalUser!.username}.md.page`, 302);
});

// --- Google OAuth ------------------------------------------------------------

auth.get("/google", (c) => {
  const state = generateToken();
  const redirectUri = `${new URL(c.req.url).origin}/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: c.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    state,
  });
  c.header("Set-Cookie", oauthStateCookie(state));
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

auth.get("/google/callback", async (c) => {
  try {
    const url = new URL(c.req.url);
    const code = url.searchParams.get("code");
    if (!code) return c.text("Missing code", 400);

    // Verify state to prevent CSRF
    if (!verifyOauthState(c.req.header("cookie") ?? null, url.searchParams.get("state"))) {
      return c.text("Invalid state parameter", 400);
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${url.origin}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json<{ access_token?: string; error?: string }>();
    if (!tokenData.access_token) return c.text("OAuth failed", 400);

    // Fetch user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const gUser = await userRes.json<{ id: string; email: string; name: string; picture: string }>();

    // Generate and validate username from email prefix
    const emailPrefix = gUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/--+/g, "-").replace(/^-|-$/g, "");
    let candidate = emailPrefix.slice(0, 30);
    if (candidate.length < 6) {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      const pad = Array.from(crypto.getRandomValues(new Uint8Array(6 - candidate.length)), b => chars[b % chars.length]).join("");
      candidate = candidate + "-" + pad;
    }
    const username = await ensureValidUsername(c.env.DB, candidate);

    // Upsert user
    const userId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO users (id, google_id, username, display_name, avatar_url)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(google_id) DO UPDATE SET
        display_name = excluded.display_name,
        avatar_url = excluded.avatar_url
    `).bind(userId, gUser.id, username, gUser.name, gUser.picture).run();

    // Get the actual user id
    const user = await c.env.DB.prepare("SELECT id FROM users WHERE google_id = ?")
      .bind(gUser.id).first<{ id: string }>();

    // Detect signup vs login: if the DB id matches our generated id, it was an INSERT (new user)
    emit(c.env, user!.id === userId ? "user_signup" : "user_login", "google");

    await createWelcomeDoc(c.env.DB, c.env.PAGES, user!.id);

    const sessionId = await createSession(c.env.DB, user!.id);

    const finalUser = await c.env.DB.prepare("SELECT username FROM users WHERE google_id = ?")
      .bind(gUser.id).first<{ username: string }>();
    c.header("Set-Cookie", sessionCookie(sessionId, SESSION_TTL / 1000));
    c.header("Set-Cookie", clearOauthStateCookie(), { append: true });
    return c.redirect(`https://${finalUser!.username}.md.page`, 302);
  } catch (err) {
    console.error("Google OAuth callback error");
    return c.text("Authentication failed. Please try again.", 500);
  }
});

// --- Logout ------------------------------------------------------------------

auth.post("/logout", (c) => {
  c.header("Set-Cookie", sessionCookie("", 0));
  return c.redirect("/", 302);
});
