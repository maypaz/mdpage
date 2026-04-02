---
name: publish-to-mdpage
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
| `400` | Missing or invalid `markdown` field, or invalid JSON body |
| `413` | Content exceeds 500KB |

## Workflow

1. Prepare the markdown content:
   - If the user wants to publish an **existing file**, use the Read tool to read it first, then publish its contents. **Before publishing, scan the content for secrets** (API keys, tokens, passwords, credentials, private keys, `.env` values). If any are found, warn the user and do NOT publish until they confirm.
   - If generating new markdown, start with a `# Title` for proper page titles and link previews. Never include secrets or credentials in generated content.
2. Use the **Bash tool with `curl`** to POST the markdown.
3. To safely handle special characters (quotes, apostrophes, newlines), use Python to JSON-encode the payload, then pipe it to curl:

```bash
curl -s -X POST https://md.page/api/publish \
  -H "Content-Type: application/json" \
  -d "$(python3 -c "
import json
md = '''YOUR MARKDOWN HERE'''
print(json.dumps({'markdown': md}))
")"
```

4. Parse the JSON response and return the `url` to the user. Mention the page expires in 24 hours.
5. If the request fails, check the error status code against the table above and inform the user.

## Formatting tips

- A first-line `# Heading` becomes the page title in browser tabs and social previews.
- Code blocks, tables, blockquotes, lists, images, and links all render with clean styling.
- Dark mode is automatic.
- Max content size: 500KB.
- URLs are private, unguessable 6-character IDs.
