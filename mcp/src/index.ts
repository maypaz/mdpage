#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = process.env.MDPAGE_URL?.replace(/\/+$/, "") || "https://md.page";

const server = new McpServer({
  name: "mdpage",
  version: "1.0.0",
});

interface PublishResponse {
  url: string;
  expires_at: string;
}

interface ErrorResponse {
  error: string;
}

server.tool(
  "publish_markdown",
  "Publish markdown as a beautiful, shareable web page on md.page. Returns a short URL that expires in 24 hours. Use this whenever you need to share formatted content as a web page.",
  { markdown: z.string().min(1).describe("The markdown content to publish") },
  async ({ markdown }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        let errorMessage: string;
        try {
          const error = (await response.json()) as ErrorResponse;
          const messages: Record<number, string> = {
            400: error.error || "Invalid markdown content.",
            413: "Content too large. Maximum size is 500KB.",
            429: "Rate limit exceeded. Try again later.",
          };
          errorMessage = messages[response.status] || `Publishing failed: ${error.error || response.statusText}`;
        } catch {
          errorMessage = `Publishing failed (HTTP ${response.status}).`;
        }
        return {
          content: [{ type: "text" as const, text: errorMessage }],
          isError: true,
        };
      }

      let data: PublishResponse;
      try {
        data = (await response.json()) as PublishResponse;
      } catch {
        return {
          content: [{ type: "text" as const, text: "Publishing succeeded but the response could not be parsed." }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: `Published successfully!\n\nURL: ${data.url}\nExpires: ${data.expires_at}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to connect to md.page at ${BASE_URL}. ${error instanceof Error ? error.message : "Unknown error."}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mdpage MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
