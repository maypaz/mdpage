export interface Env {
  PAGES: KVNamespace;
  ANALYTICS: AnalyticsEngineDataset;
  ASSETS_BUCKET: R2Bucket;
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  AUTH_ENABLED: string; // "true" or "false"
}

export interface PageData {
  html: string;
  title: string;
  description: string;
  markdownPreview?: string;
}

export interface TemplateOptions {
  title?: string;
  description?: string;
  pageUrl?: string;
  origin?: string;
  ogImageUrl?: string;
  ogType?: string;
}
