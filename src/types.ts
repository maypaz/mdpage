export interface Env {
  PAGES: KVNamespace;
  ANALYTICS: AnalyticsEngineDataset;
  ASSETS_BUCKET: R2Bucket;
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
