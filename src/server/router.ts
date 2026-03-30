import type { RequestContext } from "./context";

type RouteHandler = (context: RequestContext) => Promise<Response> | Response;
type RouteMatcher = (pathname: string) => Record<string, string> | null;

interface RouteDefinition {
  method: string;
  match: RouteMatcher;
  handler: RouteHandler;
}

function exact(pathname: string): RouteMatcher {
  return (candidate) => (candidate === pathname ? {} : null);
}

function pattern(regex: RegExp): RouteMatcher {
  return (candidate) => {
    const match = candidate.match(regex);
    if (!match) {
      return null;
    }
    const groups = match.groups ?? {};
    return Object.fromEntries(Object.entries(groups).filter(([, value]) => value !== undefined));
  };
}

export class Router {
  private readonly routes: RouteDefinition[] = [];

  add(method: string, pathOrPattern: string | RegExp, handler: RouteHandler): this {
    this.routes.push({
      method,
      match: typeof pathOrPattern === "string" ? exact(pathOrPattern) : pattern(pathOrPattern),
      handler,
    });
    return this;
  }

  async handle(context: Omit<RequestContext, "params">): Promise<Response> {
    for (const route of this.routes) {
      if (route.method !== context.request.method) {
        continue;
      }

      const params = route.match(context.url.pathname);
      if (params) {
        return route.handler({ ...context, params });
      }
    }

    return new Response("Not found", { status: 404 });
  }
}
