# API Spec

## Conventions

- JSON APIs use `application/json`.
- API routes return permissive CORS headers for browser-based callers.
- Validation errors are explicit and stable.

## Routes

### `OPTIONS /api/publish`

- Purpose: CORS preflight.
- Response: `200` with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.

### `POST /api/publish`

- Purpose: Create a shareable page from Markdown.
- Request body:

```json
{
  "markdown": "# Hello World"
}
```

- Success response: `201`

```json
{
  "url": "https://md.page/a8Xk2m",
  "expires_at": "2026-03-30T12:00:00.000Z"
}
```

- Error responses:
  - `400` when the body is invalid JSON.
  - `400` when `markdown` is missing or not a string.
  - `413` when Markdown exceeds 500 KB.
  - `429` when the publish rate limit is exceeded.

### `OPTIONS /api/event`

- Purpose: CORS preflight.
- Response: `200` with the standard API CORS headers.

### `POST /api/event`

- Purpose: Record allowed client-side events.
- Accepted payload:

```json
{
  "event": "github_click"
}
```

- Accepted event names:
  - `github_click`
  - `copy_prompt_click`

- Success response: `200` with body `ok`.
- Unknown events are ignored without error.

### `GET /`

- Purpose: Serve the product landing page.
- Response: `200` HTML.

### `GET /privacy`

- Purpose: Serve the privacy policy.
- Response: `200` HTML.

### `GET /favicon.svg`

- Purpose: Serve the site favicon.
- Response: `200` SVG.

### `GET /logo.svg`

- Purpose: Serve the site logo.
- Response: `200` SVG.

### `GET /og-image.png`

- Purpose: Serve the fallback OG image.
- Response: `200` PNG.

### `GET /:id`

- Purpose: Render a published page.
- Path constraint: `:id` must be exactly 6 alphanumeric characters.
- Success response: `200` HTML with `X-Robots-Tag: noindex` and `Cache-Control: no-store`.
- Error response: `404` plain text when the page is missing or expired.

### `GET /og/:id.png`

- Purpose: Serve a page-specific OG image.
- Path constraint: `:id` must be exactly 6 alphanumeric characters.
- Success response: `200` PNG.
- Missing page response: `404` PNG fallback image.
- Render failure response: `200` PNG fallback image.
