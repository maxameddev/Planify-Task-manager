export type TaskStatus = "todo" | "in_progress" | "completed";
export type OrderedTask = { id: string; status: TaskStatus; isPinned: boolean; position: number };

/** Return a position within the target status and pin group, without mutating tasks. */
export function calculateTaskMove(tasks: OrderedTask[], taskId: string, overId: string, now = Date.now()): { status: TaskStatus; position: number } | null {
  const task = tasks.find((item) => item.id === taskId);
  if (!task || taskId === overId) return null;
  const target = tasks.find((item) => item.id === overId);
  const statuses: TaskStatus[] = ["todo", "in_progress", "completed"];
  const status = target?.status ?? statuses.find((item) => item === overId);
  if (!status) return null;
  const peers = tasks.filter((item) => item.id !== task.id && item.status === status && item.isPinned === task.isPinned).sort((a, b) => a.position - b.position);
  const targetIndex = target && target.isPinned === task.isPinned ? peers.findIndex((item) => item.id === target.id) : -1;
  const original = tasks.filter((item) => item.status === task.status && item.isPinned === task.isPinned).sort((a, b) => a.position - b.position);
  const movingDown = task.status === status && target && original.findIndex((item) => item.id === task.id) < original.findIndex((item) => item.id === target.id);
  const index = targetIndex >= 0 ? targetIndex + (movingDown ? 1 : 0) : target && !task.isPinned && target.isPinned ? 0 : peers.length;
  const before = peers[index - 1]?.position;
  const after = peers[index]?.position;
  const position = before === undefined ? (after === undefined ? -now : after - 1000) : after === undefined ? before + 1000 : (before + after) / 2;
  if (!Number.isFinite(position) || position === before || position === after) return null;
  return { status, position };
}
