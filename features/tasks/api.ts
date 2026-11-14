import type { TaskDto, TaskPriority, TaskStatus } from "@/features/tasks/contracts";

type TaskResponse = { task: TaskDto };
type TasksResponse = { tasks: TaskDto[] };

export type NewTaskInput = {
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  priority: TaskPriority;
};

export type TaskUpdate = Partial<NewTaskInput & {
  isPinned: boolean;
  position: number;
}>;

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Task request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return payload as T;
}

export async function fetchTasks() {
  const result = await requestJson<TasksResponse>("/api/tasks");
  return result.tasks;
}

export async function createTaskRequest(input: NewTaskInput) {
  const result = await requestJson<TaskResponse>("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return result.task;
}

export async function updateTaskRequest(id: string, updates: TaskUpdate) {
  const result = await requestJson<TaskResponse>(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return result.task;
}

export async function deleteTaskRequest(id: string) {
  await requestJson<{ success: true }>(`/api/tasks/${id}`, { method: "DELETE" });
}
