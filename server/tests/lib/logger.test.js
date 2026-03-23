import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { logger } from "../../src/lib/logger.js";

describe("logger", () => {
  let stderrOutput;
  let originalStderr;
  let originalEnvLevel;

  beforeEach(() => {
    stderrOutput = [];
    originalStderr = console.error;
    originalEnvLevel = process.env.MCP_LOG_LEVEL;
    console.error = (...args) => stderrOutput.push(args.map(String).join(" "));
  });

  afterEach(() => {
    console.error = originalStderr;
    if (originalEnvLevel === undefined) {
      delete process.env.MCP_LOG_LEVEL;
    } else {
      process.env.MCP_LOG_LEVEL = originalEnvLevel;
    }
  });

  it("T-05-01: debug messages suppressed at info level", () => {
    process.env.MCP_LOG_LEVEL = "info";
    logger.debug("should not appear");
    assert.equal(stderrOutput.length, 0, "debug should be suppressed at info level");
  });

  it("T-05-02: error messages logged at error level", () => {
    process.env.MCP_LOG_LEVEL = "error";
    logger.error("critical failure");
    assert.ok(
      stderrOutput.some((s) => s.includes("critical failure")),
      "error message should appear in stderr output"
    );
  });

  it("T-05-03: all output goes to stderr (console.error)", () => {
    process.env.MCP_LOG_LEVEL = "warn";
    logger.warn("test warning");
    assert.ok(
      stderrOutput.some((s) => s.includes("test warning")),
      "warn message should appear via console.error"
    );
  });
});
