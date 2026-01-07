import { z } from "zod";
import { retryFetch } from "../util.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const outputSchema = {
  result: z.object({
    closed: z.boolean(),
    content: z.string().nullable(),
    coords: z.array(z.number()),
    created: z.string(),
    description: z.string().nullable(),
    email: z.string().nullable(),
    fax: z.string().nullable(),
    fb_headline: z.string().nullable(),
    fb_show_faces: z.boolean().nullable(),
    fb_show_stream: z.boolean().nullable(),
    fb_url: z.string().nullable(),
    geoname_id: z.number().nullable(),
    lat: z.number().nullable(),
    location_types: z.array(z.string()),
    long: z.number().nullable(),
    modified: z.string(),
    opening_hours: z.string().nullable(),
    pcode: z.string().nullable(),
    phone: z.string().nullable(),
    price_index: z.string().nullable(),
    print_description: z.string().nullable(),
    sort_title: z.string().nullable(),
    state: z.string().nullable(),
    street: z.string().nullable(),
    streetnumber: z.string().nullable(),
    thumb_url: z.string().nullable(),
    title: z.string(),
    twitter_username: z.string().nullable(),
    urlname: z.string(),
    uuid: z.string(),
    website: z.string().nullable(),
    coupon_img_url: z.string().optional().nullable(),
    coupon_description: z.string().optional().nullable(),
    coupon_start: z.string().optional().nullable(),
    coupon_expires: z.string().optional().nullable(),
    coupon_title: z.string().optional().nullable(),
    coupon_img_uuid: z.string().optional().nullable(),
    linkedin_url: z.string().nullable(),
    sponsored: z.boolean().optional().nullable(),
    instagram_username: z.string().nullable(),
    is_listing: z.boolean().optional().nullable(),
    contact_person: z.string().nullable(),
    contact_email: z.string().nullable(),
    listing_expires: z.string().optional().nullable(),
    kicker: z.string().nullable(),
    listing_start: z.string().optional().nullable(),
  }),
};
const inputSchema = { uuid: z.string() };

export const getLocationDetailsTool = (server: McpServer) => {
  server.registerTool(
    "get_mp_location_details",
    {
      title: "Get Metro Publisher Location Details",
      description: "Get Details for a Metro Publisher location.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({ uuid }) => {
      const url = `/locations/${uuid}`;

      try {
        const location = await retryFetch(url, "application/json", "GET", "");
        return {
          // MCP requires an array of content parts
          content: [
            {
              type: "text",
              text: JSON.stringify({ result: location }),
            },
          ],
          // This is what gets validated against outputSchema
          structuredContent: { result: location },
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
