import type { Env } from "../types";

export class AnalyticsService {
  constructor(private readonly env: Env) {}

  track(event: string, detail = ""): void {
    try {
      this.env.ANALYTICS.writeDataPoint({
        blobs: [event, detail],
        indexes: [event],
      });
    } catch {
      // Analytics should never break the request lifecycle.
    }
  }
}
