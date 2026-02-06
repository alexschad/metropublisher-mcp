import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  topic: z.string(),
  target_audience: z.string().optional(),
  language: z.string().optional(),
};

export const createArticlePrompt = (server: McpServer) => {
  server.registerPrompt(
    "create_article_data",
    {
      title: "Create Articles Data Prompt",
      description: "Create Articles Data Based on a User Prompt.",
      argsSchema: inputSchema,
    },
    ({ topic, target_audience, language }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `

Generate a high-quality, original article and return the result strictly as a structured object with the following fields:

Fields to generate:
title - A clear, engaging article title
urlname - A URL-safe slug (lowercase, hyphen-separated, no special characters)
description - A short summary (2 - 3 sentences, max 160 characters if possible)
sub_title - A supporting subtitle that expands on the main title
meta_title - An SEO-optimized meta title (max ~60 characters)
meta_description - An SEO-optimized meta description (max ~160 characters)
print_description - A concise version of the description suitable for print
content - A long-form article with a minimum of 1000 words

Content requirements:
The article must be well-structured with headings and subheadings
Use a clear introduction, multiple body sections, and a strong conclusion
Write in a professional, informative, and engaging tone
Avoid filler text; ensure depth, clarity, and coherence
The content field must contain at least 1000 words.

Output rules:
Do not include explanations or comments
Do not include markdown fences
Do not include any text outside the fields
Ensure all fields are filled

Topic:
${topic}

Target audience:
${target_audience}

Language:
${language}

Use the add_mp_article tool to add the article once generated.
`,
          },
        },
      ],
    }),
  );
};
