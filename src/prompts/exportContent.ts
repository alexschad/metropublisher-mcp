import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  filename: z.string().optional(),
  fileFormat: z.string().optional(),
};

export const exportContentPrompt = (server: McpServer) => {
  console.log("exportContentPrompt");
  server.registerPrompt(
    "export_mp_content",
    {
      title: "Export Metro Publisher Content Prompt",
      description: "Export Metro Publisher Content data.",
      argsSchema: inputSchema,
    },
    ({ filename = "content", fileFormat = "json" }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Use the get_mp_content tool to export content and format the data as a ${fileFormat} file. Name the file ${filename}.${fileFormat}. Then get the content details with the get_mp_content_details tool for each content item and include the details in the exported file. Put the file in a data folder. If it doesn't exist create it.`,
          },
        },
      ],
    }),
  );
};
