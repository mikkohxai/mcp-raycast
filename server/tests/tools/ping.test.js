import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ping } from "../../src/tools/ping.js";

describe("frictionless_ping", () => {
  it("T-03-01: valid call returns pong: true", async () => {
    const result = await ping({ message: "hello" });
    assert.ok(!result.isError, "should not be an error");
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.pong, true);
  });

  it("T-03-02: message is echoed back", async () => {
    const result = await ping({ message: "test-echo" });
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.echo, "test-echo");
  });

  it("T-03-03: timestamp is valid ISO 8601", async () => {
    const result = await ping({ message: "ts-test" });
    const data = JSON.parse(result.content[0].text);
    assert.ok(
      !isNaN(Date.parse(data.timestamp)),
      "timestamp should be valid ISO 8601"
    );
  });

  it("T-03-04: server field is set, isError absent on success", async () => {
    const result = await ping({ message: "server-test" });
    const data = JSON.parse(result.content[0].text);
    assert.equal(data.server, "raycast-mcp-server");
    assert.equal(result.isError, undefined, "isError should be absent on success");
  });

  it("T-03-05: missing required message returns isError: true", async () => {
    const result = await ping({});
    assert.equal(result.isError, true);
  });
});
