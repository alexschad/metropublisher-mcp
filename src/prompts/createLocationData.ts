import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  prompt: z.string(),
  filename: z.string().optional(),
  fileFormat: z.string().optional(),
};

export const createLocationDataPrompt = (server: McpServer) => {
  server.registerPrompt(
    "create_location_data",
    {
      title: "Create Locations Data Prompt",
      description: "Create Locations Data Based on a User Prompt.",
      argsSchema: inputSchema,
    },
    ({ prompt, filename, fileFormat }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
Find location data based on the following prompt: ${prompt}.
Use the get_geoname_data tool using this format for the location_name: "City, Country" to find the GeoName ID as well as the base longitude and latitude for these locations.
Then use the get_nominatim_data tool to refine the latitude and longitude if that doesn't find anything use the base longitude and latitude.
Only the Geoname and the latitude and longitude are returned by these tools all other fields must be generated based on your knowledge.

The file should include the following fields for each location:
title, urlName, description, content, geoNameId, latitude, longitude, street, streetNumber, pcode, phone, website, email, fax.

When generating each location, also determine (if possible) the following address information:
- street
- street number
- postal code (pcode)

Include these fields in the output whenever the information is available.

Format the data as a ${fileFormat || "json"} file. 
Name the file ${filename || "location_data"}.${fileFormat || "json"}.
Put the file in a data folder. If it doesn't exist create it.

`,
          },
        },
      ],
    })
  );
};
