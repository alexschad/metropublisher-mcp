import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getLocationsTool } from "./tools/getLocations.js";
import { getLocationDetailsTool } from "./tools/getLocationDetails.js";
import { addLocationTool } from "./tools/addLocation.js";
import { getGeonameDataTool } from "./tools/getGeonameData.js";
import { getContentTool } from "./tools/getContent.js";
import { getContentDetailsTool } from "./tools/getContentDetail.js";
import { exportLocationsPrompt } from "./prompts/exportLocations.js";
import { getGeonameDataPrompt } from "./prompts/getGeoData.js";
import { getNominatimDataTool } from "./tools/getNominatimData.js";
import { createLocationDataPrompt } from "./prompts/createLocationData.js";
import { exportContentPrompt } from "./prompts/exportContent.js";
import * as dotenv from "dotenv";
dotenv.config({ quiet: true });

const mcpServer = new McpServer({
  name: "metropublisher-api",
  version: "1.0.0",
});

// Add Tools
getLocationsTool(mcpServer);
getLocationDetailsTool(mcpServer);
addLocationTool(mcpServer);
getGeonameDataTool(mcpServer);
getNominatimDataTool(mcpServer);
getContentTool(mcpServer);
getContentDetailsTool(mcpServer);

// Add Prompts
exportLocationsPrompt(mcpServer);
getGeonameDataPrompt(mcpServer);
createLocationDataPrompt(mcpServer);
exportContentPrompt(mcpServer);

// Use stdio transport for Claude Desktop
const transport = new StdioServerTransport();
await mcpServer.connect(transport);

console.error("MCP Server running with stdio transport");
