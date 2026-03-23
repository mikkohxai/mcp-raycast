import { mcpError } from "../lib/errors.js";
import { validateParams } from "../lib/validator.js";
import { logger } from "../lib/logger.js";

const PING_SCHEMA = {
  message: { required: true, type: "string" },
};

export async function ping(params) {
  try {
    const validation = validateParams(PING_SCHEMA, params);
    if (!validation.valid) {
      return mcpError(validation.error);
    }
    const result = {
      pong: true,
      echo: params.message,
      timestamp: new Date().toISOString(),
      server: "raycast-mcp-server",
    };
    logger.debug("ping called", result);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    logger.error("ping failed", err.message);
    return mcpError(`ping failed: ${err.message}`);
  }
}

export const pingTool = {
  name: "frictionless_ping",
  description:
    "Ping the raycast-mcp-server and receive a pong response with echo and timestamp.",
  inputSchema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Message to echo back in the pong response.",
      },
    },
    required: ["message"],
  },
};
