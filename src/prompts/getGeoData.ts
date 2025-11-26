import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  location: z.string(),
};

export const getGeonameDataPrompt = (server: McpServer) => {
  server.registerPrompt(
    "get_geoname_data",
    {
      title: "Get Geoname data Information Prompt",
      description: "Get Geoname data for a location.",
      argsSchema: inputSchema,
    },
    ({ location }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use the get_geoname_data tool to get the Geoname ID, Latitude, and Longitude for the location: ${location}.`,
          },
        },
      ],
    })
  );
};
