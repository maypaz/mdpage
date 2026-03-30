import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "../config/constants";

export interface PageMeta {
  title: string;
  description: string;
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

export function extractMeta(markdown: string): PageMeta {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? stripMarkdownInline(titleMatch[1]) : DEFAULT_TITLE;
  const plainText = stripMarkdownInline(
    markdown
      .replace(/^#+\s+.+$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^\s*[-*+]\s/gm, "")
      .replace(/[>|#]/g, "")
      .replace(/\n+/g, " ")
  );
  const description = plainText.slice(0, 155) || DEFAULT_DESCRIPTION;
  return { title, description };
}
