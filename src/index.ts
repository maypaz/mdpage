import { marked } from "marked";

interface Env {
  PAGES: KVNamespace;
}

const TTL = 86400; // 24 hours
const ID_LENGTH = 6;
const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateId(): string {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("");
}

function extractMeta(markdown: string): { title: string; description: string } {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "md.page";
  const plainText = markdown
    .replace(/^#+\s+.+$/gm, "")
    .replace(/[*_`~\[\]()>|#-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  const description = plainText.slice(0, 155) || "A page created with md.page";
  return { title, description };
}

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <polyline points="13,4 3,16 13,28" fill="none" stroke="#1a3a7a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="19,4 29,16 19,28" fill="none" stroke="#1a3a7a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const OG_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f5f0"/>
  <polyline points="340,200 240,315 340,430" fill="none" stroke="#1a3a7a" stroke-width="38" stroke-linecap="square" stroke-linejoin="miter"/>
  <text x="600" y="330" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="220" font-weight="700" fill="#1a3a7a" text-anchor="middle" letter-spacing="-5">md</text>
  <text x="600" y="420" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="100" font-weight="400" fill="#1a3a7a" text-anchor="middle" letter-spacing="6">page</text>
  <polyline points="860,200 960,315 860,430" fill="none" stroke="#1a3a7a" stroke-width="38" stroke-linecap="square" stroke-linejoin="miter"/>
</svg>`;

const HTML_TEMPLATE = (content: string, title = "md.page", description = "Instantly convert Markdown to a shareable HTML page.") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://md.page/og-image.svg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://md.page">
  <meta property="og:site_name" content="md.page">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://md.page/og-image.svg">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fafafa;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 720px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      padding: 2.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
    h1 { font-size: 1.8rem; }
    h2 { font-size: 1.4rem; }
    h3 { font-size: 1.2rem; }
    p { margin-bottom: 1em; }
    a { color: #2563eb; }
    code {
      background: #f3f4f6;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 1em;
    }
    pre code { background: none; padding: 0; color: inherit; }
    blockquote {
      border-left: 3px solid #d1d5db;
      padding-left: 1rem;
      color: #6b7280;
      margin-bottom: 1em;
    }
    ul, ol { margin-bottom: 1em; padding-left: 1.5em; }
    li { margin-bottom: 0.25em; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
    th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
    .footer {
      text-align: center;
      margin-top: 2rem;
      color: #9ca3af;
      font-size: 0.8rem;
    }
    .footer a { color: #9ca3af; text-decoration: none; }
    .footer a:hover { color: #1a3a7a; }
  </style>
</head>
<body>
  <div class="container">${content}</div>
  <div class="footer">
    <a href="https://md.page" target="_blank">Generated by md.page</a>
  </div>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers for API
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // POST /api/publish — create a page
    if (url.pathname === "/api/publish" && request.method === "POST") {
      // Rate limit: 60 publishes per hour per IP
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const rateKey = `rate:${ip}`;
      const current = parseInt(await env.PAGES.get(rateKey) || "0");
      if (current >= 60) {
        return Response.json(
          { error: "Rate limit exceeded. Max 60 pages per hour." },
          { status: 429, headers: corsHeaders }
        );
      }
      await env.PAGES.put(rateKey, String(current + 1), { expirationTtl: 3600 });

      try {
        const body = await request.json<{ markdown: string }>();

        if (!body.markdown || typeof body.markdown !== "string") {
          return Response.json(
            { error: "Missing 'markdown' field" },
            { status: 400, headers: corsHeaders }
          );
        }

        if (body.markdown.length > 500_000) {
          return Response.json(
            { error: "Content too large (max 500KB)" },
            { status: 413, headers: corsHeaders }
          );
        }

        const id = generateId();
        const expiresAt = new Date(Date.now() + TTL * 1000).toISOString();

        await env.PAGES.put(id, body.markdown, { expirationTtl: TTL });

        const pageUrl = `${url.origin}/${id}`;

        return Response.json(
          { url: pageUrl, expires_at: expiresAt },
          { status: 201, headers: corsHeaders }
        );
      } catch {
        return Response.json(
          { error: "Invalid JSON body" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // GET /:id — serve the page
    const pageMatch = url.pathname.match(/^\/([a-zA-Z0-9]{6})$/);
    if (pageMatch && request.method === "GET") {
      const id = pageMatch[1];
      const markdown = await env.PAGES.get(id);

      if (!markdown) {
        return new Response("Page not found or expired.", {
          status: 404,
          headers: { "Content-Type": "text/plain", "X-Robots-Tag": "noindex" },
        });
      }

      const meta = extractMeta(markdown);
      const html = HTML_TEMPLATE(await marked.parse(markdown), meta.title, meta.description);

      return new Response(html, {
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
          "X-Robots-Tag": "noindex",
          "Cache-Control": "no-store",
        },
      });
    }

    // Favicon
    if (url.pathname === "/favicon.svg") {
      return new Response(FAVICON_SVG, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // OG image
    if (url.pathname === "/og-image.svg") {
      return new Response(OG_IMAGE_SVG, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Landing page
    if (url.pathname === "/") {
      return new Response(
        HTML_TEMPLATE(`
          <div style="text-align:center; margin-bottom: 1rem;">
            <h1 style="margin-top:0; font-size: 2.2rem;">md.page</h1>
            <p style="color: #6b7280; margin-bottom: 0.5rem;">Markdown in, beautiful page out. ✨</p>
          </div>
          <pre style="font-size: 0.8rem; padding: 0.75rem;"><code>curl -X POST https://md.page/api/publish \\
  -d '{"markdown": "# Hello World"}'

→ { "url": "https://md.page/a8Xk2m" }</code></pre>
          <p style="font-size: 0.85rem; text-align: center; color: #6b7280;">
            ⚡ Instant &nbsp;·&nbsp; 🔗 Short URLs &nbsp;·&nbsp; 🕐 24h expiry &nbsp;·&nbsp; 🔒 Private links
          </p>
          <div style="text-align:center; margin-top: 1rem;">
            <button onclick="copyAgentPrompt()" style="
              background: #1a3a7a;
              color: #fff;
              border: none;
              padding: 0.6rem 1.2rem;
              border-radius: 8px;
              font-size: 0.9rem;
              cursor: pointer;
            " onmouseover="this.style.background='#142d61'" onmouseout="this.style.background='#1a3a7a'">
              🤖 Copy prompt for your AI agent
            </button>
            <p id="copied-msg" style="margin-top: 0.4rem; color: #1a3a7a; font-size: 0.75rem; opacity: 0; transition: opacity 0.3s;">Copied! Paste it into ChatGPT, Claude, or any AI agent.</p>
          </div>
          <script>
            function copyAgentPrompt() {
              navigator.clipboard.writeText("From now on, whenever I ask you to share or publish a markdown file, use the md.page API to create a shareable HTML page. Send a POST request to https://md.page/api/publish with the body {\\\"markdown\\\": \\\"<content>\\\"} and return the shareable URL to me.");
              document.getElementById('copied-msg').style.opacity = '1';
              setTimeout(() => document.getElementById('copied-msg').style.opacity = '0', 3000);
            }
          </script>
        `),
        { headers: { "Content-Type": "text/html;charset=UTF-8" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
