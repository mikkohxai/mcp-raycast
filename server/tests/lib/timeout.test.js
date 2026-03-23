import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { withTimeout, TimeoutError } from "../../src/lib/timeout.js";

describe("withTimeout", () => {
  it("T-06-01: resolves before timeout", async () => {
    const result = await withTimeout(Promise.resolve("done"), 1000);
    assert.equal(result, "done");
  });

  it("T-06-02: rejects with TimeoutError after timeout", async () => {
    const slow = new Promise((resolve) => setTimeout(resolve, 500));
    await assert.rejects(
      () => withTimeout(slow, 10),
      (err) => {
        assert.ok(err instanceof TimeoutError);
        return true;
      }
    );
  });

  it("T-06-03: TimeoutError message includes milliseconds", async () => {
    const slow = new Promise((resolve) => setTimeout(resolve, 500));
    await assert.rejects(
      () => withTimeout(slow, 42),
      (err) => {
        assert.ok(
          err.message.includes("42"),
          `expected message to include "42", got: ${err.message}`
        );
        return true;
      }
    );
  });
});
