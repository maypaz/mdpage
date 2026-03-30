import type { Services } from "../app";
import type { Env } from "../types";

export interface RequestContext {
  request: Request;
  url: URL;
  env: Env;
  services: Services;
  params: Record<string, string>;
}
