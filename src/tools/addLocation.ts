import { z } from "zod";
import { retryFetch } from "../util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  title: z.string(),
  urlname: z.string(),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  street: z.string().optional(),
  streetnumber: z.string().optional(),
  pcode: z.string().optional(),
  geoname_id: z.number().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  content: z.string().optional(),
};
const outputSchema = {
  result: z.object({
    url: z.string(),
    uuid: z.string(),
  }),
};

export const addLocationTool = (server: McpServer) => {
  server.registerTool(
    "add_mp_location",
    {
      title: "Add Location",
      description: "Add a location in Metro Publisher.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({
      title,
      urlname,
      description,
      latitude,
      longitude,
      street,
      streetnumber,
      pcode,
      geoname_id,
      phone,
      website,
      email,
      fax,
      content,
    }) => {
      const uuid = crypto.randomUUID();
      const url = `/locations/${uuid}`;

      const locationData = {
        title: title,
        urlname: urlname,
        description: description || null,
        street: street || null,
        streetnumber: streetnumber || null,
        pcode: pcode || null,
        geoname_id: geoname_id || null,
        phone: phone || null,
        website: website || null,
        email: email || null,
        fax: fax || null,
        content: (content && `<p>${content}</p>`) || null,
        coords:
          (latitude !== undefined &&
            longitude !== undefined && [latitude, longitude]) ||
          null,
      };

      // Remove all null properties
      const cleanedLocationData = Object.fromEntries(
        Object.entries(locationData).filter(([_, v]) => v !== null)
      );
      try {
        const location = await retryFetch(
          url,
          "application/json",
          "PUT",
          JSON.stringify(cleanedLocationData)
        );
        console.log("Location created:", location);
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
