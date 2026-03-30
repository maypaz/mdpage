export const PAGE_TTL_SECONDS = 86_400;
export const PAGE_ID_LENGTH = 6;
export const PAGE_ID_PATTERN = /^[a-zA-Z0-9]{6}$/;
export const PAGE_ROUTE_PATTERN = /^\/(?<id>[a-zA-Z0-9]{6})$/;
export const OG_PAGE_ROUTE_PATTERN = /^\/og\/(?<id>[a-zA-Z0-9]{6})\.png$/;
export const PAGE_ID_CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const MAX_MARKDOWN_LENGTH = 500_000;
export const PUBLISHES_PER_HOUR_LIMIT = 60;
export const RATE_LIMIT_WINDOW_SECONDS = 3_600;
export const MARKDOWN_PREVIEW_LENGTH = 1_500;
export const DEFAULT_DESCRIPTION = "A page created with md.page";
export const DEFAULT_TITLE = "md.page";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const ANALYTICS_EVENTS = {
  homepageVisit: "homepage_visit",
  pagePublish: "page_publish",
  pageView: "page_view",
  githubClick: "github_click",
  copyPromptClick: "copy_prompt_click",
} as const;

export const TRACKABLE_CLIENT_EVENTS = [
  ANALYTICS_EVENTS.githubClick,
  ANALYTICS_EVENTS.copyPromptClick,
] as const;

export const FONT_URLS = {
  bold: "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.8/latin-700-normal.ttf",
  regular: "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.8/latin-400-normal.ttf",
} as const;
