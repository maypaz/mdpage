import { ANALYTICS_EVENTS, CORS_HEADERS, TRACKABLE_CLIENT_EVENTS } from "../config/constants";
import { json, text } from "../server/responses";
import type { Router } from "../server/router";

async function readJson<T>(request: Request): Promise<T> {
  return request.json<T>();
}

export function registerApiRoutes(router: Router): void {
  router.add("OPTIONS", "/api/publish", () => new Response(null, { headers: CORS_HEADERS }));
  router.add("OPTIONS", "/api/event", () => new Response(null, { headers: CORS_HEADERS }));

  router.add("POST", "/api/event", async ({ request, services }) => {
    try {
      const body = await readJson<{ event?: string }>(request);
      if (body.event && TRACKABLE_CLIENT_EVENTS.includes(body.event as typeof TRACKABLE_CLIENT_EVENTS[number])) {
        services.analytics.track(body.event);
      }
    } catch {
      // Invalid telemetry payloads are ignored on purpose.
    }

    return text("ok", { headers: CORS_HEADERS });
  });

  router.add("POST", "/api/publish", async ({ request, services, url }) => {
    const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";

    try {
      await services.pages.enforcePublishRateLimit(clientIp);
    } catch {
      return json(
        { error: "Rate limit exceeded. Max 60 pages per hour." },
        { status: 429, headers: CORS_HEADERS },
      );
    }

    let body: { markdown?: unknown };
    try {
      body = await readJson(request);
    } catch {
      return json({ error: "Invalid JSON body" }, { status: 400, headers: CORS_HEADERS });
    }

    let markdown: string;
    try {
      markdown = services.pages.validateMarkdown(body.markdown);
    } catch (error) {
      if ((error as Error).message === "INVALID_MARKDOWN") {
        return json({ error: "Missing 'markdown' field" }, { status: 400, headers: CORS_HEADERS });
      }
      return json({ error: "Content too large (max 500KB)" }, { status: 413, headers: CORS_HEADERS });
    }

    const result = await services.pages.publish(markdown, url.origin);
    services.analytics.track(ANALYTICS_EVENTS.pagePublish);

    return json(
      { url: result.url, expires_at: result.expiresAt },
      { status: 201, headers: CORS_HEADERS },
    );
  });
}
