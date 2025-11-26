import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  filename: z.string().optional(),
  fileFormat: z.string().optional(),
};

export const exportLocationsPrompt = (server: McpServer) => {
  server.registerPrompt(
    "export_mp_locations",
    {
      title: "Export Metro Publisher Locations Prompt",
      description: "Export Metro Publisher locations data.",
      argsSchema: inputSchema,
    },
    ({ filename = "locations", fileFormat = "json" }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use the get_mp_locations tool to export locations and format the data as a ${fileFormat} file. Name the file ${filename}.${fileFormat}. Then get the location details with the get_mp_location_details tool for each location and include the details in the exported file. Put the file in a data folder. If it doesn't exist create it.`,
          },
        },
      ],
    })
  );
};
