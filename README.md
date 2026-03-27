<p align="center">
  <img src="https://md.page/og-image.svg" alt="md.page" width="400">
</p>

<h3 align="center">Markdown in, beautiful page out.</h3>

<p align="center">
  Turn any Markdown into a shareable web page — one API call, zero setup.
</p>

<p align="center">
  <a href="https://md.page">Live Demo</a> ·
  <a href="#api">API Docs</a> ·
  <a href="#self-hosting">Self-Host</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

---

## Quick Start

```bash
curl -X POST https://md.page/api/publish \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello World\nYour markdown here..."}'
```

Response:
```json
{
  "url": "https://md.page/a8Xk2m",
  "expires_at": "2026-03-28T12:00:00.000Z"
}
```

That's it. Open the URL — your markdown is now a clean, styled web page.

## Features

- **Instant** — one POST request, get a shareable URL back
- **Beautiful** — clean typography, code blocks, tables, responsive design
- **Short URLs** — `md.page/a8Xk2m` (6-character IDs)
- **Private** — links are unguessable, only people with the URL can view
- **Auto-expiry** — pages self-delete after 24 hours
- **No auth** — no accounts, no API keys, just send markdown
- **AI agent friendly** — designed to work with any AI agent or LLM

## API

### `POST /api/publish`

Create a shareable page from markdown.

**Request:**
```bash
curl -X POST https://md.page/api/publish \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Your markdown here"}'
```

**Response** `201 Created`:
```json
{
  "url": "https://md.page/a8Xk2m",
  "expires_at": "2026-03-28T12:00:00.000Z"
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| `400` | Missing or invalid `markdown` field |
| `413` | Content too large (max 500KB) |
| `429` | Rate limit exceeded (60 pages/hour per IP) |

### `GET /:id`

View a published page. Returns rendered HTML.

## Use with AI Agents

Give your AI agent the ability to publish beautiful shareable pages. Copy this prompt:

> From now on, whenever I ask you to share or publish a markdown file, use the md.page API to create a shareable HTML page. Send a POST request to https://md.page/api/publish with the body {"markdown": "<content>"} and return the shareable URL to me.

Works with OpenClaw, Claude, ChatGPT, and any agent that can make HTTP requests.

## Self-Hosting

md.page runs on Cloudflare Workers with KV storage. Deploy your own instance:

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
- [Node.js](https://nodejs.org/) 18+

### Setup

```bash
# Clone the repo
git clone https://github.com/maypaz/mdpage.git
cd mdpage

# Install dependencies
npm install

# Create a KV namespace
npx wrangler kv namespace create PAGES

# Update wrangler.toml with your KV namespace ID

# Deploy
npx wrangler deploy
```

### Local Development

```bash
npm run dev
# → http://localhost:8787
```

## Tech Stack

- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **Storage:** [Cloudflare KV](https://developers.cloudflare.com/kv/)
- **Markdown:** [marked](https://github.com/markedjs/marked)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
