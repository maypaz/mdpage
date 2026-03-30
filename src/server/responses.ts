export function json(data: unknown, init: ResponseInit = {}): Response {
  return Response.json(data, init);
}

export function html(body: string, init: ResponseInit = {}): Response {
  return new Response(body, {
    ...init,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      ...(init.headers ?? {}),
    },
  });
}

export function text(body: string, init: ResponseInit = {}): Response {
  return new Response(body, init);
}
