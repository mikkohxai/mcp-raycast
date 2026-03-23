import { mcpError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { config } from "../config.js";

export async function healthCheck(_params) {
  try {
    const result = {
      status: "ok",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: config.version,
      timestamp: new Date().toISOString(),
    };
    logger.debug("health_check called", { status: result.status });
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    logger.error("health_check failed", err.message);
    return mcpError(`health_check failed: ${err.message}`);
  }
}

export const healthCheckTool = {
  name: "frictionless_health_check",
  description: "Check the health status of the raycast-mcp-server.",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};
