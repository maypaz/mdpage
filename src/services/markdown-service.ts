import MarkdownIt from "markdown-it";
import { extractMeta } from "../domain/markdown";

const markdown = new MarkdownIt({ html: false });

export class MarkdownService {
  render(markdownSource: string) {
    const meta = extractMeta(markdownSource);
    return {
      html: markdown.render(markdownSource),
      title: meta.title,
      description: meta.description,
    };
  }
}
