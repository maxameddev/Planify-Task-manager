import assert from "node:assert/strict";
import test from "node:test";
import {
  isTaskInput,
  isTaskPriority,
  isTaskStatus,
  isValidDueDate,
  serializeTask,
} from "../features/tasks/contracts.ts";

test("task contracts accept only supported statuses, priorities, and input objects", () => {
  assert.equal(isTaskStatus("in_progress"), true);
  assert.equal(isTaskStatus("blocked"), false);
  assert.equal(isTaskPriority("high"), true);
  assert.equal(isTaskPriority("urgent"), false);
  assert.equal(isTaskInput({ title: "Plan the week" }), true);
  assert.equal(isTaskInput([]), false);
  assert.equal(isTaskInput(null), false);
});

test("due-date validation rejects malformed and impossible calendar dates", () => {
  assert.equal(isValidDueDate("2026-11-11"), true);
  assert.equal(isValidDueDate("2026-02-30"), false);
  assert.equal(isValidDueDate("11/11/2026"), false);
});

test("task serialization preserves API fields and formats dates consistently", () => {
  const createdAt = new Date("2026-11-11T10:00:00.000Z");
  assert.deepEqual(serializeTask({
    _id: { toString: () => "task-1" },
    title: "Plan the week",
    status: "todo",
    priority: "medium",
    createdAt,
    updatedAt: createdAt,
    dueDate: new Date("2026-11-12T00:00:00.000Z"),
  }), {
    id: "task-1",
    title: "Plan the week",
    description: "",
    status: "todo",
    priority: "medium",
    isPinned: false,
    position: -createdAt.getTime(),
    dueDate: "2026-11-12",
    scheduledAt: null,
    durationMinutes: null,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  });
});
