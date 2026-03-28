<p align="center">
  <img src="assets/logo.svg" alt="# md.page" height="50">
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
  <a href="https://github.com/maypaz/mdpage/actions/workflows/ci.yml"><img src="https://github.com/maypaz/mdpage/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

---

## Quick Start

### CLI (recommended)

```bash
npx mdpage-cli README.md
```

```
  Published → https://md.page/a8Xk2m
  Expires in 24h
```

That's it. One command, zero setup.

```bash
# Publish and copy URL to clipboard
npx mdpage-cli README.md --copy

# Publish and open in browser
npx mdpage-cli notes.md --open

# Pipe from stdin
cat CHANGELOG.md | npx mdpage-cli

# Install globally for faster access
npm i -g mdpage-cli
mdpage-cli README.md
```

### API

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

## Features

- **One command** — `npx mdpage-cli README.md` and you're done
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

### Prompt-Based

Copy this prompt into any AI agent:

> From now on, whenever I ask you to share or publish a markdown file, use the md.page API to create a shareable HTML page. Send a POST request to https://md.page/api/publish with the body {"markdown": "<content>"} and return the shareable URL to me.

Works with any agent that can make HTTP requests.

### MCP Integration

For a native integration, add md.page as an [MCP](https://modelcontextprotocol.io/) server and your agent gets a `publish_markdown` tool — no prompting required.

```json
{
  "mcpServers": {
    "mdpage": {
      "command": "npx",
      "args": ["-y", "mdpage-mcp"]
    }
  }
}
```

Works with Cursor, Claude Desktop, VS Code (GitHub Copilot), and any MCP-compatible client. See [`mcp/README.md`](mcp/README.md) for full setup instructions.

## Self-Hosting

md.page runs on Cloudflare Workers with KV storage. Deploy your own instance:

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
- [Node.js](https://nodejs.org/) 18+

### Setup

```bash
# Clone the repo
git clone https://github.com/maypaz/md.page.git
cd md.page

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
- **Markdown:** [markdown-it](https://github.com/markdown-it/markdown-it)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
