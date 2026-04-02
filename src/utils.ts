import type { Env } from "./types";

const ID_LENGTH = 6;
const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateId(): string {
  const bytes = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("");
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function stripMarkdownInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

export function extractMeta(markdown: string): { title: string; description: string } {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? stripMarkdownInline(titleMatch[1]) : "md.page";
  const plainText = stripMarkdownInline(
    markdown
      .replace(/^#+\s+.+$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^\s*[-*+]\s/gm, "")
      .replace(/[>|#]/g, "")
      .replace(/\n+/g, " ")
  );
  const description = plainText.slice(0, 155) || "A page created with md.page";
  return { title, description };
}

export function emit(env: Env, event: string, detail = "") {
  try {
    env.ANALYTICS.writeDataPoint({
      blobs: [event, detail],
      indexes: [event],
    });
  } catch {
    // Never break the request
  }
}
