# mdpage-mcp

MCP server for [md.page](https://md.page) — give AI agents the ability to publish markdown as beautiful, shareable web pages.

## Quick Setup

Add to your MCP client config:

### Cursor

In `.cursor/mcp.json`:

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

### Claude Desktop

In `claude_desktop_config.json`:

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

### VS Code (GitHub Copilot)

In `.vscode/mcp.json`:

```json
{
  "servers": {
    "mdpage": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mdpage-mcp"]
    }
  }
}
```

## Tools

### `publish_markdown`

Publish markdown as a shareable web page. Returns a short URL that expires in 24 hours.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `markdown` | string | Yes | The markdown content to publish |

**Example response:**

```
Published successfully!

URL: https://md.page/a8Xk2m
Expires: 2026-03-28T12:00:00.000Z
```

## Self-Hosted Instances

To use with a self-hosted md.page instance, set the `MDPAGE_URL` environment variable:

```json
{
  "mcpServers": {
    "mdpage": {
      "command": "npx",
      "args": ["-y", "mdpage-mcp"],
      "env": {
        "MDPAGE_URL": "https://my-instance.example.com"
      }
    }
  }
}
```

## Development

```bash
cd mcp
npm install
npm run build
```

Test with the MCP Inspector or any MCP client:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## License

[MIT](../LICENSE)
