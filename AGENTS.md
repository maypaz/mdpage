# AGENTS

## Start here

Read these docs before making architectural changes:

1. `docs/spec/product.md`
2. `docs/spec/api.md`
3. `docs/spec/architecture.md`
4. `docs/spec/decisions.md`

## Code map

- `src/index.ts`: Worker entrypoint and stable exports used by tests.
- `src/app.ts`: application assembly.
- `src/server/`: routing and request context primitives.
- `src/routes/`: HTTP handlers by surface area.
- `src/services/`: workflows and infrastructure adapters.
- `src/domain/`: pure business logic helpers.
- `src/presentation/`: HTML templates and static asset payloads.
- `src/config/`: constants and shared configuration.

## Working rules

- Preserve the published API contract unless the spec docs are updated first.
- Put new business rules in domain or service modules, not route handlers.
- Keep route handlers thin and focused on HTTP input/output concerns.
- Update the relevant spec doc when behavior changes.
- Prefer extending tests alongside any change to API, rendering, or storage behavior.
