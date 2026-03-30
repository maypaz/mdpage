# Product Spec

## Purpose

`md.page` turns Markdown into a short-lived, shareable HTML page with a single API call.

## Core user journeys

1. A user sends Markdown to `POST /api/publish`.
2. The service stores a rendered HTML page and returns a short URL.
3. Anyone with the short URL can open the page until it expires.
4. Social platforms can fetch an OG image for the page.

## Product constraints

- No accounts, authentication flows, or API keys.
- Published pages expire after 24 hours.
- Published pages are intentionally discoverable only by possession of the URL, not by access control.
- Content is rendered from Markdown with raw HTML disabled.
- The product serves a landing page, privacy page, favicon, logo, and fallback OG image.

## Non-goals

- Persistent content storage.
- User-managed page editing or deletion.
- Search, indexing, or account dashboards.
- Strong secrecy guarantees for published content.

## Operational policies

- Publish requests are rate limited to 60 requests per hour per client IP.
- Page rendering failures for analytics or OG generation must not break the main page flow.
- Published pages should not be indexed by search engines.
