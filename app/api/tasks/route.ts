import { connectToDatabase } from "@/lib/mongoose";
import { getAuthenticatedUserId } from "@/features/auth/apiAuth";
import { TaskModel } from "@/features/tasks/model";
import { isTaskInput, isTaskPriority, isTaskStatus, isValidDueDate, serializeTask, taskErrorResponse } from "@/features/tasks/contracts";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) return taskErrorResponse("Authentication required.", 401);

    await connectToDatabase();
    const tasks = await TaskModel.find({ userId }).sort({ isPinned: -1, createdAt: -1 }).lean();
    return Response.json({ tasks: tasks.map(serializeTask) });
  } catch {
    return taskErrorResponse("Unable to load tasks.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) return taskErrorResponse("Authentication required.", 401);

    const body: unknown = await request.json();
    if (!isTaskInput(body)) return taskErrorResponse("A task object is required.", 400);

    const { title, description, dueDate, status, priority } = body as Record<string, unknown>;
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

    await connectToDatabase();
    const task = await TaskModel.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      dueDate: typeof dueDate === "string" && dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null,
      status: status === undefined ? "todo" : status,
      priority: priority === undefined ? "medium" : priority,
      userId,
    });

    return Response.json({ task: serializeTask(task) }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return taskErrorResponse("Request body must be valid JSON.", 400);
    return taskErrorResponse("Unable to create task.", 500);
  }
}
