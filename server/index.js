#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "./src/config.js";
import { logger } from "./src/lib/logger.js";
import { mcpError } from "./src/lib/errors.js";
import { withTimeout } from "./src/lib/timeout.js";
import { ping, pingTool } from "./src/tools/ping.js";
import { healthCheck, healthCheckTool } from "./src/tools/health_check.js";

const TOOLS = [pingTool, healthCheckTool];

const TOOL_MAP = {
  frictionless_ping: ping,
  frictionless_health_check: healthCheck,
};

function truncateResponse(result) {
  if (!result.content) return result;
  const text = result.content
    .map((c) => (c.type === "text" ? c.text : ""))
    .join("");
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength <= config.maxResponseBytes) return result;

  let truncated = "";
  let bytes = 0;
  for (const char of text) {
    const charBytes = Buffer.byteLength(char, "utf8");
    if (bytes + charBytes > config.maxResponseBytes) break;
    truncated += char;
    bytes += charBytes;
  }
  truncated += "\n\n[Response truncated at 8 KB]";
  return {
    ...result,
    content: [{ type: "text", text: truncated }],
  };
}

const server = new Server(
  { name: config.serverName, version: config.version },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: params } = request.params;
  const handler = TOOL_MAP[name];
  if (!handler) {
    return mcpError(`Unknown tool: ${name}`);
  }
  try {
    const result = await withTimeout(handler(params ?? {}), config.defaultTimeoutMs);
    return truncateResponse(result);
  } catch (err) {
    logger.error(`Tool ${name} threw unexpectedly`, err.message);
    return mcpError(`${name} encountered an unexpected error`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info(`${config.serverName} v${config.version} running on stdio`);
}

main().catch((err) => {
  logger.error("Fatal error", err.message);
  process.exit(1);
});
