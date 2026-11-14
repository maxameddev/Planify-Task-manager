import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTaskMove } from "../features/tasks/order.ts";
const tasks = [
  { id: "a", status: "todo", isPinned: false, position: 0 },
  { id: "b", status: "todo", isPinned: false, position: 1000 },
  { id: "c", status: "todo", isPinned: false, position: 2000 },
  { id: "p", status: "in_progress", isPinned: true, position: 0 },
  { id: "d", status: "in_progress", isPinned: false, position: 1000 },
];
test("reorders tasks in both directions", () => {
  assert.deepEqual(calculateTaskMove(tasks, "a", "c"), { status: "todo", position: 3000 });
  assert.deepEqual(calculateTaskMove(tasks, "c", "a"), { status: "todo", position: -1000 });
  assert.deepEqual(calculateTaskMove(tasks, "a", "b"), { status: "todo", position: 1500 });
});
test("moves between columns and preserves pinned grouping", () => {
  assert.deepEqual(calculateTaskMove(tasks, "a", "d"), { status: "in_progress", position: 0 });
  assert.deepEqual(calculateTaskMove(tasks, "a", "p"), { status: "in_progress", position: 0 });
  assert.deepEqual(calculateTaskMove(tasks, "b", "completed", 5000), { status: "completed", position: -5000 });
});
test("ignores invalid drops and refuses an indistinguishable floating point position", () => {
  assert.equal(calculateTaskMove(tasks, "a", "a"), null);
  assert.equal(calculateTaskMove(tasks, "a", "missing"), null);
  const tight = [ { id: "x", status: "todo", isPinned: false, position: 1 }, { id: "y", status: "todo", isPinned: false, position: 1 + Number.EPSILON }, { id: "z", status: "completed", isPinned: false, position: 0 } ];
  assert.equal(calculateTaskMove(tight, "z", "y"), null);
});
