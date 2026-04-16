import { Hono } from "hono";
import { cors } from "hono/cors";
import MarkdownIt from "markdown-it";
import type { Env, PageData } from "./types";
import { generateId, extractMeta, emit, escapeHtml } from "./utils";
import { FAVICON_SVG, CLAUDE_LOGO_SVG, LOGO_SVG, OG_IMAGE_PNG_B64 } from "./assets";
import { renderOgPng, renderLandingOgPng } from "./og";
import { pageTemplate, expiredPageHtml, landingPageHtml, privacyPageHtml, loginPageHtml } from "./templates";
import { auth, getUserFromCookie } from "./auth";
import { api } from "./api";
import { extractSubdomain, subdomainApp } from "./subdomain";

export { generateId, escapeHtml, stripMarkdownInline, extractMeta, hashKey } from "./utils";
export { wrapText, parseMarkdownBlocks, generateOgSvg } from "./og";

type HonoEnv = { Bindings: Env };

const app = new Hono<HonoEnv>();
const md = new MarkdownIt({ html: false });

const defaultFence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  if (token.info.trim().toLowerCase() === "mermaid") {
    return `<pre class="mermaid">${escapeHtml(token.content)}</pre>\n`;
  }
  return defaultFence(tokens, idx, options, env, self);
};

const TTL = 86400; // 24 hours

// Subdomain routing — intercept requests to username.md.page
// Let /api/* and /auth/* fall through to the main app so they work from subdomains
app.use("*", async (c, next) => {
  const host = c.req.header("host") || "";
  const username = extractSubdomain(host);
  const path = new URL(c.req.url).pathname;
  if (username && !path.startsWith("/api/") && !path.startsWith("/auth/") && !path.startsWith("/favicon") && !path.startsWith("/logo") && !path.startsWith("/og/")) {
    const req = new Request(c.req.raw);
    req.headers.set("x-subdomain-user", username);
    return subdomainApp.fetch(req, c.env);
  }
  await next();
});

// CORS for API routes
app.use("/api/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// POST /api/event — client-side event tracking
app.post("/api/event", async (c) => {
  try {
    const body = await c.req.json<{ event: string }>();
    const allowed = ["github_click", "copy_prompt_click", "copy_skill_claude", "copy_skill_openclaw", "try_publish"];
    if (body.event && allowed.includes(body.event)) {
      emit(c.env, body.event);
    }
  } catch {
    // ignore
  }
  return c.text("ok");
});

// POST /api/publish — create a page
// Rate limiting handled by Cloudflare WAF rule (10 req / 10s per IP)
app.post("/api/publish", async (c) => {
  try {
    const body = await c.req.json<{ markdown: string }>();

    if (!body.markdown || typeof body.markdown !== "string") {
      return c.json({ error: "Missing 'markdown' field" }, 400);
    }

    if (body.markdown.length > 500_000) {
      return c.json({ error: "Content too large (max 500KB)" }, 413);
    }

    const id = generateId();
    const url = new URL(c.req.url);
    const expiresAt = new Date(Date.now() + TTL * 1000).toISOString();
    const meta = extractMeta(body.markdown);
    const renderedHtml = md.render(body.markdown);

    const markdownPreview = body.markdown.slice(0, 1500);
    await c.env.PAGES.put(id, JSON.stringify({ html: renderedHtml, title: meta.title, description: meta.description, markdownPreview }), { expirationTtl: TTL });

    const pageUrl = `${url.origin}/${id}`;

    emit(c.env, "page_publish");

    return c.json({ url: pageUrl, expires_at: expiresAt }, 201);
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
});

// Gate all v2 auth routes behind feature flag
app.use("/auth/*", async (c, next) => {
  if (c.env.AUTH_ENABLED !== "true") return c.text("Coming soon", 404);
  await next();
});
app.route("/auth", auth);

// Gate authenticated API routes behind feature flag
app.use("/api/me", async (c, next) => {
  if (c.env.AUTH_ENABLED !== "true") return c.json({ error: "Coming soon" }, 404);
  await next();
});
app.use("/api/keys/*", async (c, next) => {
  if (c.env.AUTH_ENABLED !== "true") return c.json({ error: "Coming soon" }, 404);
  await next();
});
app.use("/api/pages/*", async (c, next) => {
  if (c.env.AUTH_ENABLED !== "true") return c.json({ error: "Coming soon" }, 404);
  await next();
});
app.route("/api", api);

// Favicon
app.get("/favicon.svg", (c) => {
  return c.body(FAVICON_SVG, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
});

// Claude logo
app.get("/claude-logo.svg", (c) => {
  return c.body(CLAUDE_LOGO_SVG, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
});

// Logo
app.get("/logo.svg", (c) => {
  return c.body(LOGO_SVG, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
});

// Landing page video (served from R2)
app.get("/lp.mp4", async (c) => {
  const object = await c.env.ASSETS_BUCKET.get("lp.mp4");
  if (!object) return c.text("Not found", 404);
  return c.body(object.body as ReadableStream, { headers: { "Content-Type": "video/mp4", "Cache-Control": "public, max-age=86400" } });
});

// OG image (PNG for WhatsApp/social)
app.get("/og-image.png", async (c) => {
  try {
    const pngData = await renderLandingOgPng();
    return new Response(pngData, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
  } catch {
    const bytes = Uint8Array.from(atob(OG_IMAGE_PNG_B64), ch => ch.charCodeAt(0));
    return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" } });
  }
});

// Dynamic OG image per page
app.get("/og/:filename", async (c) => {
  const filename = c.req.param("filename");
  const match = filename.match(/^([a-zA-Z0-9]{6})\.png$/);
  if (!match) return c.text("Not found", 404);
  const id = match[1];

  const stored = await c.env.PAGES.get(id);
  if (!stored) {
    const bytes = Uint8Array.from(atob(OG_IMAGE_PNG_B64), ch => ch.charCodeAt(0));
    return new Response(bytes, { status: 404, headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" } });
  }
  const page = JSON.parse(stored) as PageData;
  try {
    const pngData = await renderOgPng(page.title || "md.page", page.markdownPreview || page.description || "");
    return new Response(pngData, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
  } catch (err) {
    console.error("OG image render failed");
    const bytes = Uint8Array.from(atob(OG_IMAGE_PNG_B64), ch => ch.charCodeAt(0));
    return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" } });
  }
});

// Landing page
app.get("/", (c) => {
  const url = new URL(c.req.url);
  emit(c.env, "homepage_visit");
  return c.html(landingPageHtml(url.origin));
});

// Privacy policy
app.get("/privacy", (c) => {
  const url = new URL(c.req.url);
  return c.html(privacyPageHtml(url.origin));
});

// Login page
app.get("/login", async (c) => {
  if (c.env.AUTH_ENABLED !== "true") return c.text("Coming soon", 404);
  const user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);
  if (user) return c.redirect(`https://${user.username}.md.page`);
  return c.html(loginPageHtml(new URL(c.req.url).origin));
});

// Redirect /docs/* to subdomain
app.get("/docs/view/:slug", async (c) => {
  const user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);
  if (!user) return c.redirect("/login");
  return c.redirect(`https://${user.username}.md.page/${c.req.param("slug")}`, 302);
});

app.get("/docs/edit/:slug", async (c) => {
  const user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);
  if (!user) return c.redirect("/login");
  return c.redirect(`https://${user.username}.md.page/${c.req.param("slug")}/edit`, 302);
});

app.get("/docs/settings", async (c) => {
  const user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);
  if (!user) return c.redirect("/login");
  return c.redirect(`https://${user.username}.md.page/settings`, 302);
});

app.get("/docs/new", async (c) => {
  const user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);
  if (!user) return c.redirect("/login");
  return c.redirect(`https://${user.username}.md.page/new`, 302);
});

app.get("/docs", async (c) => {
  const user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);
  if (!user) return c.redirect("/login");
  return c.redirect(`https://${user.username}.md.page`, 302);
});

// GET /:id — serve a published page
app.get("/:id{[a-zA-Z0-9]{6}}", async (c) => {
  const id = c.req.param("id");
  const url = new URL(c.req.url);
  const stored = await c.env.PAGES.get(id);

  if (!stored) {
    return c.html(expiredPageHtml(), 404, { "X-Robots-Tag": "noindex" });
  }

  const page = JSON.parse(stored) as PageData;
  const pageUrl = `${url.origin}/${id}`;
  const ogImageUrl = `${url.origin}/og/${id}.png`;
  const html = pageTemplate(page.html, { title: page.title, description: page.description, pageUrl, origin: url.origin, ogImageUrl, ogType: "article" });

  emit(c.env, "page_view", id);

  return c.html(html, 200, {
    "X-Robots-Tag": "noindex",
    "Cache-Control": "no-store",
  });
});

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    // Clean up expired sessions
    await env.DB.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  },
};
