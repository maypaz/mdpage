import { env, exports } from "cloudflare:workers";

declare module "cloudflare:workers" {
  namespace Cloudflare {
    interface Env {
      PAGES: KVNamespace;
    }
  }
  interface ProvidedEnv extends Cloudflare.Env {}
}

export async function clearKV(): Promise<void> {
  const keys = await env.PAGES.list();
  for (const key of keys.keys) {
    await env.PAGES.delete(key.name);
  }
}

export function publish(markdown: string): Promise<Response> {
  return exports.default.fetch(
    new Request("https://md.page/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown }),
    }),
  );
}

export { env, exports };
