import MarkdownIt from "markdown-it";
import type { Env, PageData } from "./types";
import { generateId, extractMeta, emit } from "./utils";
import { FAVICON_SVG, CLAUDE_LOGO_SVG, LOGO_SVG, OG_IMAGE_PNG_B64 } from "./assets";
import { renderOgPng } from "./og";
import { pageTemplate, expiredPageHtml, landingPageHtml, privacyPageHtml } from "./templates";

export { generateId, escapeHtml, stripMarkdownInline, extractMeta } from "./utils";
export { wrapText, parseMarkdownBlocks, generateOgSvg } from "./og";

const md = new MarkdownIt({ html: false });
const TTL = 86400; // 24 hours

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // POST /api/event — client-side event emiting
    if (url.pathname === "/api/event" && request.method === "POST") {
      try {
        const body = await request.json<{ event: string }>();
        const allowed = ["github_click", "copy_prompt_click", "copy_skill_claude", "copy_skill_openclaw"];
        if (body.event && allowed.includes(body.event)) {
          emit(env, body.event);
        }
      } catch {
        // ignore
      }
      return new Response("ok", { headers: CORS_HEADERS });
    }

    // POST /api/publish — create a page
    // Rate limiting handled by Cloudflare WAF rule (10 req / 10s per IP)
    if (url.pathname === "/api/publish" && request.method === "POST") {
      try {
        const body = await request.json<{ markdown: string }>();

        if (!body.markdown || typeof body.markdown !== "string") {
          return Response.json(
            { error: "Missing 'markdown' field" },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        if (body.markdown.length > 500_000) {
          return Response.json(
            { error: "Content too large (max 500KB)" },
            { status: 413, headers: CORS_HEADERS }
          );
        }

        const id = generateId();
        const expiresAt = new Date(Date.now() + TTL * 1000).toISOString();
        const meta = extractMeta(body.markdown);
        const renderedHtml = md.render(body.markdown);

        const markdownPreview = body.markdown.slice(0, 1500);
        await env.PAGES.put(id, JSON.stringify({ html: renderedHtml, title: meta.title, description: meta.description, markdownPreview }), { expirationTtl: TTL });

        const pageUrl = `${url.origin}/${id}`;

        emit(env, "page_publish");

        return Response.json(
          { url: pageUrl, expires_at: expiresAt },
          { status: 201, headers: CORS_HEADERS }
        );
      } catch {
        return Response.json(
          { error: "Invalid JSON body" },
          { status: 400, headers: CORS_HEADERS }
        );
      }
    }

    // GET /:id — serve the page
    const pageMatch = url.pathname.match(/^\/([a-zA-Z0-9]{6})$/);
    if (pageMatch && request.method === "GET") {
      const id = pageMatch[1];
      const stored = await env.PAGES.get(id);

      if (!stored) {
        return new Response(expiredPageHtml(), {
          status: 404,
          headers: { "Content-Type": "text/html;charset=UTF-8", "X-Robots-Tag": "noindex" },
        });
      }

      const page = JSON.parse(stored) as PageData;
      const pageUrl = `${url.origin}/${id}`;
      const ogImageUrl = `${url.origin}/og/${id}.png`;
      const html = pageTemplate(page.html, { title: page.title, description: page.description, pageUrl, origin: url.origin, ogImageUrl, ogType: "article" });

      emit(env, "page_view", id);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
          "X-Robots-Tag": "noindex",
          "Cache-Control": "no-store",
        },
      });
    }

    // Dynamic OG image per page
    const ogMatch = url.pathname.match(/^\/og\/([a-zA-Z0-9]{6})\.png$/);
    if (ogMatch && request.method === "GET") {
      const id = ogMatch[1];
      const stored = await env.PAGES.get(id);
      if (!stored) {
        const bytes = Uint8Array.from(atob(OG_IMAGE_PNG_B64), c => c.charCodeAt(0));
        return new Response(bytes, {
          status: 404,
          headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
        });
      }
      const page = JSON.parse(stored) as PageData;
      try {
        const pngData = await renderOgPng(page.title || "md.page", page.markdownPreview || page.description || "");
        return new Response(pngData, {
          headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
        });
      } catch (err) {
        console.error("OG image render failed:", err);
        const bytes = Uint8Array.from(atob(OG_IMAGE_PNG_B64), c => c.charCodeAt(0));
        return new Response(bytes, {
          headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
        });
      }
    }

    // Favicon
    if (url.pathname === "/favicon.svg") {
      return new Response(FAVICON_SVG, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Claude logo
    if (url.pathname === "/claude-logo.svg") {
      return new Response(CLAUDE_LOGO_SVG, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Logo
    if (url.pathname === "/logo.svg") {
      return new Response(LOGO_SVG, {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Landing page video (served from R2)
    if (url.pathname === "/lp.mp4") {
      const object = await env.ASSETS_BUCKET.get("lp.mp4");
      if (!object) return new Response("Not found", { status: 404 });
      return new Response(object.body, {
        headers: { "Content-Type": "video/mp4", "Cache-Control": "public, max-age=86400" },
      });
    }

    // OG image (PNG for WhatsApp/social)
    if (url.pathname === "/og-image.png") {
      const bytes = Uint8Array.from(atob(OG_IMAGE_PNG_B64), c => c.charCodeAt(0));
      return new Response(bytes, {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Landing page
    if (url.pathname === "/") {
      emit(env, "homepage_visit");
      return new Response(landingPageHtml(url.origin), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    // Privacy policy
    if (url.pathname === "/privacy") {
      return new Response(privacyPageHtml(url.origin), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    return new Response("Not found", { status: 404 });
  },
};
