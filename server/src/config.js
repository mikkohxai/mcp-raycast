const LOG_LEVELS = ["debug", "info", "warn", "error"];

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  get logLevel() {
    return LOG_LEVELS.includes(process.env.MCP_LOG_LEVEL)
      ? process.env.MCP_LOG_LEVEL
      : "info";
  },
  version: "1.0.0",
  serverName: "raycast-mcp-server",
  defaultTimeoutMs: 15000,
  maxResponseBytes: 8192,
};
