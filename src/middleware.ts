import { createMiddleware } from "hono/factory";
import type { Env } from "./types";
import { getUserFromCookie, getUserFromApiKey } from "./auth";
import { emit } from "./utils";

export type User = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

type AuthEnv = {
  Bindings: Env;
  Variables: { user: User };
};

/** Resolves user from cookie or API key. Sets c.var.user. Returns 401 if not authenticated. */
export const authRequired = createMiddleware<AuthEnv>(async (c, next) => {
  let user = await getUserFromCookie(c.env.DB, c.req.header("cookie") ?? null);

  if (!user) {
    user = await getUserFromApiKey(c.env.DB, c.req.header("authorization") ?? null);
    if (user) emit(c.env, "api_request");
  }

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", user);
  await next();
});
