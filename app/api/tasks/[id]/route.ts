import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { getAuthenticatedUserId } from "@/features/auth/api/getAuthenticatedUserId";
import { TaskModel } from "@/features/tasks/model";
import { isTaskInput, isTaskPriority, isTaskStatus, isValidDueDate, isValidDurationMinutes, isValidScheduledAt, serializeTask, taskErrorResponse, type TaskPriority, type TaskStatus } from "@/features/tasks/contracts";

type RouteContext = { params: Promise<{ id: string }> };

async function getOwnedTask(request: Request, context: RouteContext) {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) return { response: taskErrorResponse("Authentication required.", 401) };

  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return { response: taskErrorResponse("Task not found.", 404) };
  }

  await connectToDatabase();
  const task = await TaskModel.findOne({ _id: id, userId });
  if (!task) return { response: taskErrorResponse("Task not found.", 404) };

  return { userId, task };
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const result = await getOwnedTask(request, context);
    if ("response" in result) return result.response;
    return Response.json({ task: serializeTask(result.task) });
  } catch {
    return taskErrorResponse("Unable to load task.", 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const result = await getOwnedTask(request, context);
    if ("response" in result) return result.response;

    const body: unknown = await request.json();
    if (!isTaskInput(body)) return taskErrorResponse("A task object is required.", 400);

    const input = body as Record<string, unknown>;
    const updates: { title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority; dueDate?: Date | null; scheduledAt?: Date | null; durationMinutes?: number | null; isPinned?: boolean; position?: number } = {};

    if ("position" in input) {
      if (typeof input.position !== "number" || !Number.isFinite(input.position)) return taskErrorResponse("Position is invalid.", 400);
      updates.position = input.position;
    }

    if ("title" in input) {
      if (typeof input.title !== "string" || !input.title.trim() || input.title.trim().length > 120) {
        return taskErrorResponse("Title must be between 1 and 120 characters.", 400);
      }
      updates.title = input.title.trim();
    }
    if ("description" in input) {
      if (typeof input.description !== "string" || input.description.length > 2000) {
        return taskErrorResponse("Description must be 2,000 characters or fewer.", 400);
      }
      updates.description = input.description.trim();
    }
    if ("status" in input) {
      if (!isTaskStatus(input.status)) return taskErrorResponse("Status is invalid.", 400);
      updates.status = input.status;
    }
    if ("priority" in input) {
      if (!isTaskPriority(input.priority)) return taskErrorResponse("Priority is invalid.", 400);
      updates.priority = input.priority;
    }
    if ("isPinned" in input) {
      if (typeof input.isPinned !== "boolean") return taskErrorResponse("Pinned state must be true or false.", 400);
      updates.isPinned = input.isPinned;
    }
    if ("dueDate" in input) {
      if (input.dueDate === null || input.dueDate === "") {
        updates.dueDate = null;
      } else {
        if (!isValidDueDate(input.dueDate)) return taskErrorResponse("Due date must be a valid calendar date.", 400);
        updates.dueDate = new Date(`${input.dueDate}T00:00:00.000Z`);
      }
    }
    if ("scheduledAt" in input) {
      if (input.scheduledAt === null || input.scheduledAt === "") {
        updates.scheduledAt = null;
      } else {
        if (!isValidScheduledAt(input.scheduledAt)) return taskErrorResponse("Scheduled time must be a valid UTC date-time.", 400);
        updates.scheduledAt = new Date(input.scheduledAt);
      }
    }
    if ("durationMinutes" in input) {
      if (input.durationMinutes === null) updates.durationMinutes = null;
      else {
        if (!isValidDurationMinutes(input.durationMinutes)) return taskErrorResponse("Duration must be between 5 and 720 minutes.", 400);
        updates.durationMinutes = input.durationMinutes;
      }
    }
    const resultingScheduledAt = updates.scheduledAt === undefined ? result.task.scheduledAt : updates.scheduledAt;
    const resultingDuration = updates.durationMinutes === undefined ? result.task.durationMinutes : updates.durationMinutes;
    if (resultingScheduledAt && !resultingDuration) return taskErrorResponse("Choose a duration for a scheduled task.", 400);
    if (!resultingScheduledAt && resultingDuration) return taskErrorResponse("A start time is required when setting a duration.", 400);
    if (Object.keys(updates).length === 0) {
      return taskErrorResponse("Provide at least one task field to update.", 400);
    }

    Object.assign(result.task, updates);
    await result.task.save();
    return Response.json({ task: serializeTask(result.task) });
  } catch (error) {
    if (error instanceof SyntaxError) return taskErrorResponse("Request body must be valid JSON.", 400);
    return taskErrorResponse("Unable to update task.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const result = await getOwnedTask(request, context);
    if ("response" in result) return result.response;
    await result.task.deleteOne();
    return Response.json({ success: true });
  } catch {
    return taskErrorResponse("Unable to delete task.", 500);
  }
}
