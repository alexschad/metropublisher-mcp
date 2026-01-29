import { z } from "zod";
import { retryFetch } from "../util.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const outputSchema = {
  result: z.object({
    items: z.array(
      z.object({
        uuid: z.string(),
        title: z.string(),
        url: z.string(),
        urlname: z.string(),
      }),
    ),
    nextPage: z.number().nullable(),
  }),
};
const inputSchema = { page: z.number().optional().default(1) };

export const getContentTool = (server: McpServer) => {
  server.registerTool(
    "get_mp_content",
    {
      title: "Get Metro Publisher Content",
      description: "Get Metro Publisher content.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({ page }) => {
      const url = `/content?fields=uuid-title-url-urlname&rpp=10&page=${page}`;

      try {
        const data = await retryFetch(url, "application/json", "GET", "");
        const items = data.items.map((d: any) => ({
          uuid: d[0],
          title: d[1],
          url: d[2],
          urlname: d[3],
        }));
        let nextPage: number | null = null;
        if (data.next) {
          const match = data.next.match(/[\?&]page=(\d+)/);
          nextPage = match ? parseInt(match[1], 10) : null;
        }

        const result = { items, nextPage };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
          structuredContent: { result },
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text: `Request failed: ${err.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
};
