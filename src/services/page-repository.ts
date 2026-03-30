import type { StoredPage } from "../types";

export class PageRepository {
  constructor(private readonly pages: KVNamespace) {}

  getPage(id: string): Promise<string | null> {
    return this.pages.get(id);
  }

  savePage(id: string, page: StoredPage, ttlSeconds: number): Promise<void> {
    return this.pages.put(id, JSON.stringify(page), { expirationTtl: ttlSeconds });
  }

  async getPublishCount(rateKey: string): Promise<number> {
    const value = await this.pages.get(rateKey);
    return Number.parseInt(value ?? "0", 10);
  }

  incrementPublishCount(rateKey: string, nextValue: number, ttlSeconds: number): Promise<void> {
    return this.pages.put(rateKey, String(nextValue), { expirationTtl: ttlSeconds });
  }
}
