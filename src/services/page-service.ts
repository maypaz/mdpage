import {
  MARKDOWN_PREVIEW_LENGTH,
  MAX_MARKDOWN_LENGTH,
  PAGE_TTL_SECONDS,
  PUBLISHES_PER_HOUR_LIMIT,
  RATE_LIMIT_WINDOW_SECONDS,
} from "../config/constants";
import { generateId } from "../domain/id";
import type { PublishResult, StoredPage } from "../types";
import { MarkdownService } from "./markdown-service";
import { PageRepository } from "./page-repository";

export class PageService {
  constructor(
    private readonly repository: PageRepository,
    private readonly markdownService: MarkdownService,
  ) {}

  async enforcePublishRateLimit(clientIp: string): Promise<void> {
    const rateKey = `rate:${clientIp}`;
    const current = await this.repository.getPublishCount(rateKey);
    if (current >= PUBLISHES_PER_HOUR_LIMIT) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    await this.repository.incrementPublishCount(rateKey, current + 1, RATE_LIMIT_WINDOW_SECONDS);
  }

  validateMarkdown(markdown: unknown): string {
    if (!markdown || typeof markdown !== "string") {
      throw new Error("INVALID_MARKDOWN");
    }
    if (markdown.length > MAX_MARKDOWN_LENGTH) {
      throw new Error("MARKDOWN_TOO_LARGE");
    }
    return markdown;
  }

  async publish(markdown: string, origin: string): Promise<PublishResult> {
    const id = generateId();
    const rendered = this.markdownService.render(markdown);
    const page: StoredPage = {
      ...rendered,
      markdownPreview: markdown.slice(0, MARKDOWN_PREVIEW_LENGTH),
    };

    await this.repository.savePage(id, page, PAGE_TTL_SECONDS);

    return {
      id,
      url: `${origin}/${id}`,
      expiresAt: new Date(Date.now() + PAGE_TTL_SECONDS * 1000).toISOString(),
    };
  }

  async getPage(id: string): Promise<StoredPage | null> {
    const stored = await this.repository.getPage(id);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as StoredPage;
  }
}
