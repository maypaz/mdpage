import { registerApiRoutes } from "./routes/api-routes";
import { registerPageRoutes } from "./routes/page-routes";
import { registerStaticRoutes } from "./routes/static-routes";
import { AnalyticsService } from "./services/analytics-service";
import { MarkdownService } from "./services/markdown-service";
import { OgImageService } from "./services/og-image-service";
import { PageRepository } from "./services/page-repository";
import { PageService } from "./services/page-service";
import { Router } from "./server/router";
import type { Env } from "./types";

export interface Services {
  analytics: AnalyticsService;
  ogImage: OgImageService;
  pages: PageService;
}

function createServices(env: Env): Services {
  const repository = new PageRepository(env.PAGES);
  const markdown = new MarkdownService();

  return {
    analytics: new AnalyticsService(env),
    ogImage: new OgImageService(),
    pages: new PageService(repository, markdown),
  };
}

export function createApp(env: Env) {
  const services = createServices(env);
  const router = new Router();

  registerApiRoutes(router);
  registerPageRoutes(router);
  registerStaticRoutes(router);

  return {
    fetch(request: Request): Promise<Response> {
      return router.handle({
        request,
        url: new URL(request.url),
        env,
        services,
      });
    },
  };
}
