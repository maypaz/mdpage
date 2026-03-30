import { ANALYTICS_EVENTS } from "../config/constants";
import { FAVICON_SVG, LOGO_SVG } from "../presentation/assets";
import { renderLandingPage, renderPrivacyPage } from "../presentation/templates";
import { html } from "../server/responses";
import type { Router } from "../server/router";

export function registerStaticRoutes(router: Router): void {
  router.add("GET", "/", ({ services, url }) => {
    services.analytics.track(ANALYTICS_EVENTS.homepageVisit);
    return html(renderLandingPage(url.origin));
  });

  router.add("GET", "/privacy", ({ url }) => html(renderPrivacyPage(url.origin)));

  router.add("GET", "/favicon.svg", () => new Response(FAVICON_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  }));

  router.add("GET", "/logo.svg", () => new Response(LOGO_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  }));

  router.add("GET", "/og-image.png", ({ services }) => new Response(services.ogImage.fallbackPng(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  }));
}
