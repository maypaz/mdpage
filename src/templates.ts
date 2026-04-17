import { escapeHtml } from "./utils";
import { HERMES_LOGO_PNG_B64 } from "./assets";
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
      padding: 0 1rem 2rem;
    }
    .container {
      max-width: 720px;
      margin: 2rem auto 0;
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
    pre.mermaid { background: none; color: inherit; text-align: center; padding: 1rem 0; }
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
    /* Header */
    .site-header { position: sticky; top: 0; z-index: 100; background: rgba(250,250,250,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid #e5e7eb; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 10px 24px; }
    .header-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .header-logo-text { font-family: ui-monospace, 'SF Mono', SFMono-Regular, 'Courier New', monospace; font-size: 1rem; font-weight: 700; letter-spacing: -0.5px; color: #1a1a1a; }
    .header-nav { display: flex; align-items: center; gap: 8px; }
    .header-btn { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.9rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.15s; }
    .header-btn-primary { background: #4285F4; color: #fff; }
    .header-btn-primary:hover { background: #2b6de0; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(66,133,244,0.3); }
    .header-btn-ghost { background: transparent; color: #6b7280; border: 1px solid #e5e7eb; }
    .header-btn-ghost:hover { border-color: #9ca3af; color: #1a1a1a; transform: translateY(-1px); }
    .header-btn-ghost svg { width: 14px; height: 14px; }

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
      .site-header { background: rgba(26,26,26,0.85); border-bottom-color: #333; }
      .header-logo-text { color: #e5e5e5; }
      .header-btn-ghost { border-color: #333; color: #b0b0b0; }
      .header-btn-ghost:hover { border-color: #555; color: #e5e5e5; }
      .header-btn-ghost svg { fill: #b0b0b0; }
      .footer a { color: #888; background: #222; border-color: #333; }
      .footer a:hover { color: #60a5fa; background: #1a2744; border-color: #2a4a7a; box-shadow: 0 2px 8px rgba(66,133,244,0.15); }
      .footer .brand { color: #60a5fa; }
    }
    @media (max-width: 600px) {
      body { padding: 0; background: #fff; }
      .container { max-width: 100%; border-radius: 0; box-shadow: none; padding: 1.25rem 1rem 2rem; }
      .header-inner { padding: 10px 16px; }
      .header-logo-text { font-size: 0.9rem; }
      @media (prefers-color-scheme: dark) {
        body { background: #2a2a2a; }
      }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      <a href="https://md.page" class="header-logo">
        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="#4285F4"/><g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)"><line x1="11" y1="2" x2="7" y2="32"/><line x1="21" y1="2" x2="17" y2="32"/><line x1="4" y1="11" x2="25" y2="11"/><line x1="3" y1="23" x2="24" y2="23"/></g></svg>
        <span class="header-logo-text">md.page</span>
      </a>
      <nav class="header-nav">
        <a href="https://github.com/maypaz/md.page" target="_blank" class="header-btn header-btn-ghost"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> GitHub</a>
        <a href="https://md.page/login" class="header-btn header-btn-primary">Platform &rarr;</a>
      </nav>
    </div>
  </header>
  <div class="container">${content}</div>
  <div class="footer">
    <a href="https://md.page" target="_blank"><svg class="logo-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="11" fill="#4285F4"/><g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)"><line x1="11" y1="2" x2="7" y2="32"/><line x1="21" y1="2" x2="17" y2="32"/><line x1="4" y1="11" x2="25" y2="11"/><line x1="3" y1="23" x2="24" y2="23"/></g></svg> Made with <span class="brand">md.page</span></a>
  </div>${content.includes('class="mermaid"') ? `
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({
      startOnLoad: true,
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
    });
  </script>` : ''}
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
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${origin}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>
    :root {
      --blue: #4285F4;
      --blue-dark: #1a5fd6;
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fb;
      --bg-gradient: linear-gradient(160deg, #f0f2f5, #e4e8ef);
      --text-primary: #1a1a1a;
      --text-secondary: #6b7280;
      --text-tertiary: #9ca3af;
      --border: #e5e7eb;
      --card-bg: #ffffff;
      --card-shadow: 0 4px 20px rgba(0,0,0,0.06);
      --card-shadow-hover: 0 8px 30px rgba(0,0,0,0.1);
      --code-bg: #0d1117;
      --code-text: #e6edf3;
      --radius: 16px;
      --mono: ui-monospace, 'SF Mono', SFMono-Regular, 'Courier New', monospace;
      --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: var(--sans); line-height: 1.6; color: var(--text-primary); background: var(--bg-primary); }
    a { color: var(--blue); }

    /* Header */
    .site-header { position: sticky; top: 0; z-index: 100; background: rgba(240,242,245,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; }
    .header-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .header-logo-text { font-family: var(--mono); font-size: 1.15rem; font-weight: 700; letter-spacing: -0.5px; color: var(--text-primary); }
    .header-nav { display: flex; align-items: center; gap: 10px; }
    .header-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1.1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.15s; }
    .header-btn-primary { background: var(--blue); color: #fff; }
    .header-btn-primary:hover { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 2px 8px rgba(66,133,244,0.3); }
    .header-btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
    .header-btn-ghost:hover { border-color: var(--text-tertiary); color: var(--text-primary); transform: translateY(-1px); }
    .header-btn-ghost svg { width: 16px; height: 16px; }

    /* Sections */
    .section { padding: 80px 24px; }
    .section-inner { max-width: 1100px; margin: 0 auto; }
    .section-heading { font-size: 2.25rem; font-weight: 700; text-align: center; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .section-sub { font-size: 1.1rem; color: var(--text-secondary); text-align: center; max-width: 720px; margin: 0 auto 2.5rem; }

    /* Hero */
    .hero { background: var(--bg-gradient); padding: 48px 24px 60px; text-align: center; }
    .hero h1 { font-size: 3rem; font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; margin-bottom: 1rem; }
    .hero-sub { font-size: 1.2rem; color: var(--text-secondary); max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.6; }
    .hero-video { max-width: 680px; margin: 0 auto 2.5rem; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    .hero-video video { width: 100%; display: block; }

    /* Agent parade */
    .parade-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 0.75rem; }
    .parade { display: inline-flex; align-items: center; gap: 20px; padding: 12px 28px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
    .parade-item { display: flex; align-items: center; gap: 8px; }
    .parade-item img { width: 24px; height: 24px; border-radius: 5px; }
    .parade-item span { font-size: 0.82rem; font-weight: 500; color: var(--text-primary); }
    .parade-sep { width: 1px; height: 20px; background: var(--border); }

    /* Agents */
    .agents { background: var(--bg-secondary); }
    .int-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .int-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px 24px; display: flex; flex-direction: column; box-shadow: var(--card-shadow); transition: box-shadow 0.2s, transform 0.2s; }
    .int-card:hover { box-shadow: var(--card-shadow-hover); transform: translateY(-2px); }
    .int-card-title { font-size: 1.3rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.75rem; text-align: center; }
    .int-card-title.blue { color: var(--blue); }
    .int-card-title.green { color: #16a34a; }
    .int-card-title.purple { color: #7c3aed; }
    .int-card-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 16px; }
    .int-code-wrap { background: var(--code-bg); border-radius: 10px; overflow: hidden; margin-top: auto; flex: 1; display: flex; flex-direction: column; }
    .int-code-header { display: flex; align-items: center; padding: 10px 16px; gap: 6px; background: #161b22; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-red { background: #ff5f57; }
    .dot-yellow { background: #febc2e; }
    .dot-green { background: #28c840; }
    .int-code-label { color: #6e7681; font-size: 0.6rem; margin-left: auto; font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.05em; }
    .int-code { padding: 14px 16px; font-family: var(--mono); font-size: 0.8rem; color: var(--code-text); line-height: 1.7; position: relative; overflow-x: auto; flex: 1; }
    .int-copy-btn { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
    .int-copy-btn:hover { background: rgba(255,255,255,0.15); }
    .int-copy-btn svg { width: 14px; height: 14px; color: #8b949e; }
    .int-copy-btn.copied svg { color: #7ee787; }
    .cmd-green { color: #7ee787; }
    .cmd-blue { color: #79c0ff; }
    .cmd-orange { color: #ffa657; }
    .cmd-white { color: #e6edf3; }
    .cmd-dim { color: #6e7681; }
    .prompt-link { text-align: center; margin-top: 2rem; }
    .prompt-link button { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--card-bg); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer; font-size: 0.85rem; font-weight: 500; font-family: var(--sans); padding: 0.65rem 1.4rem; border-radius: 10px; transition: all 0.2s; box-shadow: var(--card-shadow); }
    .prompt-link button:hover { border-color: var(--blue); color: var(--blue); transform: translateY(-1px); box-shadow: var(--card-shadow-hover); }
    .prompt-link button svg { width: 16px; height: 16px; flex-shrink: 0; }
    #copied-msg { text-align: center; margin-top: 0.5rem; color: var(--blue); font-size: 0.78rem; opacity: 0; transition: opacity 0.3s; }

    /* Try it */
    .try-section { background: var(--bg-gradient); }
    .try-inner { max-width: 800px; margin: 0 auto; }
    .try-terminal { background: var(--code-bg); border-radius: 14px; overflow: hidden; border: 2px solid #21262d; }
    .try-terminal-header { display: flex; align-items: center; padding: 10px 16px; gap: 6px; background: #161b22; }
    .try-terminal textarea {
      width: 100%; height: 200px; resize: none; overflow: hidden;
      font-family: var(--mono); font-size: 0.85rem; line-height: 1.55;
      background: var(--code-bg); color: var(--code-text);
      border: none; padding: 1rem 1.25rem; outline: none;
    }
    .try-terminal textarea::placeholder { color: #8b949e; }
    .try-actions { display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; }
    .try-publish-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.8rem 2rem;
      background: linear-gradient(135deg, var(--blue), var(--blue-dark));
      color: #fff; border: none; border-radius: 10px;
      font-size: 1rem; font-weight: 600;
      cursor: pointer; transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
      box-shadow: 0 2px 8px rgba(66,133,244,0.25);
    }
    .try-publish-btn:hover { background: linear-gradient(135deg, #5a9af5, #2b6de0); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(66,133,244,0.35); }
    .try-publish-btn:active { transform: scale(0.97); }
    .try-publish-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
    .try-status { font-size: 0.85rem; min-height: 1.2em; }
    .try-status a { color: var(--blue); }
    .try-status.error { color: #f87171; }

    /* Footer */
    .site-footer { display: flex; justify-content: space-between; align-items: flex-start; max-width: 1100px; margin: 0 auto; padding: 40px 24px; color: var(--text-tertiary); font-size: 0.75rem; line-height: 1.7; }
    .site-footer a { color: var(--text-tertiary); text-decoration: none; transition: color 0.2s; }
    .site-footer a:hover { color: var(--blue); }
    .footer-brand { font-family: var(--mono); font-weight: 700; font-size: 0.85rem; color: var(--text-tertiary); letter-spacing: -0.02em; }
    .footer-right { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-end; align-self: flex-end; }
    .footer-right a { display: inline-flex; align-items: center; gap: 0.35rem; }

    /* Animations */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .anim { animation: fadeUp 0.5s ease-out both; }
    .d1 { animation-delay: 0.04s; } .d2 { animation-delay: 0.08s; } .d3 { animation-delay: 0.12s; }
    .d4 { animation-delay: 0.16s; } .d5 { animation-delay: 0.2s; }
    .scroll-anim { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
    .scroll-anim.visible { opacity: 1; transform: translateY(0); }

    /* Tablet */
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.25rem; }
      .section-heading { font-size: 1.75rem; }
      .int-cards { grid-template-columns: 1fr 1fr; }
      .int-cards .int-card:last-child { grid-column: 1 / -1; }
      .parade { gap: 14px; padding: 10px 20px; flex-wrap: wrap; justify-content: center; }
    }

    /* Mobile */
    @media (max-width: 480px) {
      .hero { padding: 40px 16px 48px; }
      .hero h1 { font-size: 1.75rem; }
      .hero-sub { font-size: 1rem; }
      .hero-video { border-radius: 10px; }
      .section { padding: 48px 16px; }
      .section-heading { font-size: 1.5rem; }
      .section-sub { font-size: 0.95rem; }
      .int-cards { grid-template-columns: 1fr; }
      .int-cards .int-card:last-child { grid-column: auto; }
      .parade { gap: 10px; padding: 10px 16px; }
      .parade-item span { font-size: 0.72rem; }
      .parade-item img { width: 20px; height: 20px; }
      .int-code { font-size: 0.7rem; }
      .site-footer { flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; }
      .site-footer > div { align-items: center; }
      .footer-right { flex-direction: row; justify-content: center; align-self: center; gap: 1rem; }
      .header-logo-text { font-size: 1rem; }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #0a0a0a;
        --bg-secondary: #111111;
        --bg-gradient: linear-gradient(160deg, #0a0a0a, #111118);
        --text-primary: #e5e5e5;
        --text-secondary: #b0b0b0;
        --text-tertiary: #666;
        --border: #2a2a2a;
        --card-bg: #161616;
        --card-shadow: 0 4px 20px rgba(0,0,0,0.3);
        --card-shadow-hover: 0 8px 30px rgba(0,0,0,0.4);
      }
      .site-header { background: rgba(10,10,10,0.85); border-bottom-color: #2a2a2a; }
      .header-btn-ghost { border-color: #333; color: #b0b0b0; }
      .header-btn-ghost:hover { border-color: #555; color: #e5e5e5; }
      .header-btn-ghost svg { fill: #b0b0b0; }
      .parade { background: var(--card-bg); border-color: var(--border); }
      .try-terminal { border-color: #30363d; }
      .try-terminal-header { background: #0d1117; }
      .hero-video { box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
      #copied-msg { color: #60a5fa; }
      .try-status a { color: #60a5fa; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="header-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="11" fill="#4285F4"/>
          <g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)">
            <line x1="11" y1="2" x2="7" y2="32"/>
            <line x1="21" y1="2" x2="17" y2="32"/>
            <line x1="4" y1="11" x2="25" y2="11"/>
            <line x1="3" y1="23" x2="24" y2="23"/>
          </g>
        </svg>
        <span class="header-logo-text">md.page</span>
      </a>
      <nav class="header-nav">
        <a href="https://github.com/maypaz/md.page" target="_blank" class="header-btn header-btn-ghost" onclick="trackClick('github_click')"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> GitHub</a>
        <a href="/login" class="header-btn header-btn-primary">Platform &rarr;</a>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="section-inner">
      <h1 class="anim d1">Markdown in, shareable page out.</h1>
      <p class="hero-sub anim d2">Turn any Markdown into a beautiful web page in seconds.<br>No signup. No setup. Auto-expires in 24h.</p>
      <div class="hero-video anim d3">
        <video autoplay loop muted playsinline preload="auto">
          <source src="/lp.mp4" type="video/mp4">
        </video>
      </div>
      <div class="anim d4">
        <div class="parade-label">Works with</div>
        <div class="parade">
          <div class="parade-item"><img src="/claude-logo.svg" alt="Claude Code"><span>Claude Code</span></div>
          <div class="parade-sep"></div>
          <div class="parade-item"><img src="/cursor-logo.svg" alt="Cursor"><span>Cursor</span></div>
          <div class="parade-sep"></div>
          <div class="parade-item"><img src="/openclaw-logo.svg" alt="OpenClaw"><span>OpenClaw</span></div>
          <div class="parade-sep"></div>
          <div class="parade-item"><img src="/nanoclaw-logo.svg" alt="Nanoclaw"><span>Nanoclaw</span></div>
          <div class="parade-sep"></div>
          <div class="parade-item"><img src="data:image/png;base64,${HERMES_LOGO_PNG_B64}" alt="Hermes" style="border-radius:5px;"><span>Hermes</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- AI Agents -->
  <section class="section agents scroll-anim">
    <div class="section-inner" style="text-align:center;">
      <h2 class="section-heading">Built for AI agents</h2>
      <p class="section-sub">Your AI can publish Markdown as a beautiful web page with a single tool call.</p>
      <div class="int-cards" style="text-align:left;">
        <div class="int-card">
          <div class="int-card-title blue">Skills</div>
          <p class="int-card-desc">Install the md.page skill and ask your agent to &ldquo;share this as a web page&rdquo;. It just works.</p>
          <div class="int-code-wrap">
            <div class="int-code-header"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="int-code-label">Terminal</span></div>
            <div class="int-code">
              <button class="int-copy-btn" id="copy-btn-claude" onclick="copySkill('claude')" title="Copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
              <span class="cmd-dim"># Claude Code</span><br>
              <span class="cmd-dim">$</span> <span class="cmd-green">npx</span> <span class="cmd-white">skills add maypaz/md.page</span><br>
              <br>
              <span class="cmd-dim"># OpenClaw</span><br>
              <span class="cmd-dim">$</span> <span class="cmd-green">npx</span> <span class="cmd-white">clawhub@latest install</span><br>
              <span class="cmd-white">&nbsp; publish-to-mdpage</span>
            </div>
          </div>
        </div>
        <div class="int-card">
          <div class="int-card-title green">MCP Server</div>
          <p class="int-card-desc">Add md.page as an MCP server. Works with any agent that supports the Model Context Protocol.</p>
          <div class="int-code-wrap">
            <div class="int-code-header"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="int-code-label">JSON</span></div>
            <div class="int-code">
              <button class="int-copy-btn" id="copy-btn-mcp" onclick="copyMcp()" title="Copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
              <span class="cmd-blue">"mcpServers"</span><span class="cmd-white">: {</span><br>
              <span class="cmd-white">&nbsp; </span><span class="cmd-blue">"mdpage"</span><span class="cmd-white">: {</span><br>
              <span class="cmd-white">&nbsp; &nbsp; </span><span class="cmd-blue">"command"</span><span class="cmd-white">: </span><span class="cmd-orange">"npx"</span><span class="cmd-white">,</span><br>
              <span class="cmd-white">&nbsp; &nbsp; </span><span class="cmd-blue">"args"</span><span class="cmd-white">: [</span><span class="cmd-orange">"-y"</span><span class="cmd-white">, </span><span class="cmd-orange">"mdpage-mcp"</span><span class="cmd-white">]</span><br>
              <span class="cmd-white">}}</span>
            </div>
          </div>
        </div>
        <div class="int-card">
          <div class="int-card-title purple">API</div>
          <p class="int-card-desc">One HTTP call is all it takes. Any agent or LLM that can make requests works out of the box.</p>
          <div class="int-code-wrap">
            <div class="int-code-header"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="int-code-label">API</span></div>
            <div class="int-code">
              <button class="int-copy-btn" id="copy-btn-api" onclick="copyApiCurl()" title="Copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
              <span class="cmd-dim">$</span> <span class="cmd-green">curl</span> <span class="cmd-blue">-X POST</span> \\<br>
              <span class="cmd-white">&nbsp; </span><span class="cmd-orange">${origin}/api/publish</span> \\<br>
              <span class="cmd-white">&nbsp; </span><span class="cmd-blue">-d</span> <span class="cmd-orange">'{"markdown": "..."}'</span><br>
              <br>
              <span class="cmd-dim"># &rarr; {"url": "${origin}/kR4x9p"}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="prompt-link">
        <button onclick="copyAgentPrompt()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy prompt for any AI agent</button>
      </div>
      <p id="copied-msg">Copied! Paste it into any AI agent.</p>
    </div>
  </section>

  <!-- Try it -->
  <section class="section try-section scroll-anim" id="try-section">
    <div class="try-inner">
      <h2 class="section-heading">Try it now</h2>
      <p class="section-sub">Paste some Markdown and see it live.</p>
      <div class="try-terminal">
        <div class="try-terminal-header">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <textarea id="try-md" placeholder="# Hello World\n\nPaste your **Markdown** here and hit publish.\n\n- Lists work\n- So do [links](https://example.com)\n- And \`inline code\`" spellcheck="false"></textarea>
      </div>
      <div class="try-actions">
        <button class="try-publish-btn" id="try-publish" onclick="publishMarkdown()">Publish &#128640;</button>
        <span class="try-status" id="try-status"></span>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div>
      <div style="display: inline-flex; align-items: center; gap: 6px; margin-bottom: 0.35rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="11" fill="#4285F4"/>
          <g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)">
            <line x1="11" y1="2" x2="7" y2="32"/>
            <line x1="21" y1="2" x2="17" y2="32"/>
            <line x1="4" y1="11" x2="25" y2="11"/>
            <line x1="3" y1="23" x2="24" y2="23"/>
          </g>
        </svg>
        <span class="footer-brand">md.page</span>
      </div>
      <div style="margin-bottom: 0.2rem;">Built by two developers who got tired of screenshotting markdown.</div>
      <div><a href="https://www.linkedin.com/in/maypaz/" target="_blank">Or May-Paz</a> &amp; <a href="https://www.linkedin.com/in/matanl/" target="_blank">Matan Lachmish</a></div>
    </div>
    <div class="footer-right">
      <a href="https://github.com/maypaz/md.page" target="_blank"><svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg> GitHub</a>
      <a href="/privacy">Privacy</a>
    </div>
  </footer>

  <script>
    window.scrollTo(0, 0);

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-anim').forEach(function(el) {
      observer.observe(el);
    });

    function trackClick(event) {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event }),
      }).catch(function() {});
    }

    var clipSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    var checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    function flashCopy(btnId) {
      var btn = document.getElementById(btnId);
      btn.classList.add('copied');
      btn.innerHTML = checkSvg;
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = clipSvg;
      }, 2000);
    }

    function copyAndTrack(text, btnId, event) {
      navigator.clipboard.writeText(text);
      flashCopy(btnId);
      trackClick(event);
    }

    function copySkill(type) {
      var cmds = { claude: 'npx skills add maypaz/md.page', openclaw: 'npx clawhub@latest install publish-to-mdpage' };
      copyAndTrack(cmds[type], 'copy-btn-claude', 'copy_skill_' + type);
    }

    function copyMcp() {
      copyAndTrack(JSON.stringify({"mcpServers":{"mdpage":{"command":"npx","args":["-y","mdpage-mcp"]}}}, null, 2), 'copy-btn-mcp', 'copy_mcp');
    }

    function copyApiCurl() {
      copyAndTrack('curl -X POST ${origin}/api/publish -H "Content-Type: application/json" -d \\'{"markdown": "# Hello World"}\\'', 'copy-btn-api', 'copy_api_curl');
    }

    function publishMarkdown() {
      var md = document.getElementById('try-md').value.trim();
      var btn = document.getElementById('try-publish');
      var status = document.getElementById('try-status');
      if (!md) { md = document.getElementById('try-md').placeholder; }
      btn.disabled = true;
      btn.textContent = 'Publishing\\u2026';
      status.className = 'try-status'; status.textContent = '';
      fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: md })
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.url) {
          status.className = 'try-status';
          status.innerHTML = 'Published! <a href="' + data.url + '" target="_blank">' + data.url + '</a>';
          window.open(data.url, '_blank');
          trackClick('try_publish');
        } else {
          status.className = 'try-status error';
          status.textContent = data.error || 'Something went wrong.';
        }
      }).catch(function() {
        status.className = 'try-status error';
        status.textContent = 'Network error. Please try again.';
      }).finally(function() {
        btn.disabled = false;
        btn.innerHTML = 'Publish &#128640;';
      });
    }

    function copyAgentPrompt() {
      navigator.clipboard.writeText("From now on, whenever I ask you to share or publish a markdown file, use the md.page API to create a shareable HTML page. Send a POST request to https://md.page/api/publish with the body {\\"markdown\\": \\"<content>\\"} and return the shareable URL to me.");
      document.getElementById('copied-msg').style.opacity = '1';
      setTimeout(function() { document.getElementById('copied-msg').style.opacity = '0'; }, 3000);
      trackClick('copy_prompt_click');
    }
  </script>
</body>
</html>`;
}

export function privacyPageHtml(origin: string): string {
  return pageTemplate(`
<h1>Privacy Policy</h1>
<p><strong>Last updated:</strong> April 11, 2026</p>

<h2>What md.page does</h2>
<p>md.page converts Markdown into shareable HTML pages. You can use it anonymously (pages expire in 24 hours) or sign in with Google to get permanent pages under your own subdomain.</p>

<h2>Anonymous pages</h2>
<p>No account is required for anonymous pages. Each page is assigned a random 6-character ID and expires automatically after <strong>24 hours</strong>. Once expired, the content is permanently deleted.</p>

<h2>No password protection</h2>
<p>Published pages are <strong>not password-protected or encrypted</strong>. Anyone with the link can view your page (unless you set it to private, which restricts access to the page owner). Do not publish sensitive, confidential, or personal information on public pages.</p>

<h2>Accounts and authentication</h2>
<p>When you sign in with Google, we store:</p>
<ul>
  <li><strong>Your Google ID, name, and profile picture</strong> — used to identify your account and display in the dashboard.</li>
  <li><strong>A session cookie</strong> — an HttpOnly, Secure cookie (<code>session</code>) that keeps you logged in for up to 30 days. This cookie is scoped to <code>.md.page</code> and is not accessible to JavaScript.</li>
  <li><strong>Your pages and metadata</strong> — page titles, slugs, visibility settings, view counts, and timestamps are stored in our database.</li>
  <li><strong>API keys</strong> — if you create API keys, we store a cryptographic hash (SHA-256). The plaintext key is shown only once at creation and is never stored.</li>
</ul>
<p>We do not store your Google password or access token beyond the initial authentication exchange.</p>

<h2>Rate limiting</h2>
<p>To protect against abuse, md.page enforces rate limits on publishing and page access. Automated scanning or scraping is not permitted.</p>

<h2>Data we store</h2>
<ul>
  <li><strong>Anonymous pages:</strong> Rendered HTML, stored in Cloudflare KV for up to 24 hours.</li>
  <li><strong>Permanent pages:</strong> Rendered HTML and original Markdown source, stored indefinitely until you delete the page.</li>
  <li><strong>Account data:</strong> Google ID, username, display name, avatar URL, and session data.</li>
  <li><strong>Aggregate analytics:</strong> Anonymous event counts (page views, publishes) with no personally identifiable information.</li>
</ul>

<h2>Data we do NOT collect</h2>
<ul>
  <li>No browser fingerprinting</li>
  <li>No third-party tracking, advertising, or data sharing</li>
  <li>No email addresses are stored (only your Google ID)</li>
</ul>

<h2>Cookies</h2>
<p>md.page uses the following cookies:</p>
<ul>
  <li><code>session</code> — authentication session (HttpOnly, Secure, SameSite=Lax, 30-day expiry)</li>
  <li><code>oauth_state</code> — temporary CSRF protection during login (HttpOnly, Secure, 10-minute expiry, deleted after use)</li>
</ul>
<p>No third-party cookies or tracking cookies are used.</p>

<h2>Data deletion</h2>
<p>You can delete your pages at any time from the dashboard or via the API. To delete your account entirely, please <a href="https://github.com/maypaz/md.page/issues" target="_blank" rel="noopener">open an issue on GitHub</a>.</p>

<h2>Infrastructure</h2>
<p>md.page runs on <a href="https://workers.cloudflare.com" target="_blank" rel="noopener">Cloudflare Workers</a> and uses <a href="https://developers.cloudflare.com/kv/" target="_blank" rel="noopener">Cloudflare KV</a> and <a href="https://developers.cloudflare.com/d1/" target="_blank" rel="noopener">Cloudflare D1</a> for storage. Cloudflare may process requests according to their own <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">privacy policy</a>.</p>

<h2>Your responsibility</h2>
<p>Do not publish content that is illegal, harmful, or that you do not have the right to share. Do not publish sensitive personal data, passwords, API keys, or confidential information on public pages.</p>

<h2>Contact</h2>
<p>md.page is open source. For questions or concerns, please <a href="https://github.com/maypaz/md.page/issues" target="_blank" rel="noopener">open an issue on GitHub</a>.</p>
`, { title: "Privacy Policy — md.page", description: "Privacy policy for md.page — how your data is handled.", origin });
}

// --- v2 App Pages -----------------------------------------------------------

const APP_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#3b82f6"/><g stroke="#fff" stroke-width="4.5" stroke-linecap="round" fill="none" transform="translate(11, 8)"><line x1="11" y1="2" x2="7" y2="32"/><line x1="21" y1="2" x2="17" y2="32"/><line x1="4" y1="11" x2="25" y2="11"/><line x1="3" y1="23" x2="24" y2="23"/></g></svg>`;
const DOC_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1.5H4a1.5 1.5 0 00-1.5 1.5v10A1.5 1.5 0 004 14.5h8a1.5 1.5 0 001.5-1.5V6L9 1.5z"/><path d="M9 1.5V6h4.5"/><line x1="5.5" y1="9" x2="10.5" y2="9"/><line x1="5.5" y1="11.5" x2="10.5" y2="11.5"/></svg>`;
const GEAR_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"/><path d="M13.1 10a1.1 1.1 0 00.22 1.21l.04.04a1.33 1.33 0 11-1.89 1.89l-.04-.04a1.1 1.1 0 00-1.21-.22 1.1 1.1 0 00-.67 1.01v.11a1.33 1.33 0 11-2.67 0v-.06A1.1 1.1 0 006 13.1a1.1 1.1 0 00-1.21.22l-.04.04a1.33 1.33 0 11-1.89-1.89l.04-.04A1.1 1.1 0 003.12 10a1.1 1.1 0 00-1.01-.67h-.11a1.33 1.33 0 110-2.67h.06A1.1 1.1 0 002.9 5.88a1.1 1.1 0 00-.22-1.21l-.04-.04a1.33 1.33 0 111.89-1.89l.04.04A1.1 1.1 0 006 2.9h.06a1.1 1.1 0 00.67-1.01v-.11a1.33 1.33 0 012.67 0v.06a1.1 1.1 0 00.67 1.01 1.1 1.1 0 001.21-.22l.04-.04a1.33 1.33 0 111.89 1.89l-.04.04a1.1 1.1 0 00-.22 1.21v.06a1.1 1.1 0 001.01.67h.11a1.33 1.33 0 110 2.67h-.06a1.1 1.1 0 00-1.01.67z"/></svg>`;
const EYE_ICON = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.3 8s2.7-4.5 6.7-4.5S14.7 8 14.7 8s-2.7 4.5-6.7 4.5S1.3 8 1.3 8z"/><circle cx="8" cy="8" r="2"/></svg>`;
const COPY_ICON = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M3 11H2.5A1.5 1.5 0 011 9.5v-7A1.5 1.5 0 012.5 1h7A1.5 1.5 0 0111 2.5V3"/></svg>`;
const PENCIL_ICON = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.3 1.7a1.5 1.5 0 012.1 2.1L5.5 11.7 2 13l1.3-3.5 8-8z"/></svg>`;
const TRASH_ICON = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h12"/><path d="M5.3 4V2.7a1.3 1.3 0 011.4-1.4h2.6a1.3 1.3 0 011.4 1.4V4"/><path d="M12.7 4v9.3a1.3 1.3 0 01-1.4 1.4H4.7a1.3 1.3 0 01-1.4-1.4V4"/></svg>`;
const PLUS_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>`;

const APP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #09090b;
    --surface: #111113;
    --surface-hover: #18181b;
    --surface-active: #1f1f23;
    --border: #27272a;
    --border-subtle: #1e1e21;
    --text: #fafafa;
    --text-secondary: #a1a1aa;
    --text-muted: #52525b;
    --accent: #3b82f6;
    --accent-hover: #2563eb;
    --accent-subtle: rgba(59,130,246,0.1);
    --success: #22c55e;
    --success-bg: rgba(34,197,94,0.12);
    --danger: #ef4444;
    --danger-bg: rgba(239,68,68,0.1);
    --sidebar-w: 260px;
    --font: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
  }

  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f7f7f8;
      --surface: #ffffff;
      --surface-hover: #f4f4f5;
      --surface-active: #e4e4e7;
      --border: #e4e4e7;
      --border-subtle: #f0f0f2;
      --text: #09090b;
      --text-secondary: #71717a;
      --text-muted: #a1a1aa;
      --accent-subtle: rgba(59,130,246,0.07);
      --success-bg: rgba(34,197,94,0.08);
      --danger-bg: rgba(239,68,68,0.07);
    }
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font);
    color: var(--text);
    background: var(--bg);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }

  /* === Layout === */
  .app-layout { display: flex; min-height: 100vh; }

  /* === Sidebar === */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 10;
  }

  .sidebar-brand {
    padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-brand a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--text);
    font-family: var(--mono);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
  }

  .sidebar-content::-webkit-scrollbar { width: 3px; }
  .sidebar-content::-webkit-scrollbar-track { background: transparent; }
  .sidebar-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .new-doc-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 0.55rem 0.75rem;
    margin-bottom: 0.5rem;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    text-decoration: none;
    letter-spacing: 0.01em;
  }

  .new-doc-btn:hover { background: var(--accent-hover); transform: translateY(-1px); }

  .sidebar-label {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    padding: 0.85rem 0.75rem 0.35rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sidebar-count {
    font-family: var(--mono);
    font-size: 0.58rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0;
    text-transform: none;
  }

  .doc-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.45rem 0.75rem;
    border-radius: 7px;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 450;
    transition: all 0.1s ease;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }

  .doc-item:hover { background: var(--surface-hover); color: var(--text); }
  .doc-item.active { background: var(--accent-subtle); color: var(--accent); font-weight: 550; }
  .doc-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--accent);
  }
  .doc-item-icon { flex-shrink: 0; opacity: 0.4; }
  .doc-item.active .doc-item-icon { opacity: 0.85; }

  .sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid var(--border);
  }

  .settings-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.5rem 0.75rem;
    border-radius: 7px;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 450;
    transition: all 0.1s ease;
  }

  .settings-link:hover { background: var(--surface-hover); color: var(--text); }
  .settings-link.active { background: var(--accent-subtle); color: var(--accent); }

  .sidebar-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
  }

  /* === Main === */
  .main-content {
    flex: 1;
    margin-left: var(--sidebar-w);
    min-height: 100vh;
  }

  .main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .main-header h1 {
    font-size: 1.05rem;
    font-weight: 650;
    letter-spacing: -0.02em;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .doc-count {
    font-size: 0.72rem;
    color: var(--text-muted);
    font-family: var(--mono);
    background: var(--surface-hover);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    border: 1px solid var(--border);
  }

  .user-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid var(--border);
  }

  /* === Doc Cards === */
  .docs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.85rem;
    padding: 1.5rem 2rem;
  }

  .doc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.15rem;
    text-decoration: none;
    color: var(--text);
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    animation: cardUp 0.35s ease both;
  }

  .doc-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }

  @keyframes cardUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .doc-card-title {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .doc-card-slug {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-family: var(--mono);
  }

  .doc-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.65rem;
    border-top: 1px solid var(--border-subtle);
  }

  .doc-card-time {
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  .badge {
    font-size: 0.6rem;
    padding: 0.12rem 0.45rem;
    border-radius: 20px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .badge-public { background: var(--success-bg); color: var(--success); }
  .badge-private { background: var(--danger-bg); color: var(--danger); }

  .new-card {
    border: 2px dashed var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.85rem;
    min-height: 130px;
    background: transparent;
  }

  .new-card:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-subtle);
    box-shadow: none;
  }

  .new-card-icon {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--surface-hover);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
  }

  .new-card:hover .new-card-icon { background: var(--accent); color: #fff; }

  /* === Empty State === */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    text-align: center;
    color: var(--text-secondary);
    gap: 0.75rem;
    animation: cardUp 0.4s ease both;
  }

  .empty-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    background: var(--surface-hover);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.25rem;
    border: 1px solid var(--border);
  }

  .empty-state h2 { font-size: 1rem; color: var(--text); font-weight: 600; }
  .empty-state p { font-size: 0.82rem; max-width: 380px; line-height: 1.6; }

  /* === Buttons === */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 550;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-hover); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover { background: #dc2626; }
  .btn-outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
  .btn-outline:hover { background: var(--surface-hover); color: var(--text); border-color: var(--text-muted); }
  .btn-sm { height: 34px; padding: 0 0.75rem; font-size: 0.75rem; }
  .btn-ghost { background: transparent; color: var(--text-secondary); border: none; padding: 0.35rem; border-radius: 6px; }
  .btn-ghost:hover { background: var(--surface-hover); color: var(--text); }

  /* === Settings === */
  .settings-container { max-width: 680px; padding: 2rem; }

  .settings-section { margin-bottom: 2.5rem; }
  .settings-section h2 {
    font-size: 0.85rem;
    font-weight: 650;
    margin-bottom: 0.85rem;
    letter-spacing: -0.01em;
  }

  .subdomain-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .subdomain-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    background: var(--accent-subtle);
    color: var(--accent);
    border-radius: 7px;
    flex-shrink: 0;
  }

  .subdomain-box span {
    font-family: var(--mono);
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* === API Keys Table === */
  .keys-table {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--surface);
  }

  .keys-header {
    display: grid;
    grid-template-columns: 1fr 1.8fr auto;
    padding: 0.6rem 1rem;
    background: var(--surface-hover);
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }

  .key-row {
    display: grid;
    grid-template-columns: 1fr 1.8fr auto;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-subtle);
    transition: background 0.1s ease;
  }

  .key-row:last-child { border-bottom: none; }
  .key-row:hover { background: var(--surface-hover); }

  .key-name {
    font-weight: 550;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .key-name-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px; height: 26px;
    background: var(--accent-subtle);
    color: var(--accent);
    border-radius: 6px;
    flex-shrink: 0;
  }

  .key-masked {
    font-family: var(--mono);
    font-size: 0.78rem;
    color: var(--text-secondary);
    background: var(--bg);
    padding: 0.3rem 0.65rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    display: inline-block;
    max-width: fit-content;
  }

  .key-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    justify-self: end;
  }

  .key-act {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .key-act:hover { background: var(--surface-active); color: var(--text); }
  .key-act.danger:hover { background: var(--danger-bg); color: var(--danger); }

  .new-key-banner {
    margin-top: 0.85rem;
    padding: 0.85rem 1rem;
    background: var(--accent-subtle);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 8px;
    font-size: 0.8rem;
  }

  .new-key-banner strong {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.72rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .new-key-banner code {
    font-family: var(--mono);
    font-size: 0.8rem;
    word-break: break-all;
    color: var(--text);
  }

  .keys-empty {
    padding: 2rem 1.5rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.82rem;
  }

  .add-key-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.85rem;
  }

  .add-key-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 550;
    background: var(--accent);
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .add-key-btn:hover { background: var(--accent-hover); }

  /* === Editor === */
  .editor-container { max-width: 780px; padding: 2rem; }

  .form-group { margin-bottom: 1.15rem; }
  .form-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.35rem;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.55rem 0.8rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.82rem;
    color: var(--text);
    transition: all 0.15s ease;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .editor-meta-row {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 1.15rem;
  }

  .editor-meta-row .form-group { margin-bottom: 0; flex: 1; }

  .visibility-toggle {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    height: 38px;
  }

  .vis-opt {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 0.85rem;
    font-family: var(--font);
    font-size: 0.78rem;
    font-weight: 550;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .vis-opt:first-child { border-right: 1px solid var(--border); }

  .vis-opt.active-public {
    background: var(--success-bg);
    color: var(--success);
  }

  .vis-opt.active-private {
    background: var(--danger-bg);
    color: var(--danger);
  }

  .vis-opt:not(.active-public):not(.active-private):hover {
    background: var(--surface-hover);
    color: var(--text-secondary);
  }

  .editor-area {
    width: 100%;
    min-height: 440px;
    font-family: var(--mono);
    font-size: 0.8rem;
    line-height: 1.7;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    resize: vertical;
    transition: all 0.15s ease;
  }

  .editor-area:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .form-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.15rem;
  }

  .save-status { font-size: 0.75rem; color: var(--text-muted); font-weight: 450; }

  .sign-out-section {
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }

  .sign-out-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
    padding: 0.5rem 1.1rem;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 550;
    cursor: pointer;
    transition: all 0.15s ease;
    opacity: 0.85;
  }

  .sign-out-btn:hover {
    background: var(--danger-bg);
    opacity: 1;
  }

  /* Rename modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.15s ease;
  }

  .modal-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    width: 380px;
    max-width: 90vw;
    animation: cardUp 0.2s ease;
  }

  .modal-box h3 {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .modal-box input {
    width: 100%;
    padding: 0.55rem 0.8rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.82rem;
    color: var(--text);
    margin-bottom: 1rem;
  }

  .modal-box input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-subtle);
  }

  .modal-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* === Doc View === */
  .doc-view-container {
    max-width: 100%;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  .doc-view-frame {
    max-width: 720px;
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);
  }

  .doc-view-frame .rendered-content {
    font-size: 0.92rem;
    line-height: 1.75;
    color: var(--text);
  }

  .doc-view-frame .rendered-content h1 { font-size: 1.7rem; font-weight: 700; margin: 0 0 0.75rem; letter-spacing: -0.03em; }
  .doc-view-frame .rendered-content h2 { font-size: 1.25rem; font-weight: 650; margin: 2rem 0 0.6rem; letter-spacing: -0.02em; }
  .doc-view-frame .rendered-content h3 { font-size: 1.05rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
  .doc-view-frame .rendered-content p { margin: 0 0 1rem; }
  .doc-view-frame .rendered-content ul, .doc-view-frame .rendered-content ol { margin: 0 0 1rem; padding-left: 1.5rem; }
  .doc-view-frame .rendered-content li { margin-bottom: 0.35rem; }
  .doc-view-frame .rendered-content a { color: var(--accent); text-decoration: none; }
  .doc-view-frame .rendered-content a:hover { text-decoration: underline; }
  .doc-view-frame .rendered-content code {
    font-family: var(--mono);
    font-size: 0.82em;
    background: var(--surface-hover);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .doc-view-frame .rendered-content pre {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 0 0 1rem;
  }
  .doc-view-frame .rendered-content pre code {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.8rem;
    line-height: 1.6;
  }
  .doc-view-frame .rendered-content blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 1rem;
    margin: 0 0 1rem;
    color: var(--text-secondary);
  }
  .doc-view-frame .rendered-content strong { font-weight: 600; }
  .doc-view-frame .rendered-content hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
  .doc-view-frame .rendered-content table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
  .doc-view-frame .rendered-content th, .doc-view-frame .rendered-content td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; }
  .doc-view-frame .rendered-content th { background: var(--surface-hover); font-weight: 600; }
  .doc-view-frame .rendered-content img { max-width: 100%; height: auto; border-radius: 6px; }

  .header-actions { display: flex; align-items: center; gap: 0.5rem; }

  /* === Visibility Toggle === */
  .vis-toggle {
    display: inline-flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border);
    height: 34px;
    user-select: none;
  }
  .vis-toggle-opt {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    height: 100%;
    padding: 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 550;
    font-family: var(--font);
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    background: transparent;
    color: var(--text-muted);
  }
  .vis-toggle-opt:first-child { border-right: 1px solid var(--border); }
  .vis-toggle-opt.active-public {
    background: #0d6e3a;
    color: #fff;
  }
  .vis-toggle-opt.active-private {
    background: #b91c1c;
    color: #fff;
  }
  .vis-toggle-opt:not(.active-public):not(.active-private):hover {
    background: var(--surface-hover);
    color: var(--text-secondary);
  }

  /* === Doc Stats Bar === */
  .doc-stats {
    display: flex;
    align-items: center;
    background: #161618;
    border: 1px solid #2a2a2e;
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  @media (prefers-color-scheme: light) {
    .doc-stats { background: #f4f4f5; border-color: #d4d4d8; }
  }
  .doc-stat {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.9rem;
    font-size: 0.72rem;
    color: #a1a1aa;
    white-space: nowrap;
    border-right: 1px solid #2a2a2e;
  }
  @media (prefers-color-scheme: light) {
    .doc-stat { color: #71717a; border-right-color: #d4d4d8; }
  }
  .doc-stat:last-child { border-right: none; }
  .doc-stat svg { opacity: 0.5; flex-shrink: 0; }
  .doc-stat-value {
    color: #f4f4f5;
    font-weight: 600;
    font-family: var(--mono);
    font-size: 0.73rem;
    letter-spacing: -0.02em;
  }
  @media (prefers-color-scheme: light) {
    .doc-stat-value { color: #18181b; }
  }
  .doc-stat-via {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.9rem;
    font-size: 0.72rem;
    font-weight: 500;
    white-space: nowrap;
    margin-left: auto;
  }
  .doc-stat-via .via-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .via-web { color: #a1a1aa; }
  .via-web .via-dot { background: #71717a; }
  .via-api { color: #60a5fa; }
  .via-api .via-dot { background: #3b82f6; }

  /* === Toast === */
  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.65rem 1.15rem;
    border-radius: 10px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 550;
    opacity: 0;
    transform: translateY(12px) scale(0.95);
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    pointer-events: auto;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    max-width: 400px;
  }

  .toast.show {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .toast-success {
    background: var(--success);
    color: #fff;
  }

  .toast-error {
    background: var(--danger);
    color: #fff;
  }

  .toast-info {
    background: var(--text);
    color: var(--bg);
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  /* === Confirm Modal === */
  .confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 150;
    animation: fadeIn 0.12s ease;
    backdrop-filter: blur(2px);
  }

  .confirm-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.75rem;
    width: 360px;
    max-width: 90vw;
    animation: cardUp 0.2s cubic-bezier(0.16,1,0.3,1);
    text-align: center;
  }

  .confirm-icon {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--danger-bg);
    color: var(--danger);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .confirm-box h3 {
    font-size: 0.95rem;
    font-weight: 650;
    margin-bottom: 0.4rem;
    letter-spacing: -0.01em;
  }

  .confirm-box p {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .confirm-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .confirm-cancel {
    padding: 0.5rem 1.1rem;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 550;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .confirm-cancel:hover { background: var(--surface-hover); color: var(--text); }

  .confirm-delete {
    padding: 0.5rem 1.1rem;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 550;
    background: var(--danger);
    color: #fff;
    border: none;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .confirm-delete:hover { background: #dc2626; }

  /* === Responsive === */
  @media (max-width: 768px) {
    :root { --sidebar-w: 0px; }
    .sidebar {
      width: 100%;
      position: relative;
      border-right: none;
      border-bottom: 1px solid var(--border);
      flex-direction: row;
      overflow-x: auto;
    }
    .sidebar-brand { border-bottom: none; padding: 0.75rem 1rem; }
    .sidebar-content { display: flex; gap: 0.25rem; padding: 0.5rem; overflow-x: auto; flex: 1; }
    .sidebar-footer { border-top: none; padding: 0.5rem; }
    .sidebar-label { display: none; }
    .app-layout { flex-direction: column; }
    .main-content { margin-left: 0; }
    .docs-grid { grid-template-columns: 1fr; padding: 1rem; }
    .main-header { padding: 0.85rem 1rem; }
    .settings-container, .editor-container { padding: 1rem; }
  }
`;

export function loginPageHtml(origin: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in — md.page</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>
    ${APP_STYLES}
    .login-wrap { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .login-card {
      text-align: center;
      max-width: 380px;
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 2.5rem 2rem 2rem;
      animation: cardUp 0.4s ease both;
    }
    .login-card h1 { font-size: 1.15rem; font-weight: 650; margin-bottom: 0.35rem; letter-spacing: -0.02em; }
    .login-card .sub { color: var(--text-secondary); margin-bottom: 1.75rem; font-size: 0.82rem; }
    .login-btn {
      display: flex; align-items: center; justify-content: center; gap: 0.75rem;
      width: 100%; padding: 0.7rem;
      border-radius: 9px; font-family: var(--font); font-size: 0.85rem; font-weight: 600;
      text-decoration: none; border: none; cursor: pointer;
      margin-bottom: 0.6rem; transition: all 0.15s ease;
    }
    .login-github { background: #f0f0f0; color: #1a1a1a; }
    .login-github:hover { background: #e0e0e0; }
    .login-google { background: transparent; color: var(--text); border: 1px solid var(--border); }
    .login-google:hover { background: var(--surface-hover); }
    @media (prefers-color-scheme: dark) {
      .login-github { background: #fafafa; color: #111; }
      .login-github:hover { background: #e5e5e5; }
    }
  </style>
</head>
<body>
  <div class="login-wrap">
    <div class="login-card">
      <div style="margin-bottom: 1.25rem;">${APP_LOGO_SVG.replace('width="24"', 'width="40"').replace('height="24"', 'height="40"')}</div>
      <h1>Sign in to md.page</h1>
      <p class="sub">Permanent docs with your own subdomain.</p>
      <a href="/auth/google" class="login-btn login-google">
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
        Continue with Google
      </a>
      <p style="margin-top: 1.25rem; font-size: 0.72rem; color: var(--text-muted);">Anonymous 24h pages still work — no sign-in needed.<br><a href="/" style="color: var(--accent); text-decoration: none;">Back to home</a></p>
    </div>
  </div>
</body>
</html>`;
}

interface DocsPageData {
  user: { username: string; display_name: string | null; avatar_url: string | null };
  pages: Array<{ id: string; slug: string; visibility: string; updated_at: string }>;
  origin: string;
}

function buildSidebar(data: { user: { username: string; display_name: string | null; avatar_url: string | null }; pages: Array<{ id: string; slug: string }>; activeSlug?: string; activeSection?: string }): string {
  const docItems = data.pages.map(p => {
    const name = escapeHtml(p.slug);
    const active = data.activeSlug === p.slug ? ' active' : '';
    return `<a href="/${p.slug}" class="doc-item${active}" title="${name}"><span class="doc-item-icon">${DOC_ICON}</span>${name}</a>`;
  }).join('');

  return `<aside class="sidebar">
    <div class="sidebar-brand"><a href="/">${APP_LOGO_SVG} md.page</a></div>
    <div class="sidebar-content">
      <a href="/new" class="new-doc-btn">${PLUS_ICON} New Doc</a>
      <div class="sidebar-label">Docs <span class="sidebar-count">${data.pages.length} / 10</span></div>
      ${docItems || '<div style="padding: 0.5rem 0.75rem; font-size: 0.75rem; color: var(--text-muted);">No docs yet</div>'}
    </div>
    <div class="sidebar-footer">
      <a href="/settings" class="settings-link${data.activeSection === 'settings' ? ' active' : ''}">
        ${data.user.avatar_url ? `<img src="${escapeHtml(data.user.avatar_url)}" alt="" class="sidebar-avatar">` : GEAR_ICON}
        Settings
      </a>
    </div>
  </aside>`;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function docsPageHtml(data: DocsPageData): string {
  const { user, pages, origin } = data;
  const maxPages = 10;

  const cards = pages.map((p, i) => {
    const name = escapeHtml(p.slug);
    const badgeClass = p.visibility === 'public' ? 'badge-public' : 'badge-private';
    const badgeLabel = p.visibility === 'public' ? 'Public' : 'Private';
    return `<a href="/${p.slug}" class="doc-card" style="animation-delay: ${i * 0.04}s">
      <div class="doc-card-title">${name}</div>
      <div class="doc-card-slug">${escapeHtml(user.username)}.md.page/${name}</div>
      <div class="doc-card-footer">
        <span class="doc-card-time">${timeAgo(p.updated_at)}</span>
        <span class="badge ${badgeClass}">${badgeLabel}</span>
      </div>
    </a>`;
  }).join('');

  const mainContent = pages.length === 0
    ? `<div class="empty-state">
        <div class="empty-icon">${DOC_ICON.replace('width="16"', 'width="24"').replace('height="16"', 'height="24"')}</div>
        <h2>No docs yet</h2>
        <p>Create your first permanent page. Write in Markdown, get a shareable URL at ${escapeHtml(user.username)}.md.page.</p>
        <a href="/new" class="btn btn-primary" style="margin-top: 0.5rem;">${PLUS_ICON} Create your first doc</a>
      </div>`
    : `<div class="docs-grid">
        ${cards}
        <a href="/new" class="doc-card new-card" style="animation-delay: ${pages.length * 0.04}s">
          <div class="new-card-icon">${PLUS_ICON}</div>
          New Doc
        </a>
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Docs — md.page</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>${APP_STYLES}</style>
</head>
<body>
  <div class="app-layout">
    ${buildSidebar({ user, pages, activeSection: 'docs' })}
    <main class="main-content">
      <div class="main-header">
        <h1>Docs</h1>
      </div>
      ${mainContent}
    </main>
  </div>
</body>
</html>`;
}

// --- Doc View Page -----------------------------------------------------------

interface DocViewPageData {
  user: { username: string; display_name: string | null; avatar_url: string | null };
  pages: Array<{ id: string; slug: string }>;
  page: {
    id: string; slug: string; visibility: string; renderedHtml: string;
    view_count: number; revision_count: number; created_via: string;
    created_at: string; updated_at: string;
  };
  origin: string;
}

export function docViewPageHtml(data: DocViewPageData): string {
  const { user, pages, page } = data;
  const name = escapeHtml(page.slug);
  const pageUrl = `https://${escapeHtml(user.username)}.md.page/${escapeHtml(page.slug)}`;
  const isOpen = page.visibility === 'public';

  const isApi = page.created_via.startsWith('api');
  const viaBadgeClass = isApi ? 'via-api' : 'via-web';
  const keyName = isApi && page.created_via.includes(':') ? page.created_via.split(':').slice(1).join(':') : null;

  const viewIcon = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>';
  const editIcon = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z"/></svg>';
  const calIcon = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 7h12"/><path d="M5 1v4"/><path d="M11 1v4"/></svg>';

  function fmtDate(d: string) {
    const dt = new Date(d + 'Z');
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' ' + dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — md.page</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>${APP_STYLES}</style>
</head>
<body>
  <div class="app-layout">
    ${buildSidebar({ user, pages, activeSlug: page.slug })}
    <main class="main-content">
      <div class="main-header">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <h1>${name}</h1>
        </div>
        <div class="header-actions">
          <div class="vis-toggle" id="vis-toggle">
            <button class="vis-toggle-opt${isOpen ? '' : ' active-private'}" id="vis-private" onclick="setVisibility('private')">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>
              Private
            </button>
            <button class="vis-toggle-opt${isOpen ? ' active-public' : ''}" id="vis-public" onclick="setVisibility('public')">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M2 8h12"/><ellipse cx="8" cy="8" rx="3" ry="6"/></svg>
              Public
            </button>
          </div>
          <a href="/${page.slug}/edit" class="btn btn-outline btn-sm">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z"/></svg>
            Edit
          </a>
          <button class="btn btn-primary btn-sm" onclick="shareDoc()">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V13a1 1 0 001 1h6a1 1 0 001-1V8"/><polyline points="10 4 8 2 6 4"/><line x1="8" y1="2" x2="8" y2="10"/></svg>
            Share
          </button>
        </div>
      </div>
      <div class="doc-stats" style="margin: 0 2rem;">
        <span class="doc-stat">${viewIcon} <span class="doc-stat-value">${page.view_count}</span> views</span>
        <span class="doc-stat">${editIcon} <span class="doc-stat-value">${page.revision_count}</span> ${page.revision_count === 1 ? 'edit' : 'edits'}</span>
        <span class="doc-stat">${calIcon} created <span class="doc-stat-value">${fmtDate(page.created_at)}</span></span>
        ${page.updated_at !== page.created_at ? `<span class="doc-stat">${calIcon} updated <span class="doc-stat-value">${fmtDate(page.updated_at)}</span></span>` : ''}
        <span class="doc-stat-via ${viaBadgeClass}"><span class="via-dot"></span>via ${isApi ? 'API' : 'Web'}${keyName ? ` (${escapeHtml(keyName)})` : ''}</span>
      </div>
      <div class="doc-view-container">
        <div class="doc-view-frame">
          <div class="rendered-content">${page.renderedHtml}</div>
        </div>
      </div>
    </main>
  </div>
  <div class="toast-container" id="toast-container"></div>
  <script>
    var currentVisibility = '${page.visibility}';
    var pageId = '${page.id}';

    function showToast(msg, type) {
      type = type || 'info';
      var icons = {
        success: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>',
        error: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>',
        info: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>'
      };
      var t = document.createElement('div');
      t.className = 'toast toast-' + type;
      t.innerHTML = '<span class="toast-icon">' + (icons[type] || '') + '</span>' + msg;
      document.getElementById('toast-container').appendChild(t);
      requestAnimationFrame(function() { requestAnimationFrame(function() { t.classList.add('show'); }); });
      setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 300); }, 2500);
    }

    function shareDoc() {
      var url = '${pageUrl}';
      navigator.clipboard.writeText(url).then(function() {
        showToast('Link copied!', 'success');
      }).catch(function() {
        window.open(url, '_blank');
      });
    }

    async function setVisibility(newVis) {
      if (newVis === currentVisibility) return;
      try {
        var res = await fetch('/api/pages/' + pageId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visibility: newVis })
        });
        if (!res.ok) throw new Error('Failed');
        currentVisibility = newVis;
        var priv = document.getElementById('vis-private');
        var pub = document.getElementById('vis-public');
        if (newVis === 'public') {
          priv.classList.remove('active-private');
          pub.classList.add('active-public');
          showToast('Page is now public', 'success');
        } else {
          pub.classList.remove('active-public');
          priv.classList.add('active-private');
          showToast('Page is now private', 'success');
        }
      } catch(e) {
        showToast('Failed to update visibility', 'error');
      }
    }
  </script>
</body>
</html>`;
}

// --- Editor Page -------------------------------------------------------------

interface EditorPageData {
  user: { username: string; display_name: string | null; avatar_url: string | null };
  pages: Array<{ id: string; slug: string }>;
  page?: { id: string; slug: string; visibility: string; markdown: string };
  origin: string;
}

export function editorPageHtml(data: EditorPageData): string {
  const { user, pages, page } = data;
  const isNew = !page;
  const name = page ? escapeHtml(page.slug) : "";
  const markdown = page ? escapeHtml(page.markdown) : "";
  const visibility = page ? page.visibility : "public";
  const heading = isNew ? "New Doc" : "Edit Doc";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading} — md.page</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>${APP_STYLES}</style>
</head>
<body>
  <div class="app-layout">
    ${buildSidebar({ user, pages, activeSlug: page?.slug })}
    <main class="main-content">
      <div class="main-header">
        <h1>${heading}</h1>
        <div class="header-right">
        </div>
      </div>
      <div class="editor-container">
        <form id="editor-form" onsubmit="return savePage(event)">
          <div class="editor-meta-row">
            <div class="form-group">
              <label for="doc-name">Name <span style="color: var(--text-muted); font-weight: 400; font-family: var(--mono); font-size: 0.72rem;">${escapeHtml(user.username)}.md.page/<span id="name-preview">${name || "my-document"}</span></span></label>
              <input type="text" id="doc-name" value="${name}" placeholder="my-document" pattern="[a-z0-9][a-z0-9-]*[a-z0-9]" title="Lowercase letters, numbers, and hyphens" required>
            </div>
            <div class="form-group" style="flex: 0 0 auto;">
              <label>Visibility</label>
              <input type="hidden" id="doc-visibility" value="${visibility}">
              <div class="visibility-toggle">
                <button type="button" class="vis-opt${visibility === "public" ? " active-public" : ""}" onclick="setVis('public')">🌐 Public</button>
                <button type="button" class="vis-opt${visibility === "private" ? " active-private" : ""}" onclick="setVis('private')">🔒 Private</button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="doc-content">Content</label>
            <textarea id="doc-content" class="editor-area" placeholder="# Hello World&#10;&#10;Start writing in Markdown...">${markdown}</textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" id="save-btn">Save</button>
            <a href="/${name || ''}" class="btn btn-outline">Cancel</a>
            ${!isNew ? `<button type="button" class="btn btn-ghost" style="color: var(--danger); margin-left: auto;" title="Delete" onclick="deletePage('${page!.id}')"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 4 4 4 13 4"/><path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1"/><path d="M4 4l1 10h6l1-10"/><line x1="7" y1="7" x2="7" y2="12"/><line x1="9" y1="7" x2="9" y2="12"/></svg></button>` : ''}
            <span id="save-status" class="save-status"></span>
          </div>
        </form>
      </div>
    </main>
  </div>
  <div class="toast-container" id="toast-container"></div>
  <div id="confirm-root"></div>
  <script>
    function showToast(msg, type) {
      type = type || 'info';
      var icons = {
        success: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>',
        error: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>',
        info: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>'
      };
      var t = document.createElement('div');
      t.className = 'toast toast-' + type;
      t.innerHTML = '<span class="toast-icon">' + (icons[type] || '') + '</span>' + msg;
      document.getElementById('toast-container').appendChild(t);
      requestAnimationFrame(function() { requestAnimationFrame(function() { t.classList.add('show'); }); });
      setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 300); }, 2500);
    }

    function showConfirm(title, msg, onConfirm) {
      var root = document.getElementById('confirm-root');
      root.innerHTML = '<div class="confirm-overlay" onclick="if(event.target===this)dismissConfirm()"><div class="confirm-box">' +
        '<div class="confirm-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h12"/><path d="M5.3 4V2.7a1.3 1.3 0 011.4-1.4h2.6a1.3 1.3 0 011.4 1.4V4"/><path d="M12.7 4v9.3a1.3 1.3 0 01-1.4 1.4H4.7a1.3 1.3 0 01-1.4-1.4V4"/></svg></div>' +
        '<h3>' + title + '</h3><p>' + msg + '</p>' +
        '<div class="confirm-actions"><button class="confirm-cancel" onclick="dismissConfirm()">Cancel</button>' +
        '<button class="confirm-delete" id="confirm-yes">Delete</button></div></div></div>';
      document.getElementById('confirm-yes').onclick = function() { dismissConfirm(); onConfirm(); };
    }

    function dismissConfirm() { document.getElementById('confirm-root').innerHTML = ''; }

    const nameInput = document.getElementById('doc-name');
    const namePreview = document.getElementById('name-preview');
    const isNew = ${isNew ? "true" : "false"};
    const pageId = ${page ? `"${page.id}"` : "null"};

    function setVis(v) {
      document.getElementById('doc-visibility').value = v;
      document.querySelectorAll('.vis-opt').forEach(b => {
        b.classList.remove('active-public', 'active-private');
      });
      const btns = document.querySelectorAll('.vis-opt');
      if (v === 'public') btns[0].classList.add('active-public');
      else btns[1].classList.add('active-private');
    }

    nameInput.addEventListener('input', () => {
      const s = nameInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
      nameInput.value = s;
      namePreview.textContent = s || 'my-document';
    });

    function deletePage(id) {
      showConfirm('Delete this doc?', 'This action cannot be undone. The page will be permanently removed.', async function() {
        const res = await fetch('/api/pages/' + id, { method: 'DELETE' });
        if (res.ok) window.location.href = '/';
        else showToast('Failed to delete', 'error');
      });
    }

    async function savePage(e) {
      e.preventDefault();
      const btn = document.getElementById('save-btn');
      const status = document.getElementById('save-status');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      status.textContent = '';

      const name = nameInput.value;
      const body = {
        markdown: document.getElementById('doc-content').value,
        title: name,
        slug: name,
        visibility: document.getElementById('doc-visibility').value,
      };

      try {
        let res;
        if (isNew) {
          res = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        } else {
          res = await fetch('/api/pages/' + pageId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        }
        const data = await res.json();
        if (res.ok) {
          showToast('Saved successfully', 'success');
          var slug = isNew ? (data.slug || nameInput.value) : nameInput.value;
          setTimeout(function() { window.location.href = '/' + slug; }, 600);
        } else {
          showToast(data.error || 'Failed to save', 'error');
        }
      } catch {
        showToast('Network error', 'error');
      }
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  </script>
</body>
</html>`;
}

// --- Settings Page -----------------------------------------------------------

interface SettingsPageData {
  user: { username: string; display_name: string | null; avatar_url: string | null };
  pages: Array<{ id: string; slug: string }>;
  keys: Array<{ id: string; label: string | null; last_used_at: string | null; created_at: string }>;
  origin: string;
}

export function settingsPageHtml(data: SettingsPageData): string {
  const { user, pages, keys } = data;

  const KEY_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.5a3.5 3.5 0 010 7 3.5 3.5 0 010-7z"/><path d="M8.3 7.7l-6.8 6.8"/><path d="M4 12l2 2"/><path d="M6.5 9.5l2 2"/></svg>`;
  const GLOBE_ICON = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M1.5 8h13"/><path d="M8 1.5c1.7 2 2.7 4.2 2.7 6.5s-1 4.5-2.7 6.5"/><path d="M8 1.5c-1.7 2-2.7 4.2-2.7 6.5s1 4.5 2.7 6.5"/></svg>`;
  const LOGOUT_ICON = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3"/><polyline points="10 11 14 8 10 5"/><line x1="14" y1="8" x2="6" y2="8"/></svg>`;

  const keyRows = keys.length === 0
    ? `<div class="keys-empty">No API keys yet. Create one to use the md.page API.</div>`
    : keys.map(k => {
        const safeLabel = escapeHtml(k.label || 'Untitled');
        return `<div class="key-row">
          <span class="key-name"><span class="key-name-icon">${KEY_ICON}</span>${safeLabel}</span>
          <span class="key-masked">mdp_${'*'.repeat(28)}</span>
          <div class="key-actions">
            <button class="key-act" title="Rename" onclick="renameKey('${k.id}', '${safeLabel}')">${PENCIL_ICON}</button>
            <button class="key-act danger" title="Delete" onclick="deleteKey('${k.id}')">${TRASH_ICON}</button>
          </div>
        </div>`;
      }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Settings — md.page</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>${APP_STYLES}</style>
</head>
<body>
  <div class="app-layout">
    ${buildSidebar({ user, pages, activeSection: 'settings' })}
    <main class="main-content">
      <div class="main-header">
        <h1>Settings</h1>
      </div>
      <div class="settings-container">

        <section class="settings-section">
          <h2>Subdomain</h2>
          <div class="subdomain-box">
            <span class="subdomain-icon">${GLOBE_ICON}</span>
            <span>${escapeHtml(user.username)}.md.page</span>
          </div>
        </section>

        <section class="settings-section">
          <h2>API Keys</h2>
          <div class="keys-table">
            ${keys.length > 0 ? `<div class="keys-header"><span>Name</span><span>Key</span><span></span></div>` : ''}
            ${keyRows}
          </div>
          <div class="add-key-row">
            <button class="add-key-btn" onclick="createKey()">${PLUS_ICON} New Key</button>
          </div>
        </section>

        <section class="settings-section sign-out-section">
          <form method="POST" action="/auth/logout">
            <button type="submit" class="sign-out-btn">${LOGOUT_ICON} Sign out</button>
          </form>
        </section>

      </div>
    </main>
  </div>

  <div class="toast-container" id="toast-container"></div>
  <div id="confirm-root"></div>

  <div id="rename-modal" class="modal-overlay" style="display:none;" onclick="if(event.target===this)closeModal()">
    <div class="modal-box">
      <h3>Rename API Key</h3>
      <input type="text" id="rename-input" placeholder="Key name">
      <div class="modal-actions">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="submitRename()">Save</button>
      </div>
    </div>
  </div>

  <div id="newkey-modal" class="modal-overlay" style="display:none;" onclick="if(event.target===this)closeNewKeyModal()">
    <div class="modal-box">
      <h3>New API Key</h3>
      <input type="text" id="newkey-input" placeholder='e.g. claude-code, cursor'>
      <div class="modal-actions">
        <button class="btn btn-outline btn-sm" onclick="closeNewKeyModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="submitNewKey()">Create</button>
      </div>
    </div>
  </div>

  <script>
    function showToast(msg, type) {
      type = type || 'info';
      var icons = {
        success: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>',
        error: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>',
        info: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>'
      };
      var t = document.createElement('div');
      t.className = 'toast toast-' + type;
      t.innerHTML = '<span class="toast-icon">' + (icons[type] || '') + '</span>' + msg;
      document.getElementById('toast-container').appendChild(t);
      requestAnimationFrame(function() { requestAnimationFrame(function() { t.classList.add('show'); }); });
      setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 300); }, 2500);
    }

    function showConfirm(title, msg, onConfirm) {
      var root = document.getElementById('confirm-root');
      root.innerHTML = '<div class="confirm-overlay" onclick="if(event.target===this)dismissConfirm()"><div class="confirm-box">' +
        '<div class="confirm-icon"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h12"/><path d="M5.3 4V2.7a1.3 1.3 0 011.4-1.4h2.6a1.3 1.3 0 011.4 1.4V4"/><path d="M12.7 4v9.3a1.3 1.3 0 01-1.4 1.4H4.7a1.3 1.3 0 01-1.4-1.4V4"/></svg></div>' +
        '<h3>' + title + '</h3><p>' + msg + '</p>' +
        '<div class="confirm-actions"><button class="confirm-cancel" onclick="dismissConfirm()">Cancel</button>' +
        '<button class="confirm-delete" id="confirm-yes">Delete</button></div></div></div>';
      document.getElementById('confirm-yes').onclick = function() { dismissConfirm(); onConfirm(); };
    }

    function dismissConfirm() { document.getElementById('confirm-root').innerHTML = ''; }

    let renameKeyId = null;

    function copyText(text) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard', 'success');
      });
    }

    function createKey() {
      document.getElementById('newkey-input').value = '';
      document.getElementById('newkey-modal').style.display = 'flex';
      document.getElementById('newkey-input').focus();
    }

    function closeNewKeyModal() {
      document.getElementById('newkey-modal').style.display = 'none';
    }

    async function submitNewKey() {
      const label = document.getElementById('newkey-input').value;
      closeNewKeyModal();
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label || undefined })
      });
      const data = await res.json();
      if (data.key) {
        navigator.clipboard.writeText(data.key);
        showToast('API key created and copied to clipboard', 'success');
        setTimeout(function() { location.reload(); }, 1500);
      } else {
        showToast(data.error || 'Failed to create key', 'error');
      }
    }

    function deleteKey(id) {
      showConfirm('Delete API key?', 'This key will stop working immediately. This cannot be undone.', async function() {
        const res = await fetch('/api/keys/' + id, { method: 'DELETE' });
        if (res.ok) { showToast('API key deleted', 'success'); setTimeout(function() { location.reload(); }, 800); }
        else showToast('Failed to delete key', 'error');
      });
    }

    function renameKey(id, currentName) {
      renameKeyId = id;
      document.getElementById('rename-input').value = currentName;
      document.getElementById('rename-modal').style.display = 'flex';
      document.getElementById('rename-input').focus();
    }

    function closeModal() {
      document.getElementById('rename-modal').style.display = 'none';
      renameKeyId = null;
    }

    async function submitRename() {
      if (!renameKeyId) return;
      const label = document.getElementById('rename-input').value;
      closeModal();
      const res = await fetch('/api/keys/' + renameKeyId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label })
      });
      if (res.ok) { showToast('Key renamed', 'success'); setTimeout(function() { location.reload(); }, 800); }
      else showToast('Failed to rename key', 'error');
    }

    document.getElementById('rename-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); submitRename(); }
      if (e.key === 'Escape') closeModal();
    });

    document.getElementById('newkey-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); submitNewKey(); }
      if (e.key === 'Escape') closeNewKeyModal();
    });
  </script>
</body>
</html>`;
}

// --- Welcome Doc Content ---------------------------------------------------

export const WELCOME_DOC_MARKDOWN = `# Welcome to md.page

You're in. Here's everything you need to know.

## What is md.page?

md.page turns Markdown into shareable web pages — instantly. No build step, no deploy, no infrastructure. Write Markdown, get a URL.

Every page you create lives at \\\`your-username.md.page/slug\\\`.

## What you can do

- **Create docs** — Write in Markdown, publish with one click
- **Share instantly** — Every doc gets a permanent, shareable URL
- **Use the API** — Programmatic publishing via API keys
- **AI integration** — Publish directly from Claude Code, Cursor, or any AI workflow

## Quick start

### From the dashboard

Click **"New Doc"** in the sidebar to create a page.

### From Claude Code

\\\`\\\`\\\`
/publish-to-mdpage
\\\`\\\`\\\`

### From the API

\\\`\\\`\\\`bash
curl -X POST https://md.page/api/pages \\\\
  -H "Authorization: Bearer YOUR_API_KEY" \\\\
  -H "Content-Type: application/json" \\\\
  -d '{"markdown": "# Hello World", "title": "My Page"}'
\\\`\\\`\\\`

Create an API key in **Settings** to get started.

## Where we are

We just launched md.page and you're one of our first users. The platform is currently **free** with a limit of **10 docs** per account.

We're building in the open and would love your feedback. If you have ideas, run into bugs, or want to request a feature — we'd love to hear from you.

## What's coming

- Custom domains
- Collaboration
- Page analytics
- Themes and custom styling

Thanks for being early. Now go publish something.
`;

export const WELCOME_DOC_TITLE = "Welcome to md.page";
export const WELCOME_DOC_SLUG = "welcome";
