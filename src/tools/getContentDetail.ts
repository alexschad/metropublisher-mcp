import { z } from "zod";
import { retryFetch } from "../util.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const outputSchema = {
  result: z.object({
    blog_uuid: z.string().nullable().optional(),
    canonical_url: z.string().nullable(),
    content: z.string().nullable(),
    content_type: z.string().nullable(),
    created: z.string(),
    description: z.string().nullable(),
    evergreen: z.boolean().optional(),
    feature_image_alttext: z.string().nullable(),
    feature_image_caption: z.string().nullable(),
    feature_image_url: z.string().nullable(),
    feature_thumb_url: z.string().nullable(),
    header_image_url: z.string().nullable(),
    issued: z.string().nullable(),
    meta_description: z.string().nullable(),
    meta_title: z.string().nullable(),
    modified: z.string(),
    perma_url_path: z.string().nullable(),
    print_description: z.string().nullable(),
    section_uuid: z.string().nullable().optional(),
    state: z.string().nullable(),
    sub_title: z.string().nullable(),
    teaser_image_url: z.string().nullable(),
    title: z.string().nullable(),
    urlname: z.string().nullable(),
    uuid: z.string().nullable(),
    video_uuid: z.string().nullable(),
  }),
};
const inputSchema = { uuid: z.string() };

export const getContentDetailsTool = (server: McpServer) => {
  server.registerTool(
    "get_mp_content_details",
    {
      title: "Get Metro Publisher Content Details",
      description: "Get Details for a Metro Publisher content.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({ uuid }) => {
      const url = `/content/${uuid}`;

      try {
        const content = await retryFetch(url, "application/json", "GET", "");
        return {
          // MCP requires an array of content parts
          content: [
            {
              type: "text",
              text: JSON.stringify({ result: content }),
            },
          ],
          // This is what gets validated against outputSchema
          structuredContent: { result: content },
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
