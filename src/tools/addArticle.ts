import { z } from "zod";
import { retryFetch } from "../util.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  title: z.string(),
  urlname: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  sub_title: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  // teaser_image_uuid: z.string().optional(),
  // header_image_uuid: z.string().optional(),
  print_description: z.string().optional(),
};
const outputSchema = {
  result: z.object({
    url: z.string(),
    uuid: z.string(),
  }),
};

function isHeading(line: string): boolean {
  const maxChars = 60; // short lines only
  const maxWords = 8; // headings are usually brief
  const sentenceEnd = /[.!?]$/;

  const words = line.split(/\s+/);

  return (
    line.length <= maxChars &&
    words.length <= maxWords &&
    !sentenceEnd.test(line)
  );
}

function formatToHtml(input: string): string {
  if (!input || typeof input !== "string") return "";

  const text = input.replace(/\r\n/g, "\n").trim();
  const blocks = text.split(/\n\s*\n+/);

  const html = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) continue;

    // Detect unordered list
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      html.push(
        `<ul>\n` +
          lines
            .map((l) => `<li>${escapeHtml(l.replace(/^[-*]\s+/, ""))}</li>`)
            .join("\n") +
          `\n</ul>`,
      );
      continue;
    }

    // Detect ordered list
    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      html.push(
        `<ol>\n` +
          lines
            .map((l) => `<li>${escapeHtml(l.replace(/^\d+\.\s+/, ""))}</li>`)
            .join("\n") +
          `\n</ol>`,
      );
      continue;
    }

    // Single line → h4
    if (lines.length === 1 && isHeading(lines[0])) {
      html.push(`<h4>${escapeHtml(lines[0])}</h4>`);
      continue;
    }

    // Multi-line → paragraph
    html.push(`<p>${escapeHtml(lines.join(" "))}</p>`);
  }

  return html.join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const addArticleTool = (server: McpServer) => {
  server.registerTool(
    "add_mp_article",
    {
      title: "Add Article",
      description: "Add an article in Metro Publisher.",
      inputSchema: inputSchema,
      outputSchema: outputSchema,
    },
    async ({
      title,
      urlname,
      description,
      content,
      sub_title,
      meta_title,
      meta_description,
      // teaser_image_uuid,
      // header_image_uuid,
      print_description,
    }) => {
      const uuid = crypto.randomUUID();
      const url = `/content/${uuid}`;

      const articleData = {
        title: title,
        urlname: urlname,
        content_type: "article",
        state: "draft",
        description: description || null,
        content: formatToHtml(content as string) || null,
        sub_title: sub_title || null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        // teaser_image_uuid: teaser_image_uuid || null,
        // header_image_uuid: header_image_uuid || null,
        print_description: print_description || null,
      };

      // Remove all null properties
      const cleanedArticleData = Object.fromEntries(
        Object.entries(articleData).filter(([_, v]) => v !== null),
      );
      console.log("CLEANED ARTICLE DATA:", cleanedArticleData);
      try {
        const article = await retryFetch(
          url,
          "application/json",
          "PUT",
          JSON.stringify(cleanedArticleData),
        );
        console.error("Article created:", article);
        return {
          // MCP requires an array of article parts
          content: [
            {
              type: "text",
              text: JSON.stringify({ result: article }),
            },
          ],
          // This is what gets validated against outputSchema
          structuredContent: { result: article },
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
