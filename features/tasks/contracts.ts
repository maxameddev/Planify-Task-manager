export const taskStatuses = ["todo", "in_progress", "completed"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const taskPriorities = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof taskPriorities)[number];

export type TaskDto = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  isPinned: boolean;
  position: number;
  dueDate: string | null;
  scheduledAt: string | null;
  durationMinutes: number | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskDocument = {
  _id: { toString(): string };
  title: string;
  description?: string;
  status: string;
  priority?: string;
  isPinned?: boolean;
  position?: number;
  dueDate?: Date | null;
  scheduledAt?: Date | null;
  durationMinutes?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && taskStatuses.some((status) => status === value);
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && taskPriorities.some((priority) => priority === value);
}

export function isTaskInput(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isValidDueDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

export function isValidScheduledAt(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

export function isValidDurationMinutes(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 5 && value <= 720;
}

export function serializeTask(task: TaskDocument): TaskDto {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: task.status as TaskStatus,
    priority: (task.priority ?? "medium") as TaskPriority,
    isPinned: task.isPinned ?? false,
    position: task.position ?? -task.createdAt.getTime(),
    dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString().slice(0, 10) : null,
    scheduledAt: task.scheduledAt instanceof Date ? task.scheduledAt.toISOString() : null,
    durationMinutes: typeof task.durationMinutes === "number" ? task.durationMinutes : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function taskErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
