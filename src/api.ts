import { Hono } from "hono";
import MarkdownIt from "markdown-it";
import type { Env } from "./types";
import { authRequired } from "./middleware";
import type { User } from "./middleware";
import { generateId, extractMeta, hashKey, emit } from "./utils";
import { slugify, isReservedSlug } from "./username";

type HonoEnv = {
  Bindings: Env;
  Variables: { user: User };
};

export const api = new Hono<HonoEnv>();

const md = new MarkdownIt({ html: false });
const MAX_PAGES = 10;

// All routes in this file require authentication
api.use("/*", authRequired);

// --- GET /api/me — current user info ----------------------------------------

api.get("/me", (c) => {
  const user = c.get("user");
  return c.json({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
  });
});

// --- API Key Management -----------------------------------------------------

function generateApiKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from(bytes, (b) => chars[b % chars.length]).join("");
  return `mdp_${random}`;
}

// POST /api/keys — create a new API key
api.post("/keys", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{ label?: string }>().catch(() => ({ label: undefined }));
  const label = body.label || null;

  // Check limit (max 5 keys)
  const count = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM api_keys WHERE user_id = ?")
    .bind(user.id).first<{ cnt: number }>();
  if (count && count.cnt >= 5) {
    return c.json({ error: "Maximum 5 API keys allowed" }, 400);
  }

  const rawKey = generateApiKey();
  const keyHash = await hashKey(rawKey);
  const id = crypto.randomUUID();

  await c.env.DB.prepare("INSERT INTO api_keys (id, user_id, key_hash, label) VALUES (?, ?, ?, ?)")
    .bind(id, user.id, keyHash, label)
    .run();

  emit(c.env, "api_key_create");

  // Return the raw key only once — it cannot be retrieved again
  return c.json({ id, key: rawKey, label }, 201);
});

// GET /api/keys — list API keys (without the actual key)
api.get("/keys", async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT id, label, last_used_at, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(user.id).all();

  const keys = results.map((k: Record<string, unknown>) => ({
    id: k.id,
    label: k.label,
    last_used_at: k.last_used_at,
    created_at: k.created_at,
  }));

  return c.json({ keys });
});

// PATCH /api/keys/:id — rename an API key
api.patch("/keys/:id", async (c) => {
  const user = c.get("user");
  const keyId = c.req.param("id");
  const body = await c.req.json<{ label?: string }>().catch(() => ({ label: undefined }));

  const result = await c.env.DB.prepare("UPDATE api_keys SET label = ? WHERE id = ? AND user_id = ?")
    .bind(body.label || null, keyId, user.id).run();

  if (!result.meta.changes) {
    return c.json({ error: "Key not found" }, 404);
  }

  return c.json({ ok: true });
});

// DELETE /api/keys/:id — revoke an API key
api.delete("/keys/:id", async (c) => {
  const user = c.get("user");
  const keyId = c.req.param("id");

  const result = await c.env.DB.prepare("DELETE FROM api_keys WHERE id = ? AND user_id = ?")
    .bind(keyId, user.id).run();

  if (!result.meta.changes) {
    return c.json({ error: "Key not found" }, 404);
  }

  return c.json({ ok: true });
});

// --- Pages CRUD -------------------------------------------------------------

// GET /api/pages — list my pages
api.get("/pages", async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT id, slug, title, visibility, view_count, revision_count, created_via, created_at, updated_at FROM pages WHERE user_id = ? ORDER BY updated_at DESC"
  ).bind(user.id).all();

  return c.json({ pages: results });
});

// POST /api/pages — create a permanent page
api.post("/pages", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{ markdown: string; title?: string; slug?: string; visibility?: string }>();

  if (!body.markdown || typeof body.markdown !== "string") {
    return c.json({ error: "Missing 'markdown' field" }, 400);
  }

  if (body.markdown.length > 500_000) {
    return c.json({ error: "Content too large (max 500KB)" }, 413);
  }

  // Check page limit
  const count = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM pages WHERE user_id = ?")
    .bind(user.id).first<{ cnt: number }>();
  if (count && count.cnt >= MAX_PAGES) {
    return c.json({ error: `Maximum ${MAX_PAGES} pages allowed` }, 400);
  }

  const meta = extractMeta(body.markdown);
  const title = body.title || meta.title;
  const slug = body.slug || slugify(title);
  const visibility = body.visibility === "private" ? "private" : "public";

  if (isReservedSlug(slug)) {
    return c.json({ error: "This slug is reserved" }, 400);
  }

  // Check slug uniqueness
  const existing = await c.env.DB.prepare("SELECT id FROM pages WHERE user_id = ? AND slug = ?")
    .bind(user.id, slug).first();
  if (existing) {
    return c.json({ error: "A page with this slug already exists" }, 409);
  }

  const id = generateId();
  const renderedHtml = md.render(body.markdown);
  const markdownPreview = body.markdown.slice(0, 1500);

  // Store content in KV (no TTL = permanent)
  await c.env.PAGES.put(id, JSON.stringify({
    html: renderedHtml,
    title,
    description: meta.description,
    markdownPreview,
    markdown: body.markdown,
  }));

  // Detect creation source: "web" for cookie auth, "api:<key-label>" for API key auth
  const authHeader = c.req.header("authorization") || "";
  let createdVia = "web";
  if (authHeader.startsWith("Bearer mdp_")) {
    // Look up the key label
    const keyMatch = authHeader.match(/^Bearer (mdp_[a-zA-Z0-9]{20,32})$/);
    if (keyMatch) {
      const keyData = new TextEncoder().encode(keyMatch[1]);
      const keyHashBuf = await crypto.subtle.digest("SHA-256", keyData);
      const keyHash = Array.from(new Uint8Array(keyHashBuf), b => b.toString(16).padStart(2, "0")).join("");
      const keyRow = await c.env.DB.prepare("SELECT label FROM api_keys WHERE key_hash = ?")
        .bind(keyHash).first<{ label: string | null }>();
      const keyLabel = keyRow?.label || "key";
      createdVia = `api:${keyLabel}`;
    } else {
      createdVia = "api";
    }
  }

  // Store metadata in D1
  await c.env.DB.prepare(
    "INSERT INTO pages (id, user_id, slug, title, visibility, created_via) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, user.id, slug, title, visibility, createdVia).run();

  emit(c.env, "page_create", createdVia);

  const url = new URL(c.req.url);
  const pageUrl = `${url.protocol}//${user.username}.${url.hostname}/${slug}`;

  return c.json({ id, url: pageUrl, slug, visibility }, 201);
});

// PUT /api/pages/:id — update a page
api.put("/pages/:id", async (c) => {
  const user = c.get("user");
  const pageId = c.req.param("id");

  const page = await c.env.DB.prepare("SELECT id FROM pages WHERE id = ? AND user_id = ?")
    .bind(pageId, user.id).first();
  if (!page) return c.json({ error: "Page not found" }, 404);

  const body = await c.req.json<{ markdown?: string; title?: string; slug?: string; visibility?: string }>();

  const updates: string[] = [];
  const values: (string | null)[] = [];

  if (body.visibility && (body.visibility === "public" || body.visibility === "private")) {
    updates.push("visibility = ?");
    values.push(body.visibility);
  }

  if (body.title) {
    updates.push("title = ?");
    values.push(body.title);
  }

  if (body.slug) {
    if (isReservedSlug(body.slug)) {
      return c.json({ error: "This slug is reserved" }, 400);
    }
    // Check slug uniqueness
    const existing = await c.env.DB.prepare("SELECT id FROM pages WHERE user_id = ? AND slug = ? AND id != ?")
      .bind(user.id, body.slug, pageId).first();
    if (existing) {
      return c.json({ error: "A page with this slug already exists" }, 409);
    }
    updates.push("slug = ?");
    values.push(body.slug);
  }

  if (body.markdown) {
    if (body.markdown.length > 500_000) {
      return c.json({ error: "Content too large (max 500KB)" }, 413);
    }

    const meta = extractMeta(body.markdown);
    const renderedHtml = md.render(body.markdown);
    const markdownPreview = body.markdown.slice(0, 1500);

    await c.env.PAGES.put(pageId, JSON.stringify({
      html: renderedHtml,
      title: body.title || meta.title,
      description: meta.description,
      markdownPreview,
      markdown: body.markdown,
    }));

    if (!body.title) {
      updates.push("title = ?");
      values.push(meta.title);
    }
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    updates.push("revision_count = revision_count + 1");
    values.push(pageId, user.id);
    await c.env.DB.prepare(
      `UPDATE pages SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`
    ).bind(...values).run();

    const isApi = (c.req.header("authorization") || "").startsWith("Bearer mdp_");
    emit(c.env, "page_update", isApi ? "api" : "web");
  }

  return c.json({ ok: true });
});

// DELETE /api/pages/:id — delete a page
api.delete("/pages/:id", async (c) => {
  const user = c.get("user");
  const pageId = c.req.param("id");

  const result = await c.env.DB.prepare("DELETE FROM pages WHERE id = ? AND user_id = ?")
    .bind(pageId, user.id).run();

  if (!result.meta.changes) {
    return c.json({ error: "Page not found" }, 404);
  }

  // Remove content from KV
  await c.env.PAGES.delete(pageId);

  emit(c.env, "page_delete");

  return c.json({ ok: true });
});
