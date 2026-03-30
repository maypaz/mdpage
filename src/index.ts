import { createApp } from "./app";
import { escapeHtml } from "./domain/html";
import { generateId } from "./domain/id";
import { extractMeta, stripMarkdownInline } from "./domain/markdown";
import { generateOgSvg, parseMarkdownBlocks, wrapText } from "./domain/og";
import type { Env } from "./types";

export {
  escapeHtml,
  extractMeta,
  generateId,
  generateOgSvg,
  parseMarkdownBlocks,
  stripMarkdownInline,
  wrapText,
};

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return createApp(env).fetch(request);
  },
};
