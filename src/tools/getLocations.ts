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
        coords: z.array(z.number()).nullable(),
      })
    ),
    nextPage: z.number().nullable(),
  }),
};
const inputSchema = { page: z.number().optional().default(1) };

export const getLocationsTool = (server: McpServer) => {
  server.registerTool(
    "get_mp_locations",
    {
      title: "Get Metro Publisher Locations",
      description: "Get Metro Publisher locations.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({ page }) => {
      const url = `/locations?fields=uuid-title-url-urlname-coords&rpp=10&page=${page}`;

      try {
        const data = await retryFetch(url, "application/json", "GET", "");
        const items = data.items.map((d: any) => ({
          uuid: d[0],
          title: d[1],
          url: d[2],
          urlname: d[3],
          coords: d[4],
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
    }
  );
};
