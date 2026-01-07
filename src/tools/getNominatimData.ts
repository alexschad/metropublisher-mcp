import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const outputSchema = {
  result: z.object({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }),
};
const inputSchema = { address: z.string() };

export const getNominatimDataTool = (server: McpServer) => {
  server.registerTool(
    "get_nominatim_data",
    {
      title: "Get Location Data from Nominatim",
      description: "Get Location Data from Nominatim.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({ address }) => {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1&limit=1`;
      try {
        const result = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.error("Nominatim Result:", result);
        const data = await result.json();
        console.error("Nominatim Data:", data);
        const latitude = data.length > 0 ? parseFloat(data[0].lat) : null;
        const longitude = data.length > 0 ? parseFloat(data[0].lon) : null;
        return {
          // MCP requires an array of content parts
          content: [
            {
              type: "text",
              text: JSON.stringify({
                result: {
                  latitude: latitude,
                  longitude: longitude,
                },
              }),
            },
          ],
          // This is what gets validated against outputSchema
          structuredContent: {
            result: {
              latitude: latitude,
              longitude: longitude,
            },
          },
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
