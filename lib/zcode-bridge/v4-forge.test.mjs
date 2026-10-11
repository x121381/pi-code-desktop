import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const { forgeMinimal } = await jiti.import("./v4-forge.ts");
const v4 = await jiti.import("@zcode/shared/zcode-protocol-v4");
const { buildRowsFromPiMessages } = await jiti.import("./pi-agent-service.ts");

test("forged conversation snapshot passes its own schema parse", () => {
  const forged = forgeMinimal(v4.conversationSnapshotSchema);
  const result = v4.conversationSnapshotSchema.safeParse(forged);
  const issues = result.success ? [] : result.error.issues.slice(0, 8).map((i) => `${i.path.join(".")}: ${i.message}`);
  assert.deepEqual(issues, []);
});

test("snapshot with Pi-derived rows passes schema parse", () => {
  const rows = buildRowsFromPiMessages([
    { role: "user", content: "hello world", timestamp: Date.now() },
    {
      role: "assistant",
      timestamp: Date.now(),
      content: [
        { type: "thinking", text: "pondering" },
        { type: "text", text: "hi there" },
      ],
    },
  ]);
  const forged = forgeMinimal(v4.conversationSnapshotSchema);
  forged.protocolVersion = 1;
  forged.sessionId = "test-session";
  forged.logEpoch = "pi-1";
  forged.seq = rows.length;
  forged.revision = 1;
  forged.rows = { window: rows, totalCount: rows.length, firstRowId: 1 };
  const result = v4.conversationSnapshotSchema.safeParse(forged);
  const issues = result.success ? [] : result.error.issues.slice(0, 8).map((i) => `${i.path.join(".")}: ${i.message}`);
  assert.deepEqual(issues, []);
});

test("deltas built from Pi events pass delta schema parse", () => {
  const delta = v4.conversationDeltaSchema.safeParse({
    op: "row.appended",
    row: buildRowsFromPiMessages([{ role: "assistant", content: [{ type: "text", text: "x" }], timestamp: 1 }]).at(-1),
  });
  assert.equal(delta.success, true, delta.success ? "" : JSON.stringify(delta.error.issues.slice(0, 4)));
});
