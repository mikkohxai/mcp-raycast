import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { healthCheck } from "../../src/tools/health_check.js";

describe("frictionless_health_check", () => {
  it("T-04-01: returns status 'ok'", async () => {
    const result = await healthCheck({});
    assert.ok(!result.isError);
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.status, "ok");
  });

  it("T-04-02: uptime is a number >= 0", async () => {
    const result = await healthCheck({});
    const data = JSON.parse(result.content[0].text);
    assert.equal(typeof data.uptime, "number");
    assert.ok(data.uptime >= 0);
  });

  it("T-04-03: memory contains heapUsed", async () => {
    const result = await healthCheck({});
    const data = JSON.parse(result.content[0].text);
    assert.ok("heapUsed" in data.memory, "memory should have heapUsed");
  });
});
