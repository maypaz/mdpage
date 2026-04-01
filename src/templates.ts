import { escapeHtml } from "./utils";
import type { TemplateOptions } from "./types";

export function pageTemplate(content: string, options: TemplateOptions = {}): string {
  const origin = options.origin || "https://md.page";
  const pageUrl = options.pageUrl || origin;
  const title = options.title || "md.page";
  const description = options.description || "Instantly convert Markdown to a shareable HTML page.";
  const ogImage = options.ogImageUrl || `${origin}/og-image.png`;
  const ogType = options.ogType || "website";
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  <!-- Open Graph -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:site_name" content="md.page">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${ogImage}">
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
      padding-bottom: 1rem;
    }
    .footer a {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
      color: #6b7280;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 0.4rem 0.9rem;
      transition: all 0.2s;
    }
    .footer a:hover { color: #1a3a7a; background: #eef3ff; border-color: #c7d6f5; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(66,133,244,0.1); }
    .footer .logo-icon { width: 16px; height: 16px; flex-shrink: 0; }
    .footer .brand { color: #1a3a7a; font-weight: 700; font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.78rem; letter-spacing: -0.02em; }
    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #e5e5e5; }
      .container { background: #2a2a2a; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      a { color: #60a5fa; }
      code { background: #3a3a3a; }
      blockquote { border-left-color: #555; color: #aaa; }
      th, td { border-color: #444; }
      th { background: #333; }
      hr { border-top-color: #444; }
      .footer a { color: #888; background: #222; border-color: #333; }
      .footer a:hover { color: #60a5fa; background: #1a2744; border-color: #2a4a7a; box-shadow: 0 2px 8px rgba(66,133,244,0.15); }
      .footer .brand { color: #60a5fa; }
    }
    @media (max-width: 600px) {
      body { padding: 0; background: #fff; }
      .container { max-width: 100%; border-radius: 0; box-shadow: none; padding: 1.25rem 1rem 2rem; }
      @media (prefers-color-scheme: dark) {
        body { background: #2a2a2a; }
      }
    }
  </style>
</head>
<body>
  <div class="container">${content}</div>
  <div class="footer">
    <a href="https://md.page" target="_blank"><svg class="logo-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="#4285F4"/><g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)"><line x1="11" y1="2" x2="7" y2="32"/><line x1="21" y1="2" x2="17" y2="32"/><line x1="4" y1="11" x2="25" y2="11"/><line x1="3" y1="23" x2="24" y2="23"/></g></svg> Made with <span class="brand">md.page</span></a>
  </div>
</body>
</html>`;
}

export function expiredPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Page expired — md.page</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: #fafafa; padding: 2rem 1rem; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { max-width: 480px; background: #fff; border-radius: 8px; padding: 2.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); text-align: center; }
    h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
    p { color: #6b7280; margin-bottom: 1rem; font-size: 0.95rem; }
    pre { background: #1e1e1e; color: #d4d4d4; padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.8rem; text-align: left; margin: 1.25rem 0; }
    .cta { display: inline-block; background: #1a3a7a; color: #fff; padding: 0.6rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 0.9rem; }
    .cta:hover { background: #142d61; }
    @media (prefers-color-scheme: dark) {
      body { background: #1a1a1a; color: #e5e5e5; }
      .card { background: #2a2a2a; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
      p { color: #9ca3af; }
      .cta { background: #3b6fd4; }
      .cta:hover { background: #2d5bb8; }
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>This page has expired</h1>
    <p>Pages on md.page auto-delete after 24 hours.</p>
    <p>Create your own in one command:</p>
    <pre><code>npx mdpage-cli README.md</code></pre>
    <a href="https://md.page" class="cta">Visit md.page</a>
  </div>
</body>
</html>`;
}

export function landingPageHtml(origin: string): string {
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
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background: #f0f2f5; padding: 2rem 1rem; min-height: 100vh; }
    .container { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 3rem 2.5rem 2.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 30px rgba(0,0,0,0.04); text-align: center; }
    .code-block { background: #0d1117; border-radius: 10px; margin: 0.75rem 0; overflow: hidden; }
    .code-header { display: flex; align-items: center; padding: 0.6rem 1rem 0; gap: 0.4rem; }
    .code-dot { width: 10px; height: 10px; border-radius: 50%; }
    .code-dot-red { background: #ff5f57; }
    .code-dot-yellow { background: #febc2e; }
    .code-dot-green { background: #28c840; }
    .code-label { color: #6e7681; font-size: 0.65rem; margin-left: auto; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.05em; }
    pre { background: #0d1117; color: #e6edf3; padding: 0.75rem 1rem 1rem; margin: 0; text-align: left; overflow-x: auto; }
    code { font-size: 0.8rem; }
    .cmd { color: #7ee787; }
    .arg { color: #e6edf3; }
    .flag { color: #79c0ff; }
    .output { color: #6e7681; }
    .str { color: #ffa657; }
    .url { color: #79c0ff; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.6rem; border-radius: 10px; font-size: 0.95rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; color: #fff; transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
    .btn:active { transform: scale(0.97); }
    .btn-github { background: linear-gradient(135deg, #24292e, #40464d); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .btn-github:hover { background: linear-gradient(135deg, #2d333b, #4a5058); box-shadow: 0 4px 14px rgba(0,0,0,0.2); transform: translateY(-1px); }
    .logo-text { color: #1a1a1a; }
    .subtitle { font-size: 1.15rem; color: #374151; margin-bottom: 0.6rem; font-weight: 400; }
    .detail { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.25rem; }
    #copied-msg { margin-top: 0.4rem; color: #1a3a7a; font-size: 0.75rem; opacity: 0; transition: opacity 0.3s; }
    .section-divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0 0.75rem; }
    .section-divider::before, .section-divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
    .section-label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; white-space: nowrap; }
    .skill-cards { display: flex; gap: 0.75rem; margin: 0.75rem 0; }
    .skill-card { flex: 1; border: 1px solid #c7d6f5; border-radius: 10px; padding: 1rem 0.75rem 0.85rem; text-align: left; background: #eef3ff; transition: border-color 0.2s, box-shadow 0.2s; }
    .skill-card:hover { border-color: #93b4f5; box-shadow: 0 2px 8px rgba(66,133,244,0.12); }
    .skill-card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .skill-card-logo { width: 22px; height: 22px; flex-shrink: 0; border-radius: 4px; }
    .skill-card-name { font-size: 0.85rem; font-weight: 600; color: #1a1a1a; }
    .skill-card-cmd-row { display: flex; align-items: center; gap: 0.4rem; }
    .skill-card-cmd { flex: 1; font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.72rem; color: #4b6a9b; background: #dce6f8; border-radius: 5px; padding: 0.4rem 0.6rem; word-break: break-all; }
    .skill-copy-btn { flex-shrink: 0; background: none; border: 1px solid #c7d6f5; border-radius: 5px; padding: 0.35rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; }
    .skill-copy-btn:hover { background: #dce6f8; border-color: #93b4f5; }
    .skill-copy-btn svg { width: 14px; height: 14px; color: #7a9fd4; }
    .skill-copy-btn.copied svg { color: #16a34a; }
    .skill-copy-btn.copied { border-color: #16a34a; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    .anim { animation: fadeUp 0.5s ease-out both; }
    .d1 { animation-delay: 0.04s; } .d2 { animation-delay: 0.08s; } .d3 { animation-delay: 0.12s; }
    .d4 { animation-delay: 0.16s; } .d5 { animation-delay: 0.2s; } .d6 { animation-delay: 0.24s; }
    .d7 { animation-delay: 0.28s; } .d8 { animation-delay: 0.32s; }
    @media (max-width: 480px) {
      body { padding: 0.75rem 0.5rem; }
      .container { padding: 2rem 1.25rem 1.5rem; border-radius: 12px; }
      .btn { justify-content: center; width: 100%; }
      pre { font-size: 0.7rem; overflow-x: hidden; white-space: pre-wrap; word-break: break-all; }
      .code-block { margin: 0.5rem 0; }
      .skill-cards { flex-direction: column; }
      .features { gap: 0.35rem; }
    }
    @media (prefers-color-scheme: dark) {
      body { background: #0a0a0a; color: #e5e5e5; }
      .container { background: #161616; box-shadow: 0 1px 3px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.25); }
      .logo-text { color: #fff; }
      .subtitle { color: #b0b0b0; }
      .detail { color: #888; }
      .btn-github { background: #2a2a2a; border: 1px solid #444; }
      .btn-github:hover { background: #333; }
      #copied-msg { color: #60a5fa; }
      .section-divider::before, .section-divider::after { background: #2a2a2a; }
      .section-label { color: #555; }
      .skill-card { border-color: #1e3a6e; background: #0f1f3d; }
      .skill-card:hover { border-color: #2a5098; box-shadow: 0 2px 12px rgba(66,133,244,0.15); }
      .skill-card-name { color: #e5e5e5; }
      .skill-card-cmd { background: #0a1628; color: #7a9fd4; }
      .skill-copy-btn { border-color: #1e3a6e; }
      .skill-copy-btn:hover { background: #152d5a; border-color: #2a5098; }
      .skill-copy-btn svg { color: #4a7ab5; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="anim d1" style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 0.25rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <rect width="48" height="48" rx="11" fill="#4285F4"/>
        <g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)">
          <line x1="11" y1="2" x2="7" y2="32"/>
          <line x1="21" y1="2" x2="17" y2="32"/>
          <line x1="4" y1="11" x2="25" y2="11"/>
          <line x1="3" y1="23" x2="24" y2="23"/>
        </g>
      </svg>
      <span class="logo-text" style="font-family: ui-monospace, 'SF Mono', SFMono-Regular, 'Courier New', monospace; font-size: 42px; font-weight: 700; letter-spacing: -1px;">md.page</span>
    </div>
    <p class="subtitle anim d2">Instantly turn Markdown into a shareable web page.<br>100% free. No signup. Auto-expires in 24h.</p>
    <div class="anim d3" style="margin-top: 0.75rem;">
      <a href="https://github.com/maypaz/md.page" target="_blank" class="btn btn-github" onclick="trackClick('github_click')"><svg width="18" height="18" viewBox="0 0 16 16" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> GitHub &#11088;</a>
    </div>
    <div class="anim d3" style="margin-top: 1.25rem;">
      <video autoplay loop muted playsinline preload="auto" style="width: 100%; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.12); overflow-anchor: none;">
        <source src="/lp.mp4" type="video/mp4">
      </video>
    </div>
    <div class="section-divider anim d4"><span class="section-label">Add to your AI agent</span></div>
    <div class="anim d4">
      <div class="skill-cards">
        <div class="skill-card">
          <div class="skill-card-header">
            <img class="skill-card-logo" src="/claude-logo.svg" alt="Claude">
            <span class="skill-card-name">Claude Code</span>
          </div>
          <div class="skill-card-cmd-row">
            <div class="skill-card-cmd">npx skills add maypaz/md.page</div>
            <button class="skill-copy-btn" id="copy-btn-claude" onclick="copySkill('claude')" title="Copy to clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
          </div>
        </div>
        <div class="skill-card">
          <div class="skill-card-header">
            <span style="font-size: 1.25rem; line-height: 1;">&#129438;</span>
            <span class="skill-card-name">OpenClaw</span>
          </div>
          <div class="skill-card-cmd-row">
            <div class="skill-card-cmd">npx clawhub@latest install publish-to-mdpage</div>
            <button class="skill-copy-btn" id="copy-btn-openclaw" onclick="copySkill('openclaw')" title="Copy to clipboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
          </div>
        </div>
      </div>
      <p class="detail" style="margin-top: 0.5rem;"><button onclick="copyAgentPrompt()" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 0.8rem; text-decoration: underline; padding: 0;">Using another agent? Copy this prompt instead</button></p>
      <p id="copied-msg">Copied! Paste it into any AI agent.</p>
    </div>
    <div class="section-divider anim d5"><span class="section-label">Or use directly</span></div>
    <div class="anim d5">
      <div class="code-block">
        <div class="code-header">
          <span class="code-dot code-dot-red"></span>
          <span class="code-dot code-dot-yellow"></span>
          <span class="code-dot code-dot-green"></span>
          <span class="code-label">Terminal</span>
        </div>
        <pre><code><span class="output">$</span> <span class="cmd">npx</span> <span class="arg">mdpage-cli</span> <span class="flag">README.md</span>

  <span class="output">Published &rarr;</span> <span class="url">https://md.page/a8Xk2m</span>
  <span class="output">Expires in 24h</span></code></pre>
      </div>
    </div>
    <div class="anim d6">
      <p class="detail" style="margin: 0.5rem 0;">or use the API directly:</p>
      <div class="code-block">
        <div class="code-header">
          <span class="code-dot code-dot-red"></span>
          <span class="code-dot code-dot-yellow"></span>
          <span class="code-dot code-dot-green"></span>
          <span class="code-label">API</span>
        </div>
        <pre><code><span class="output">$</span> <span class="cmd">curl</span> <span class="flag">-X POST</span> <span class="url">https://md.page/api/publish</span> \\
  <span class="flag">-d</span> <span class="str">'{"markdown": "# Hello World"}'</span>

  <span class="output">&rarr;</span> <span class="str">{ "url": "https://md.page/a8Xk2m" }</span></code></pre>
      </div>
    </div>
  </div>
  <p class="anim d8" style="margin-top: 1rem; text-align: center; font-size: 0.75rem;"><a href="/privacy" style="color: #6b7280; text-decoration: none;">Privacy Policy</a></p>
  <script>
    window.scrollTo(0, 0);
    function trackClick(event) {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event }),
      }).catch(function() {});
    }
    function copySkill(type) {
      var cmds = { claude: 'npx skills add maypaz/md.page', openclaw: 'npx clawhub@latest install publish-to-mdpage' };
      navigator.clipboard.writeText(cmds[type]);
      var btn = document.getElementById('copy-btn-' + type);
      btn.classList.add('copied');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      }, 2000);
      trackClick('copy_skill_' + type);
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

export function privacyPageHtml(origin: string): string {
  return pageTemplate(`
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
`, { title: "Privacy Policy — md.page", description: "Privacy policy for md.page — how your data is handled.", origin });
}
