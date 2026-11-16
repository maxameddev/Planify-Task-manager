import { connectToDatabase } from "@/lib/mongoose";
import { getAuthenticatedUser } from "@/features/auth/api/getAuthenticatedUserId";
import { TaskModel } from "@/features/tasks/model";
import { isTaskInput, isTaskPriority, isTaskStatus, isValidDueDate, isValidDurationMinutes, isValidScheduledAt, serializeTask, taskErrorResponse } from "@/features/tasks/contracts";
import { dateInTimeZone } from "@/features/tasks/time";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return taskErrorResponse("Authentication required.", 401);

    await connectToDatabase();
    const tasks = await TaskModel.find({ userId: user.id }).sort({ isPinned: -1, createdAt: -1 }).lean();
    return Response.json({ tasks: tasks.map(serializeTask) });
  } catch {
    return taskErrorResponse("Unable to load tasks.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return taskErrorResponse("Authentication required.", 401);

    const body: unknown = await request.json();
    if (!isTaskInput(body)) return taskErrorResponse("A task object is required.", 400);

    const { title, description, dueDate, scheduledAt, durationMinutes, status, priority } = body as Record<string, unknown>;
    if (typeof title !== "string" || !title.trim() || title.trim().length > 120) {
      return taskErrorResponse("Title must be between 1 and 120 characters.", 400);
    }
    if (description !== undefined && (typeof description !== "string" || description.length > 2000)) {
      return taskErrorResponse("Description must be 2,000 characters or fewer.", 400);
    }
    if (status !== undefined && !isTaskStatus(status)) {
      return taskErrorResponse("Status is invalid.", 400);
    }
    if (priority !== undefined && !isTaskPriority(priority)) {
      return taskErrorResponse("Priority is invalid.", 400);
    }
    if (dueDate !== undefined && dueDate !== null && dueDate !== "" && !isValidDueDate(dueDate)) {
      return taskErrorResponse("Due date must be a valid calendar date.", 400);
    }
    if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt !== "" && !isValidScheduledAt(scheduledAt)) {
      return taskErrorResponse("Scheduled time must be a valid UTC date-time.", 400);
    }
    if (typeof dueDate === "string" && dueDate && typeof scheduledAt === "string" && scheduledAt && dueDate <= dateInTimeZone(new Date(scheduledAt), user.timeZone)) {
      return taskErrorResponse("The due date must be later than the scheduled date.", 400);
    }
    if (durationMinutes !== undefined && durationMinutes !== null && !isValidDurationMinutes(durationMinutes)) {
      return taskErrorResponse("Duration must be between 5 and 720 minutes.", 400);
    }
    if (scheduledAt && !durationMinutes) return taskErrorResponse("Choose a duration for a scheduled task.", 400);
    if (!scheduledAt && durationMinutes) return taskErrorResponse("A start time is required when setting a duration.", 400);

    await connectToDatabase();
    const task = await TaskModel.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      dueDate: typeof dueDate === "string" && dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null,
      scheduledAt: typeof scheduledAt === "string" && scheduledAt ? new Date(scheduledAt) : null,
      durationMinutes: typeof durationMinutes === "number" ? durationMinutes : null,
      status: status === undefined ? "todo" : status,
      priority: priority === undefined ? "medium" : priority,
      userId: user.id,
    });

    return Response.json({ task: serializeTask(task) }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return taskErrorResponse("Request body must be valid JSON.", 400);
    return taskErrorResponse("Unable to create task.", 500);
  }
}
