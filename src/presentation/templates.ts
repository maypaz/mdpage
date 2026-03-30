import { escapeHtml } from "../domain/html";

export interface PageTemplateOptions {
  title?: string;
  description?: string;
  pageUrl?: string;
  origin?: string;
  ogImageUrl?: string;
  ogType?: string;
}

export function renderPageTemplate(content: string, options: PageTemplateOptions = {}): string {
  const origin = options.origin ?? "https://md.page";
  const pageUrl = options.pageUrl ?? origin;
  const title = options.title ?? "md.page";
  const description = options.description ?? "Instantly convert Markdown to a shareable HTML page.";
  const ogImageUrl = options.ogImageUrl ?? `${origin}/og-image.png`;
  const ogType = options.ogType ?? "website";
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="md.page">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${ogImageUrl}">
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
    .container > h1:first-child { margin-top: 0; }
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
      font-size: 0.85rem;
    }
    .footer a { color: #6b7280; text-decoration: none; transition: color 0.2s; }
    .footer a:hover { color: #1a3a7a; }
    .footer .brand { color: #1a3a7a; font-weight: 600; }
    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #e5e5e5; }
      .container { background: #2a2a2a; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      a { color: #60a5fa; }
      code { background: #3a3a3a; }
      blockquote { border-left-color: #555; color: #aaa; }
      th, td { border-color: #444; }
      th { background: #333; }
      hr { border-top-color: #444; }
      .footer a { color: #888; }
      .footer a:hover { color: #60a5fa; }
      .footer .brand { color: #60a5fa; }
    }
  </style>
</head>
<body>
  <div class="container">${content}</div>
  <div class="footer">
    <a href="https://md.page" target="_blank">✦ Made with <span class="brand"><strong>#</strong><span style="margin-left:0.1em">md.page</span></span></a>
  </div>
</body>
</html>`;
}

export function renderLandingPage(origin: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>md.page</title>
  <meta name="description" content="Instantly convert Markdown to a shareable HTML page.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="md.page">
  <meta property="og:description" content="Instantly convert Markdown to a shareable HTML page.">
  <meta property="og:image" content="${origin}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:url" content="${origin}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: #fafafa; padding: 2rem 1rem; }
    .container { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 2.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); text-align: center; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 6px; overflow-x: auto; margin: 1.5rem 0 1rem; text-align: left; }
    code { font-size: 0.8rem; }
    .buttons { display: inline-flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 8px; font-size: 0.9rem; font-weight: 500; text-decoration: none; border: none; cursor: pointer; color: #fff; }
    .btn-github { background: #24292e; }
    .btn-github:hover { background: #1b1f23; }
    .btn-agent { background: #1a3a7a; }
    .btn-agent:hover { background: #142d61; }
    .subtitle { font-size: 1.1rem; color: #4b5563; margin-bottom: 0.75rem; }
    .detail { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem; }
    #copied-msg { margin-top: 0.4rem; color: #1a3a7a; font-size: 0.75rem; opacity: 0; transition: opacity 0.3s; }
    .features { font-size: 0.85rem; color: #6b7280; }
    .features span { white-space: nowrap; }
    @media (max-width: 480px) {
      body { padding: 1rem 0.5rem; }
      .container { padding: 1.5rem 1rem; }
      .buttons { flex-direction: column; width: 100%; }
      .btn { justify-content: center; width: 100%; }
      pre { font-size: 0.7rem; overflow-x: hidden; white-space: pre-wrap; word-break: break-all; }
      .features { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.25rem 0.75rem; }
    }
    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #e5e5e5; }
      .container { background: #2a2a2a; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      .subtitle { color: #d1d5db; }
      .detail { color: #b0b0b0; }
      .btn-github { background: #444; border: 1px solid rgba(255,255,255,0.3); }
      .btn-github:hover { background: #555; }
      .btn-agent { background: #3b6fd4; }
      .btn-agent:hover { background: #2d5bb8; }
      .features { color: #9ca3af; }
      #copied-msg { color: #60a5fa; }
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="/logo.svg" alt="# md.page" height="50">
    <p class="subtitle">Markdown in, beautiful page out. ✨</p>
    <p class="detail" style="font-size: 0.9rem; font-weight: 600;">Free & open source.</p>
    <p class="detail" style="margin-bottom: 0.75rem;">No accounts, no API keys, no limits.</p>
    <div class="buttons">
      <a href="https://github.com/maypaz/md.page" target="_blank" class="btn btn-github" onclick="trackClick('github_click')"><svg width="18" height="18" viewBox="0 0 16 16" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> ⭐ GitHub</a>
      <button onclick="copyAgentPrompt()" class="btn btn-agent">🤖 Copy prompt for your AI agent</button>
    </div>
    <p id="copied-msg">Copied! Paste it into OpenClaw or any AI agent.</p>
    <pre><code>curl -X POST https://md.page/api/publish \\
  -d '{"markdown": "# Hello World"}'

→ { "url": "https://md.page/a8Xk2m" }</code></pre>
    <p class="features">
      <span>⚡ Instant</span> <span>🔗 Short URLs</span> <span>🕐 24h expiry</span> <span>🔒 Private links</span>
    </p>
  </div>
  <p style="margin-top: 1rem; text-align: center; font-size: 0.75rem;"><a href="/privacy" style="color: #6b7280; text-decoration: none;">Privacy Policy</a></p>
  <script>
    function trackClick(event) {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event }),
      }).catch(function() {});
    }
    function copyAgentPrompt() {
      navigator.clipboard.writeText("From now on, whenever I ask you to share or publish a markdown file, use the md.page API to create a shareable HTML page. Send a POST request to https://md.page/api/publish with the body {\\"markdown\\": \\"<content>\\"} and return the shareable URL to me.");
      document.getElementById('copied-msg').style.opacity = '1';
      setTimeout(() => document.getElementById('copied-msg').style.opacity = '0', 3000);
      trackClick('copy_prompt_click');
    }
  </script>
</body>
</html>`;
}

export function renderPrivacyPage(origin: string): string {
  return renderPageTemplate(`
<h1>Privacy Policy</h1>
<p><strong>Last updated:</strong> March 29, 2026</p>

<h2>What md.page does</h2>
<p>md.page converts Markdown into shareable HTML pages. No account, login, or API key is required.</p>

<h2>No password protection</h2>
<p>Published pages are <strong>not password-protected or encrypted</strong>. Anyone with the link can view your page. By publishing content to md.page, you acknowledge that the content is accessible to anyone who has or discovers the URL.</p>

<h2>Obscurity, not secrecy</h2>
<p>Each page is assigned a short, random 6-character ID (e.g. <code>a8Xk2m</code>), drawn from 62 alphanumeric characters. This gives roughly 56 billion possible combinations, making it extremely unlikely that someone will stumble upon your page by guessing. However, this is <strong>security through obscurity, not access control</strong> — do not publish sensitive, confidential, or personal information.</p>

<h2>Rate limiting</h2>
<p>To protect against brute-force enumeration of page IDs, md.page enforces rate limits on both publishing and page access. Automated scanning or scraping is not permitted.</p>

<h2>Automatic expiry</h2>
<p>All pages expire automatically after <strong>24 hours</strong>. Once expired, the content is permanently deleted from our servers and cannot be recovered.</p>

<h2>Data we store</h2>
<ul>
  <li><strong>Page content:</strong> The rendered HTML of your Markdown, stored in Cloudflare KV for up to 24 hours.</li>
  <li><strong>Rate-limit counters:</strong> Your IP address is used to enforce rate limits. These counters expire within 1 hour and are not used for any other purpose.</li>
</ul>
<p>We do not store your original Markdown source. We do not use cookies, analytics, tracking pixels, or any third-party tracking services.</p>

<h2>Data we do NOT collect</h2>
<ul>
  <li>No accounts or personal information</li>
  <li>No cookies or browser fingerprinting</li>
  <li>No advertising or data sharing with third parties</li>
</ul>

<h2>Infrastructure</h2>
<p>md.page runs on <a href="https://workers.cloudflare.com" target="_blank" rel="noopener">Cloudflare Workers</a> and uses <a href="https://developers.cloudflare.com/kv/" target="_blank" rel="noopener">Cloudflare KV</a> for storage. Cloudflare may process requests according to their own <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">privacy policy</a>.</p>

<h2>Your responsibility</h2>
<p>Do not publish content that is illegal, harmful, or that you do not have the right to share. Do not publish sensitive personal data, passwords, API keys, or confidential information — pages are publicly accessible to anyone with the link.</p>

<h2>Contact</h2>
<p>md.page is open source. For questions or concerns, please <a href="https://github.com/maypaz/md.page/issues" target="_blank" rel="noopener">open an issue on GitHub</a>.</p>
`, {
    title: "Privacy Policy — md.page",
    description: "Privacy policy for md.page — how your data is handled.",
    origin,
  });
}
