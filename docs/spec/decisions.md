# Engineering Decisions

## Decision 1: Keep Cloudflare Workers as the runtime

- Context: The current project already depends on Workers, KV, and Worker-focused tests.
- Decision: Refactor into a server-style architecture without changing the runtime.
- Why: This keeps deployment and behavior stable while still giving us routes, services, and modular boundaries.

## Decision 2: Use an internal router instead of adding a framework

- Context: The current codebase is tiny, but needs structure.
- Decision: Introduce a focused internal router abstraction.
- Why: It gives us explicit route modules and clean handlers without adding framework dependency weight or forcing a runtime migration.

## Decision 3: Separate route orchestration from services

- Context: The original file mixed validation, persistence, rendering, analytics, and asset delivery.
- Decision: Handlers own HTTP concerns; services own workflows and integrations.
- Why: This keeps business logic reusable and makes future changes easier to test in isolation.

## Decision 4: Preserve the existing public contract during refactor

- Context: Users and tests already depend on current paths, payloads, and headers.
- Decision: Preserve route shapes, response bodies, and key headers unless explicitly specified otherwise.
- Why: The refactor should improve engineering quality without creating behavioral regressions.

## Decision 5: Keep specs close to the code

- Context: The user asked for spec-driven engineering and better navigation for future agents.
- Decision: Store product, API, architecture, and decision docs under `docs/spec`.
- Why: Agents and contributors can orient quickly without reverse engineering the code first.
