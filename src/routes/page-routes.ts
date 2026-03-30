import { ANALYTICS_EVENTS, OG_PAGE_ROUTE_PATTERN, PAGE_ROUTE_PATTERN } from "../config/constants";
import { renderPageTemplate } from "../presentation/templates";
import { html, text } from "../server/responses";
import type { Router } from "../server/router";

export function registerPageRoutes(router: Router): void {
  router.add("GET", PAGE_ROUTE_PATTERN, async ({ params, services, url }) => {
    const page = await services.pages.getPage(params.id);
    if (!page) {
      return text("Page not found or expired.", {
        status: 404,
        headers: {
          "Content-Type": "text/plain",
          "X-Robots-Tag": "noindex",
        },
      });
    }

    const pageUrl = `${url.origin}/${params.id}`;
    const ogImageUrl = `${url.origin}/og/${params.id}.png`;
    const markup = renderPageTemplate(page.html, {
      title: page.title,
      description: page.description,
      pageUrl,
      origin: url.origin,
      ogImageUrl,
      ogType: "article",
    });

    services.analytics.track(ANALYTICS_EVENTS.pageView, params.id);

    return html(markup, {
      headers: {
        "X-Robots-Tag": "noindex",
        "Cache-Control": "no-store",
      },
    });
  });

  router.add("GET", OG_PAGE_ROUTE_PATTERN, async ({ params, services }) => {
    const page = await services.pages.getPage(params.id);
    if (!page) {
      return new Response(services.ogImage.fallbackPng(), {
        status: 404,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    try {
      const png = await services.ogImage.render(
        page.title || "md.page",
        page.markdownPreview || page.description || "",
      );
      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (error) {
      console.error("OG image render failed:", error);
      return new Response(services.ogImage.fallbackPng(), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  });
}
