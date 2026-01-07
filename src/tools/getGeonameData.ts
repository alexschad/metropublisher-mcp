import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import * as dotenv from "dotenv";
// dotenv.config({ debug: false });

const GEONAME_USERNAME = process.env.GEONAME_USERNAME;

const outputSchema = {
  result: z.object({
    geonameId: z.number().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }),
};
const inputSchema = { location_name: z.string() };

export const getGeonameDataTool = (server: McpServer) => {
  server.registerTool(
    "get_geoname_data",
    {
      title: "Get Geoname Data",
      description: "Get Geoname Data.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({ location_name }) => {
      const url = `http://api.geonames.org/searchJSON?q=${location_name}&username=${GEONAME_USERNAME}&maxRows=1`;
      try {
        const result = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await result.json();
        console.error("Geoname Data:", data);
        const geonameId =
          data.totalResultsCount > 0 ? data.geonames[0].geonameId : null;
        const latitude =
          data.totalResultsCount > 0 ? parseFloat(data.geonames[0].lat) : null;
        const longitude =
          data.totalResultsCount > 0 ? parseFloat(data.geonames[0].lng) : null;
        const geoData = {
          geonameId: geonameId,
          latitude: latitude,
          longitude: longitude,
        };
        return {
          // MCP requires an array of content parts
          content: [
            {
              type: "text",
              text: JSON.stringify({ result: geoData }),
            },
          ],
          // This is what gets validated against outputSchema
          structuredContent: { result: geoData },
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
