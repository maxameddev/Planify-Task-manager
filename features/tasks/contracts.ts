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
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function taskErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
