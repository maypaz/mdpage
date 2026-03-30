export interface Env {
  PAGES: KVNamespace;
  ANALYTICS: AnalyticsEngineDataset;
}

export interface StoredPage {
  html: string;
  title: string;
  description: string;
  markdownPreview?: string;
}

export interface PublishResult {
  id: string;
  url: string;
  expiresAt: string;
}
