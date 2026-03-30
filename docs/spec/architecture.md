# Architecture Spec

## Design principles

- Keep the Worker entrypoint thin.
- Separate HTTP routing from domain logic.
- Isolate storage, analytics, and OG generation behind services.
- Keep pure Markdown and OG helpers importable for focused tests.
- Prefer explicit contracts over hidden conventions.

## Runtime layers

### Entry

- `src/index.ts` exposes the Worker `fetch` handler.
- `src/app.ts` assembles the router and service graph.

### HTTP layer

- `src/server/router.ts` handles route registration and dispatch.
- `src/server/context.ts` defines the request context shared by handlers.
- `src/routes/*.ts` declare route handlers grouped by concern:
  - API routes
  - page routes
  - static/site routes

### Service layer

- `src/services/page-service.ts`
  - publish page workflow
  - page lookup workflow
  - rate limit coordination
- `src/services/page-repository.ts`
  - KV reads and writes
  - rate counter persistence
- `src/services/markdown-service.ts`
  - Markdown rendering
  - metadata extraction
- `src/services/analytics-service.ts`
  - safe analytics writes
- `src/services/og-image-service.ts`
  - dynamic OG rendering
  - fallback image delivery

### Domain and presentation

- `src/domain/*.ts` contains pure business logic such as ID generation and Markdown text parsing.
- `src/presentation/*.ts` contains HTML templates and static asset constants.
- `src/config/constants.ts` centralizes limits, route patterns, and cache settings.

## Request lifecycle

1. Worker entrypoint builds the application.
2. Router matches method and path to a handler.
3. Handler validates input and calls services.
4. Services coordinate repositories and domain helpers.
5. Handler formats the final HTTP response.

## Testing strategy

- Pure helpers are tested directly.
- The Worker contract is tested through request/response integration tests.
- The exported helper surface remains stable for the existing test style.
