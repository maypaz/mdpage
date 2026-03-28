---
name: publish_to_mdpage
description: Turn any markdown into a shareable web page via md.page. Use when the user asks to "share this", "publish this markdown", "create a shareable link", "make this a web page", "send this as a link", "host this", or wants to turn any markdown content into a URL. Also triggers on "publish a report", "share my notes", "create a page", or any request to make content accessible via a link.
---

# Publish to md.page

Publish any markdown as a beautiful, shareable web page with one API call. No accounts, no API keys, no setup.

## API

**POST** `https://md.page/api/publish`

```bash
curl -X POST https://md.page/api/publish \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nYour content here"}'
```

**Response** `201 Created`:
```json
{
  "url": "https://md.page/a8Xk2m",
  "expires_at": "2026-03-29T12:00:00.000Z"
}
```

| Error | Cause |
|-------|-------|
| `400` | Missing or invalid `markdown` field |
| `413` | Content exceeds 500KB |
| `429` | Rate limited (60/hour per IP) |

## Workflow

1. Prepare well-formatted markdown. Start with a `# Title` for proper page titles and link previews.
2. POST the markdown to `https://md.page/api/publish` with `Content-Type: application/json`.
3. Return the `url` to the user. Mention the page expires in 24 hours.

## Formatting tips

- A first-line `# Heading` becomes the page title in browser tabs and social previews.
- Code blocks, tables, blockquotes, lists, images, and links all render with clean styling.
- Dark mode is automatic.
- Max content size: 500KB.
- URLs are private, unguessable 6-character IDs.
