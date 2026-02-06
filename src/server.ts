import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { getLocationsTool } from "./tools/getLocations.js";
import { getLocationDetailsTool } from "./tools/getLocationDetails.js";
import { addLocationTool } from "./tools/addLocation.js";
import { getGeonameDataTool } from "./tools/getGeonameData.js";
import { getContentTool } from "./tools/getContent.js";
import { getContentDetailsTool } from "./tools/getContentDetail.js";
import { addArticleTool } from "./tools/addArticle.js";
import { exportLocationsPrompt } from "./prompts/exportLocations.js";
import { getGeonameDataPrompt } from "./prompts/getGeoData.js";
import { getNominatimDataTool } from "./tools/getNominatimData.js";
import { createLocationDataPrompt } from "./prompts/createLocationData.js";
import { exportContentPrompt } from "./prompts/exportContent.js";
import { createArticlePrompt } from "./prompts/createArticlePrompt.js";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

// MCP SERVER
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
addArticleTool(mcpServer);

// Add Prompts
exportLocationsPrompt(mcpServer);
getGeonameDataPrompt(mcpServer);
createLocationDataPrompt(mcpServer);
exportContentPrompt(mcpServer);
createArticlePrompt(mcpServer);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post("/mcp", async (req: any, res: any) => {
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
  });

  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || "8000");
app
  .listen(port, () => {
    console.error(`Demo MCP Server running on http://localhost:${port}/mcp`);
  })
  .on("error", (error: any) => {
    console.error("Server error:", error);
    process.exit(1);
  });
