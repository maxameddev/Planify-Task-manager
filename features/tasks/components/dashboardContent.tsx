"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronDown, Circle, CircleCheck, CircleDashed, CircleDot, Flag, Grip, LoaderCircle, LogOut, MoreHorizontal, Pencil, Pin, Plus, Trash2, UserRound, X } from "lucide-react";
import { Menu } from "@base-ui/react/menu";
import { BrandLogo } from "@/components/brandLogo";
import { ProfileAvatar } from "@/components/profileAvatar";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { useLanguage } from "@/components/languageProvider";
import { authClient } from "@/features/auth/client";
import { TaskDatePicker } from "@/features/tasks/components/taskDatePicker";
import { TaskSelect } from "@/features/tasks/components/taskSelect";
import { DndContext, PointerSensor, TouchSensor, KeyboardSensor, closestCorners, useSensor, useSensors, type DragEndEvent, type KeyboardCoordinateGetter } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskColumn, SortableTask } from "@/features/tasks/components/sortableTask";
import { calculateTaskMove } from "@/features/tasks/order";
import type { TaskDto as Task, TaskPriority, TaskStatus } from "@/features/tasks/contracts";
import { createTaskRequest, deleteTaskRequest, fetchTasks, updateTaskRequest } from "@/features/tasks/api";

type DashboardContentProps = { userName: string; userEmail: string; userImage: string | null };

function getRequestError(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : null;
}

export function DashboardContent({ userName, userEmail, userImage }: DashboardContentProps) {
  const { locale, text } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutFailed, setSignOutFailed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState<{ left: number; top: number } | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteFailed, setDeleteFailed] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pinningTaskId, setPinningTaskId] = useState<string | null>(null);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("todo");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [error, setError] = useState<"load" | "save" | "validation" | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [dialogClosing, setDialogClosing] = useState(false);
  const closingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDragFocus = useRef<string | null>(null);
  const addTaskButtonRef = useRef<HTMLButtonElement>(null);
  const createTaskDialogRef = useRef<HTMLDialogElement>(null);
  const deleteTaskDialogRef = useRef<HTMLDialogElement>(null);
  const cancelDeleteButtonRef = useRef<HTMLButtonElement>(null);
  const deleteTaskTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogDragRef = useRef<{ pointerId: number; startX: number; startY: number; startLeft: number; startTop: number } | null>(null);

  const columns = [
    { status: "todo" as const, title: text.waiting, note: text.emptyWaiting, color: "bg-[#b9a36b]" },
    { status: "in_progress" as const, title: text.inProgress, note: text.emptyInProgress, color: "bg-[#72927a]" },
    { status: "completed" as const, title: text.completed, note: text.emptyCompleted, color: "bg-[#8b9aab]" },
  ];
  const priorities = [
    { value: "low" as const, label: text.priorityLow },
    { value: "medium" as const, label: text.priorityMedium },
    { value: "high" as const, label: text.priorityHigh },
  ];

  useEffect(() => {
    let isActive = true;
    void fetchTasks()
      .then((loadedTasks) => {
        if (!Array.isArray(loadedTasks)) throw new Error("load");
        if (isActive) setTasks(loadedTasks);
      })
      .catch((failure: unknown) => {
        if (isActive) {
          setRequestError(getRequestError(failure));
          setError("load");
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    const dialog = createTaskDialogRef.current;
    if (!isCreateDialogOpen || !dialog || dialog.open) return;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>("[name='task-title']")?.focus();
  }, [isCreateDialogOpen]);

  useEffect(() => () => { if (closingTimerRef.current) clearTimeout(closingTimerRef.current); }, []);

  function closeCreateDialog() {
    if (closingTimerRef.current) return;
    const finish = () => {
      if (createTaskDialogRef.current?.open) createTaskDialogRef.current.close();
      setIsCreateDialogOpen(false);
      setDialogClosing(false);
      dialogDragRef.current = null;
      setDialogPosition(null);
      closingTimerRef.current = null;
      window.requestAnimationFrame(() => addTaskButtonRef.current?.focus());
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    setDialogClosing(true);
    closingTimerRef.current = setTimeout(finish, 180);
  }

  function openCreateDialog() {
    setError(null);
    setRequestError(null);
    setDialogPosition(null);
    setIsCreateDialogOpen(true);
  }

  function startDialogDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    const bounds = createTaskDialogRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const position = { left: bounds.left, top: bounds.top };
    setDialogPosition(position);
    dialogDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: bounds.left,
      startTop: bounds.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDialog(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dialogDragRef.current;
    const dialog = createTaskDialogRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !dialog) return;

    const bounds = dialog.getBoundingClientRect();
    const maxLeft = Math.max(16, window.innerWidth - 16 - bounds.width);
    const maxTop = Math.max(16, window.innerHeight - 16 - bounds.height);
    const left = Math.min(maxLeft, Math.max(16, drag.startLeft + event.clientX - drag.startX));
    const top = Math.min(maxTop, Math.max(16, drag.startTop + event.clientY - drag.startY));
    const position = { left, top };
    setDialogPosition(position);
  }

  function stopDialogDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dialogDragRef.current?.pointerId !== event.pointerId) return;
    dialogDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  async function signOut() {
    setSignOutFailed(false);
    setIsSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("sign-out");
      router.replace("/login");
      router.refresh();
    } catch {
      setSignOutFailed(true);
    } finally {
      setIsSigningOut(false);
    }
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setRequestError(null);
    if (!title.trim()) {
      setError("validation");
      createTaskDialogRef.current?.querySelector<HTMLInputElement>("[name='task-title']")?.focus();
      return;
    }
    setIsCreating(true);
    try {
      const createdTask = await createTaskRequest({ title, description, dueDate: dueDate || null, status, priority, scheduledAt: null, durationMinutes: null });
      setTasks((current) => [createdTask, ...current]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("todo");
      setPriority("medium");
      closeCreateDialog();
    } catch (failure: unknown) {
      setRequestError(getRequestError(failure));
      setError("save");
    } finally {
      setIsCreating(false);
    }
  }

  function startEditing(task: Task) {
    setError(null);
    setRequestError(null);
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate ?? "");
    setEditStatus(task.status);
    setEditPriority(task.priority);
  }

  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTaskId) return;
    if (!editTitle.trim()) {
      setRequestError(null);
      setError("validation");
      document.querySelector<HTMLInputElement>("[data-edit-task-title]")?.focus();
      return;
    }
    const taskId = editingTaskId;
    const originalTask = tasks.find((task) => task.id === taskId);

    if (originalTask) {
      const hasChanges =
        editTitle.trim() !== originalTask.title ||
        editDescription.trim() !== originalTask.description.trim() ||
        (editDueDate || null) !== (originalTask.dueDate || null) ||
        editStatus !== originalTask.status ||
        editPriority !== originalTask.priority;

      if (!hasChanges) {
        setEditingTaskId(null);
        return;
      }
    }

    setError(null);
    setRequestError(null);
    setSavingTaskId(taskId);
    try {
      const updatedTask = await updateTaskRequest(taskId, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate || null,
        status: editStatus,
        priority: editPriority,
      });
      setTasks((current) => current.map((task) => task.id === taskId ? updatedTask : task));
      setEditingTaskId(null);
    } catch (failure: unknown) {
      setRequestError(getRequestError(failure));
      setError("save");
    } finally {
      setSavingTaskId(null);
    }
  }

  async function waitForTaskExit() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) await new Promise((resolve) => setTimeout(resolve, 180));
  }

  useEffect(() => {
    const dialog = deleteTaskDialogRef.current;
    if (!taskToDelete || !dialog || dialog.open) return;
    dialog.showModal();
    cancelDeleteButtonRef.current?.focus();
  }, [taskToDelete]);

  function closeDeleteDialog() {
    deleteTaskDialogRef.current?.close();
    setTaskToDelete(null);
    setDeleteFailed(false);
    setDeleteError(null);
    requestAnimationFrame(() => {
      const trigger = deleteTaskTriggerRef.current;
      if (trigger?.isConnected) trigger.focus();
      else addTaskButtonRef.current?.focus();
    });
  }

  async function deleteTask() {
    if (!taskToDelete || isDeleting) return;
    const task = taskToDelete;
    setDeleteFailed(false);
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteTaskRequest(task.id);
      setDeletingTaskId(task.id);
      await waitForTaskExit();
      setTasks((current) => current.filter((item) => item.id !== task.id));
      if (editingTaskId === task.id) setEditingTaskId(null);
      closeDeleteDialog();
      addTaskButtonRef.current?.focus();
    } catch (failure: unknown) {
      setDeleteError(getRequestError(failure));
      setDeleteFailed(true);
    } finally {
      setDeletingTaskId(null);
      setIsDeleting(false);
    }
  }

  async function togglePin(task: Task) {
    setError(null);
    setRequestError(null);
    setPinningTaskId(task.id);
    try {
      const updatedTask = await updateTaskRequest(task.id, { isPinned: !task.isPinned });
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item));
    } catch (failure: unknown) {
      setRequestError(getRequestError(failure));
      setError("save");
    } finally {
      setPinningTaskId(null);
    }
  }

  async function moveTask(task: Task, nextStatus: TaskStatus) {
    if (task.status === nextStatus || movingTaskId) return;

    setError(null);
    setRequestError(null);
    setMovingTaskId(task.id);
    try {
      const updatedTask = await updateTaskRequest(task.id, { status: nextStatus });
      await waitForTaskExit();
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item));
    } catch (failure: unknown) {
      setRequestError(getRequestError(failure));
      setError("save");
    } finally {
      setMovingTaskId(null);
    }
  }

  const keyboardCoordinates: KeyboardCoordinateGetter = (event, args) => {
    if ((event.code === "ArrowLeft" || event.code === "ArrowRight") && args.context.collisionRect) {
      const current = args.context.collisionRect;
      const centerX = current.left + current.width / 2;
      const centerY = current.top + current.height / 2;
      const direction = event.code === "ArrowLeft" ? -1 : 1;
      const targets = columns.map((column) => args.context.droppableRects.get(column.status)).filter((rect) => rect !== undefined)
        .filter((rect) => direction * (rect.left + rect.width / 2 - centerX) > current.width / 2)
        .sort((a, b) => Math.abs(a.left + a.width / 2 - centerX) - Math.abs(b.left + b.width / 2 - centerX));
      const target = targets[0];
      if (target) {
        event.preventDefault();
        const y = Math.max(target.top + 40, Math.min(centerY, target.bottom - 40));
        return { x: args.currentCoordinates.x + target.left + target.width / 2 - centerX, y: args.currentCoordinates.y + y - centerY };
      }
    }
    return sortableKeyboardCoordinates(event, args);
  };
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates }));
  useEffect(() => {
    if (movingTaskId || !pendingDragFocus.current) return;
    const id = pendingDragFocus.current;
    const frame = requestAnimationFrame(() => {
      const handle = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-task-drag-handle]"))
        .find((element) => element.dataset.taskDragHandle === id);
      handle?.focus();
      pendingDragFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [movingTaskId]);

  async function onDragEnd({ active, over, activatorEvent }: DragEndEvent) {
    if (!over || active.id === over.id || movingTaskId) return;
    const task = tasks.find((item) => item.id === active.id);
    if (!task) return;
    const move = calculateTaskMove(tasks, String(active.id), String(over.id));
    if (!move) { setRequestError(null); setError("save"); return; }
    const { status: targetStatus, position } = move;
    if (activatorEvent instanceof KeyboardEvent) pendingDragFocus.current = task.id;
    setError(null);
    setRequestError(null);
    setMovingTaskId(task.id);
    try {
      const updatedTask = await updateTaskRequest(task.id, { status: targetStatus, position });
      await waitForTaskExit();
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item));
    } catch (failure: unknown) { setRequestError(getRequestError(failure)); setError("save"); } finally { setMovingTaskId(null); }
  }

  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const errorMessage = requestError ?? (error === "load" ? text.taskLoadError : error === "save" ? text.taskSaveError : error === "validation" ? text.taskTitleRequired : null);
  const priorityStyles: Record<TaskPriority, string> = {
    low: "bg-[#e6f0ff] text-[#23539a] dark:bg-[#1e2d46] dark:text-[#b7d2ff]",
    medium: "bg-[#fff0d6] text-[#8a5200] dark:bg-[#3a2c17] dark:text-[#f1ca7a]",
    high: "bg-[#fde8e7] text-[#a33b37] dark:bg-[#402321] dark:text-[#f0aaa5]",
  };
  function formatDueDate(value: string) {
    return new Intl.DateTimeFormat(locale === "so" ? "so-SO" : "en-US", {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(`${value}T00:00:00.000Z`));
  }

  return (
    <main data-language-content className="min-h-screen bg-[#f8f8f5] text-[#18211c] dark:bg-[#111914] dark:text-[#e8eee9]">
      <header className="border-b border-[#e9ece7] bg-white/80 dark:border-[#2d3a31] dark:bg-[#18221b]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="sm:hidden"><BrandLogo size="sm" /></span>
            <span className="hidden sm:inline-flex"><BrandLogo /></span>
          </Link>
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-3" aria-label={text.accountNavigation}>
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Menu.Root>
              <Menu.Trigger
                type="button"
                aria-label={`${text.profileMenu}: ${userName}`}
                disabled={isSigningOut}
                className="inline-flex h-10 min-w-0 items-center gap-2 rounded-full border border-[#dfe5de] bg-white/70 px-2.5 text-sm font-semibold text-[#425047] outline-none transition hover:bg-[#f4f6f2] focus-visible:ring-2 focus-visible:ring-[#719378] disabled:opacity-60 dark:border-[#34443a] dark:bg-[#1a251e] dark:text-[#d3ddd5] dark:hover:bg-[#253128]"
              >
                <ProfileAvatar key={userImage || "initial"} image={userImage} name={userName} email={userEmail} className="size-7" />
                <span className="hidden max-w-32 truncate sm:inline">{userName}</span>
                <ChevronDown className="hidden size-4 shrink-0 text-[#819087] sm:block" aria-hidden="true" />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner side="bottom" align="end" sideOffset={8} collisionPadding={12} className="z-[120] outline-none">
                  <Menu.Popup className="planify-popup w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#dfe5de] bg-white p-2 text-[#344239] shadow-xl shadow-[#153521]/15 outline-none dark:border-[#3a4b3e] dark:bg-[#1b271f] dark:text-[#e2eae4]">
                    <div role="group" aria-label={text.signedInAs} className="flex items-center gap-3 px-2.5 py-2.5">
                      <ProfileAvatar key={userImage || "initial-menu"} image={userImage} name={userName} email={userEmail} className="size-10 text-sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#26342a] dark:text-[#e2eae4]">{userName}</span>
                        <span className="block truncate text-xs text-[#7a857d] dark:text-[#aebbb1]">{userEmail}</span>
                      </span>
                    </div>
                    <Menu.Separator className="my-1.5 h-px bg-[#edf0eb] dark:bg-[#34443a]" />
                    <Menu.LinkItem href="/profile" className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#48564b] outline-none transition data-[highlighted]:bg-[#f0f5ef] data-[highlighted]:text-[#17452d] focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#c9d4cb] dark:data-[highlighted]:bg-[#26382b] dark:data-[highlighted]:text-[#e5eee7]">
                      <UserRound className="size-4 text-[#718676] dark:text-[#9fb5a3]" aria-hidden="true" />
                      {text.profile}
                    </Menu.LinkItem>
                    <Menu.Separator className="my-1.5 h-px bg-[#edf0eb] dark:bg-[#34443a]" />
                    <Menu.Item
                      onClick={() => void signOut()}
                      closeOnClick
                      className="flex min-h-10 cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#9a5548] outline-none transition data-[highlighted]:bg-[#fff2ef] data-[highlighted]:text-[#8f4035] focus-visible:ring-2 focus-visible:ring-[#c27d70] dark:text-[#e4aaa0] dark:data-[highlighted]:bg-[#2a1c19] dark:data-[highlighted]:text-[#f0b6aa]"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      {isSigningOut ? text.processing : text.signOut}
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[#6d9275]">{text.dashboardEyebrow}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{text.dashboardTitle}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#768078] dark:text-[#b4c0b7]">{text.dashboardDescription}</p>
          </div>
          <button
            ref={addTaskButtonRef}
            type="button"
            onClick={openCreateDialog}
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full bg-[#17452d] px-6 text-sm font-semibold text-white shadow-sm shadow-[#183c22]/10 transition hover:bg-[#103a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 dark:bg-[#2f6a46] dark:hover:bg-[#397a53] dark:focus-visible:ring-[#9fbea4] sm:self-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            {text.createTask}
          </button>
        </div>

        {isCreateDialogOpen && (
          <dialog
            ref={createTaskDialogRef}
            aria-modal="true"
            data-closing={dialogClosing || undefined}
            aria-labelledby="create-task-title"
            onClick={(event) => {
              if (event.target !== event.currentTarget) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              const clickIsInsideDialog = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
              if (!clickIsInsideDialog) closeCreateDialog();
            }}
            onCancel={(event) => {
              event.preventDefault();
              closeCreateDialog();
            }}
            style={dialogPosition ? { left: `${dialogPosition.left}px`, top: `${dialogPosition.top}px`, right: "auto", bottom: "auto", margin: 0 } : undefined}
            className="task-create-dialog fixed inset-0 mx-auto my-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100%-2rem))] overflow-x-hidden overflow-y-auto rounded-2xl border border-[#e1e7df] bg-white p-0 text-[#18211c] shadow-2xl shadow-[#12251a]/25 dark:border-[#34443a] dark:bg-[#18221b] dark:text-[#e8eee9]"
          >
            <div
              onPointerDown={startDialogDrag}
              onPointerMove={moveDialog}
              onPointerUp={stopDialogDrag}
              onPointerCancel={stopDialogDrag}
              title={text.dragDialog}
              className="flex touch-none cursor-move select-none items-center justify-between gap-4 border-b border-[#edf0eb] px-5 py-3.5 dark:border-[#2d3a31] sm:px-6"
            >
              <div>
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d9275]"><Grip className="size-3.5" aria-hidden="true" />Planify</p>
                <h2 id="create-task-title" className="mt-0.5 text-lg font-semibold tracking-tight">{text.addTask}</h2>
              </div>
              <button type="button" onClick={closeCreateDialog} aria-label={text.closeDialog} className="grid size-9 shrink-0 place-items-center rounded-full border border-[#e1e7df] text-[#69766c] transition hover:bg-[#f4f6f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] dark:border-[#34443a] dark:text-[#bdc8bf] dark:hover:bg-[#253128] dark:focus-visible:ring-[#9fbea4]">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={createTask} className="grid gap-3 px-5 py-4 sm:px-6">
              <label className="grid gap-1 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
                {text.taskTitle}
                <input name="task-title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} aria-invalid={error === "validation"} placeholder={text.taskTitlePlaceholder} className="h-10 min-w-0 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3.5 text-sm outline-none transition placeholder:text-[#9aa39c] focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/15 dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9] dark:placeholder:text-[#839087]" />
              </label>
              <label className="grid gap-1 text-sm font-medium text-[#425047] dark:text-[#d3ddd5]">
                {text.taskDescription}
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} rows={2} placeholder={text.taskDescriptionPlaceholder} className="min-h-16 min-w-0 resize-y rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-[#9aa39c] focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/15 dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9] dark:placeholder:text-[#839087]" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TaskDatePicker
                  label={text.dueDate}
                  value={dueDate}
                  onChange={setDueDate}
                  locale={locale}
                  todayLabel={text.today}
                  clearLabel={text.clear}
                  previousMonthLabel={text.previousMonth}
                  nextMonthLabel={text.nextMonth}
                  portalContainer={createTaskDialogRef}
                />
                <TaskSelect label={text.statusLabel} value={status} onChange={(next) => setStatus(next as TaskStatus)} options={columns.map(({ status: optionStatus, title: optionTitle }) => ({ value: optionStatus, label: optionTitle }))} portalContainer={createTaskDialogRef} />
                <div className="sm:col-span-2">
                  <TaskSelect label={text.priorityLabel} value={priority} onChange={(next) => setPriority(next as TaskPriority)} options={priorities} portalContainer={createTaskDialogRef} />
                </div>
              </div>
              {(error === "save" || error === "validation") && errorMessage && <p role="alert" className="rounded-xl border border-[#efd4cf] bg-[#fff5f2] px-4 py-3 text-sm text-[#9a4538] dark:border-[#69453f] dark:bg-[#2a1c19] dark:text-[#f0b6aa]">{errorMessage}</p>}
              <div className="flex flex-col-reverse justify-end gap-2.5 border-t border-[#edf0eb] pt-3 dark:border-[#2d3a31] sm:flex-row">
                <button type="button" onClick={closeCreateDialog} className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dfe5de] px-5 text-sm font-semibold text-[#526056] transition hover:bg-[#f4f6f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] dark:border-[#34443a] dark:text-[#d3ddd5] dark:hover:bg-[#253128] dark:focus-visible:ring-[#9fbea4]">
                  {text.cancel}
                </button>
                <button type="submit" disabled={isCreating || !title.trim()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#17452d] px-5 text-sm font-semibold text-white transition hover:bg-[#103a24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315d3c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#2f6a46] dark:hover:bg-[#397a53] dark:focus-visible:ring-[#9fbea4]">
                  {isCreating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                  {text.createTask}
                </button>
              </div>
            </form>
          </dialog>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const count = tasks.filter((task) => task.status === column.status).length;
            return (
              <div key={column.status} className="flex items-center gap-3 rounded-2xl border border-[#e9ece7] bg-white px-5 py-4 shadow-sm shadow-[#183c22]/[0.02] dark:border-[#2d3a31] dark:bg-[#1a251e]">
                <span className={`size-2.5 rounded-full ${column.color}`} />
                <span className="text-sm font-semibold">{column.title}</span>
                <span className="ml-auto grid size-7 place-items-center rounded-full bg-[#f5f6f3] text-xs text-[#819087] dark:bg-[#253128] dark:text-[#a3b0a7]">{count}</span>
              </div>
            );
          })}
          <div className="rounded-2xl border border-[#e9ece7] bg-white px-5 py-4 shadow-sm shadow-[#183c22]/[0.02] dark:border-[#2d3a31] dark:bg-[#1a251e]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{text.completionProgress}</span>
              <span className="text-sm font-semibold text-[#315d3c] dark:text-[#b7cfba]">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf1ed] dark:bg-[#29372e]" role="progressbar" aria-label={text.completionProgress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="h-full rounded-full bg-[#4d8a5a] transition-[width] duration-300 ease-in-out motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#87928a] dark:text-[#a3b0a7]">{completedCount} / {totalCount} {text.completed.toLowerCase()}</p>
          </div>
        </div>

        {errorMessage && (error === "load" || !isCreateDialogOpen) && <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#efd4cf] bg-[#fff5f2] px-4 py-3 text-sm text-[#9a4538] dark:border-[#69453f] dark:bg-[#2a1c19] dark:text-[#f0b6aa]"><span>{errorMessage}</span>{error === "load" && <button type="button" onClick={() => { setError(null); setIsLoading(true); setLoadAttempt((attempt) => attempt + 1); }} className="rounded-lg px-3 py-1.5 font-semibold text-[#17452d] outline-none hover:bg-[#fbe5e1] focus-visible:ring-2 focus-visible:ring-[#719378] dark:text-[#c1d8c5] dark:hover:bg-[#3b2724]">{text.retry}</button>}</div>}
        {signOutFailed && <p role="alert" className="mt-3 rounded-xl border border-[#efd4cf] bg-[#fff5f2] px-4 py-3 text-sm text-[#9a4538] dark:border-[#69453f] dark:bg-[#2a1c19] dark:text-[#f0b6aa]">{text.signOutError}</p>}

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd} accessibility={{
          screenReaderInstructions: { draggable: locale === "so" ? "Riix space si aad u qaaddo. Isticmaal fallaaraha si aad u dhaqaajiso, space si aad u dhigto, ama Escape si aad u joojiso." : "Press space to pick up. Use the arrow keys to move, space to drop, or Escape to cancel." },
          announcements: {
            onDragStart: ({ active }) => locale === "so" ? `Waxaa la qaaday ${tasks.find((item) => item.id === active.id)?.title ?? "hawsha"}.` : `Picked up ${tasks.find((item) => item.id === active.id)?.title ?? "task"}.`,
            onDragOver: ({ over }) => over ? (locale === "so" ? "Hawsha waxaa la dul keenay meel la dhigi karo." : "Task is over a drop target.") : undefined,
            onDragEnd: ({ over }) => over ? (locale === "so" ? "Hawsha waa la dhigay; isbeddelka ayaa la kaydinayaa." : "Task dropped; saving the change.") : (locale === "so" ? "Hawsha lama dhaqaajin." : "Task was not moved."),
            onDragCancel: () => locale === "so" ? "Dhaqaajinta hawsha waa la joojiyay." : "Task move cancelled.",
          },
        }}>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.status === column.status)
              .sort((left, right) => Number(right.isPinned) - Number(left.isPinned) || left.position - right.position);
            return (
              <TaskColumn key={column.status} id={column.status} label={`${text.tasksFor}${column.title}`}>
                <div className="-mx-4 -mt-4 mb-4 flex items-center gap-3 rounded-t-2xl border-b border-[#b1c9af] bg-[#d8e7d3] px-4 py-3.5 dark:border-[#405546] dark:bg-[#25382a] sm:-mx-5 sm:-mt-5 sm:px-5">
                  {column.status === "todo" ? <CircleDot className="size-5 text-[#326a42] dark:text-[#a6c5a9]" aria-hidden="true" /> : column.status === "in_progress" ? <CircleDashed className="size-5 text-[#326a42] dark:text-[#a6c5a9]" aria-hidden="true" /> : <CircleCheck className="size-5 text-[#326a42] dark:text-[#a6c5a9]" aria-hidden="true" />}
                  <h2 className="text-base font-bold tracking-[-0.01em] text-[#173f2b] dark:text-[#e2eae4]">{column.title}</h2>
                  <span className="ml-auto grid size-8 place-items-center rounded-full bg-[#b9d0b3] text-sm font-bold text-[#244c30] dark:bg-[#344a37] dark:text-[#d6ead9]">{columnTasks.length}</span>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#849087] dark:text-[#a3b0a7]">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> {text.loadingTasks}
                  </div>
                ) : error === "load" ? (
                  <div className="min-h-40" aria-hidden="true" />
                ) : columnTasks.length === 0 ? (
                  <div className="flex min-h-40 flex-col items-center justify-center px-3 text-center">
                    <Circle className="size-7 text-[#a7b8a8] dark:text-[#627466]" strokeWidth={1.5} aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-[#58665c] dark:text-[#d1dbd3]">{text.emptyTitle}</p>
                    <p className="mt-1.5 max-w-xs text-xs leading-5 text-[#89928a] dark:text-[#a3b0a7]">{column.note}</p>
                  </div>
                ) : (
                  <SortableContext items={columnTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                  <ul className="grid gap-3">
                    {columnTasks.map((task) => (
                        <SortableTask key={task.id} id={task.id} title={task.title} locale={locale} completed={task.status === "completed"} exiting={deletingTaskId === task.id || movingTaskId === task.id} disabled={Boolean(editingTaskId || movingTaskId || savingTaskId || deletingTaskId)}>
                        {editingTaskId === task.id ? (
                          <form onSubmit={saveTask} className="grid gap-3">
                            <label className="grid gap-1.5 text-xs font-medium text-[#68736b] dark:text-[#b4c0b7]">
                              {text.taskTitle}
                              <input data-edit-task-title value={editTitle} onChange={(event) => setEditTitle(event.target.value)} required maxLength={120} aria-invalid={error === "validation"} className="h-10 rounded-lg border border-[#dfe5de] bg-[#fcfcfa] px-3 text-sm text-[#18211c] outline-none focus:border-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9]" />
                            </label>
                            <label className="grid gap-1.5 text-xs font-medium text-[#68736b] dark:text-[#b4c0b7]">
                              {text.taskDescription}
                              <textarea value={editDescription} onChange={(event) => setEditDescription(event.target.value)} maxLength={2000} rows={2} className="resize-y rounded-lg border border-[#dfe5de] bg-[#fcfcfa] px-3 py-2 text-sm text-[#18211c] outline-none focus:border-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9]" />
                            </label>
                            <TaskDatePicker
                              label={text.dueDate}
                              value={editDueDate}
                              onChange={setEditDueDate}
                              locale={locale}
                              todayLabel={text.today}
                              clearLabel={text.clear}
                              previousMonthLabel={text.previousMonth}
                              nextMonthLabel={text.nextMonth}
                              portalContainer={createTaskDialogRef}
                            />
                            <TaskSelect label={text.statusLabel} value={editStatus} onChange={(next) => setEditStatus(next as TaskStatus)} options={columns.map(({ status: optionStatus, title: optionTitle }) => ({ value: optionStatus, label: optionTitle }))} portalContainer={createTaskDialogRef} />
                            <TaskSelect label={text.priorityLabel} value={editPriority} onChange={(next) => setEditPriority(next as TaskPriority)} options={priorities} portalContainer={createTaskDialogRef} />
                            <div className="flex items-center gap-2 pt-1">
                              <button type="submit" disabled={savingTaskId === task.id} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#17452d] px-3 text-xs font-semibold text-white transition hover:bg-[#103a24] disabled:opacity-60 dark:bg-[#2f6a46]">
                                {savingTaskId === task.id ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Check className="size-3.5" aria-hidden="true" />}{text.saveTask}
                              </button>
                              <button type="button" onClick={() => setEditingTaskId(null)} className="grid size-9 place-items-center rounded-lg border border-[#dfe5de] text-[#657168] transition hover:bg-[#f4f6f2] dark:border-[#34443a] dark:text-[#b4c0b7] dark:hover:bg-[#253128]" aria-label={text.cancel}>
                                <X className="size-4" aria-hidden="true" />
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex items-start gap-3 pl-7">
                              {task.status === "completed" ? <Check className="mt-0.5 size-4 shrink-0 text-[#4e8d5b]" aria-label={column.title} /> : <Circle className="mt-0.5 size-4 shrink-0 text-[#9eae9f]" aria-hidden="true" />}
                              <div className="min-w-0 flex-1 pr-8">
                                <h3 className={`break-words text-base font-bold leading-6 tracking-[-0.015em] sm:text-[17px] ${task.status === "completed" ? "text-[#53695a] line-through dark:text-[#adbbb0]" : "text-[#172b1e] dark:text-[#e2eae4]"}`}>{task.title}</h3>
                                {task.isPinned && <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#e8f0e7] px-2 py-0.5 text-[10px] font-semibold text-[#285c38] dark:bg-[#2b3d2f] dark:text-[#c2ddc6]"><Pin className="size-3 fill-current" aria-hidden="true" />{text.pinned}</span>}
                                {task.description && <p className="mt-2 min-w-0 whitespace-pre-wrap break-words text-[13px] leading-5 [overflow-wrap:anywhere] text-[#4b5d50] dark:text-[#c5d0c7] sm:text-sm sm:leading-6">{task.description}</p>}
                              </div>
                              <Menu.Root>
                                <Menu.Trigger
                                  type="button"
                                  aria-label={`${text.taskActions}: ${task.title}`}
                                  disabled={Boolean(movingTaskId || savingTaskId || deletingTaskId)}
                                  className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-lg text-[#718076] outline-none transition hover:bg-[#f0f4ef] hover:text-[#285c38] focus-visible:ring-2 focus-visible:ring-[#719378] disabled:opacity-50 dark:text-[#b4c0b7] dark:hover:bg-[#253128] dark:hover:text-[#c2ddc6]"
                                >
                                  <MoreHorizontal className="size-4" aria-hidden="true" />
                                </Menu.Trigger>
                                <Menu.Portal>
                                  <Menu.Positioner side="bottom" align="end" sideOffset={6} collisionPadding={8} className="z-[110] outline-none">
                                    <Menu.Popup className="planify-popup min-w-48 rounded-xl border border-[#dfe5de] bg-white p-1.5 text-[#344239] shadow-xl shadow-[#153521]/15 outline-none dark:border-[#3a4b3e] dark:bg-[#1b271f] dark:text-[#e2eae4]">
                                      <Menu.Group>
                                        <Menu.GroupLabel className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#87928a] dark:text-[#9daa9f]">
                                          {text.moveTo}
                                        </Menu.GroupLabel>
                                        <Menu.RadioGroup
                                          aria-label={text.moveTo}
                                          value={task.status}
                                          onValueChange={(value) => void moveTask(task, value as TaskStatus)}
                                        >
                                          {columns.map((option) => (
                                            <Menu.RadioItem
                                              key={option.status}
                                              value={option.status}
                                              closeOnClick
                                              disabled={Boolean(movingTaskId)}
                                              className="flex min-h-9 cursor-default items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm outline-none transition data-[highlighted]:bg-[#f0f5ef] data-[highlighted]:text-[#17452d] data-[checked]:bg-[#e8f0e7] data-[checked]:font-semibold data-[checked]:text-[#17452d] disabled:opacity-50 dark:text-[#c9d4cb] dark:data-[highlighted]:bg-[#26382b] dark:data-[highlighted]:text-[#e5eee7] dark:data-[checked]:bg-[#2b3d2f] dark:data-[checked]:text-[#d6ead9]"
                                            >
                                              <span>{option.title}</span>
                                              <Menu.RadioItemIndicator>
                                                <Check className="size-4 text-[#28613c] dark:text-[#a7d1af]" aria-hidden="true" />
                                              </Menu.RadioItemIndicator>
                                            </Menu.RadioItem>
                                          ))}
                                        </Menu.RadioGroup>
                                      </Menu.Group>
                                    </Menu.Popup>
                                  </Menu.Positioner>
                                </Menu.Portal>
                              </Menu.Root>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-2 pl-[3.375rem]">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyles[task.priority]}`}>
                                <Flag className="size-3" aria-hidden="true" />
                                {text.priorityLabel}: {priorities.find((option) => option.value === task.priority)?.label ?? text.priorityMedium}
                              </span>
                              {task.dueDate && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f5f1] px-3 py-1.5 text-xs font-medium text-[#59675d] dark:bg-[#253128] dark:text-[#c2cec5]">
                                  <CalendarDays className="size-3" aria-hidden="true" /> {formatDueDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                            <div className="mt-3 flex justify-between gap-1 border-t border-[#e7ede4] pt-2 dark:border-[#2d3a31]">
                              <button type="button" onClick={() => startEditing(task)} disabled={Boolean(savingTaskId || deletingTaskId)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#5e7662] transition hover:bg-[#f0f4ef] disabled:opacity-50 dark:text-[#bbd1be] dark:hover:bg-[#253128]">
                                <Pencil className="size-3.5" aria-hidden="true" /> {text.editTask}
                              </button>
                              <button type="button" onClick={() => void togglePin(task)} aria-pressed={task.isPinned} disabled={Boolean(savingTaskId || deletingTaskId || pinningTaskId)} className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] disabled:opacity-50 ${task.isPinned ? "bg-[#e8f0e7] text-[#285c38] hover:bg-[#deeadc] dark:bg-[#2b3d2f] dark:text-[#c2ddc6] dark:hover:bg-[#344a37]" : "text-[#657168] hover:bg-[#f0f4ef] dark:text-[#b7c2ba] dark:hover:bg-[#253128]"}`}>
                                <Pin className={`size-3.5 ${task.isPinned ? "fill-current" : ""}`} aria-hidden="true" /> {task.isPinned ? text.unpinTask : text.pinTask}
                              </button>
                              <button type="button" onClick={(event) => { deleteTaskTriggerRef.current = event.currentTarget; setDeleteError(null); setDeleteFailed(false); setTaskToDelete(task); }} disabled={Boolean(savingTaskId || isDeleting)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#9a6258] transition hover:bg-[#fff2ef] disabled:opacity-50 dark:text-[#e4aaa0] dark:hover:bg-[#2a1c19]">
                                {deletingTaskId === task.id ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Trash2 className="size-3.5" aria-hidden="true" />} {text.deleteTask}
                              </button>
                            </div>
                          </>
                        )}
                      </SortableTask>
                    ))}
                  </ul>
                  </SortableContext>
                )}
              </TaskColumn>
            );
          })}
        </div>
        </DndContext>
      </section>
      {taskToDelete && (
        <dialog
          ref={deleteTaskDialogRef}
          aria-labelledby="delete-task-title"
          aria-describedby="delete-task-name delete-task-description"
          aria-modal="true"
          aria-busy={isDeleting}
          onCancel={(event) => {
            event.preventDefault();
            if (!isDeleting) closeDeleteDialog();
          }}
          className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[min(25rem,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-[#e1e7df] bg-white p-5 text-[#18211c] shadow-2xl backdrop:bg-black/45 sm:p-6 dark:border-[#34443a] dark:bg-[#18221b] dark:text-[#e8eee9]"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff2ef] text-[#a45b51] dark:bg-[#3b2724] dark:text-[#f0b6aa]">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>
            <button type="button" onClick={closeDeleteDialog} disabled={isDeleting} aria-label={text.closeDialog} className="grid size-9 shrink-0 place-items-center rounded-full border border-[#e1e7df] text-[#69766c] transition hover:bg-[#f4f6f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#719378] disabled:opacity-50 dark:border-[#34443a] dark:text-[#bdc8bf] dark:hover:bg-[#253128] dark:focus-visible:ring-[#9fbea4]">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <h2 id="delete-task-title" className="mt-4 text-lg font-semibold">
            {text.deleteTaskTitle}
          </h2>
          <p id="delete-task-name" className="mt-1 break-words text-base font-medium text-[#3f5946] dark:text-[#c3d6c6]">
            {taskToDelete.title}
          </p>
          <p id="delete-task-description" className="mt-2 text-sm text-[#657168] dark:text-[#b7c2ba]">
            {text.deleteTaskDescription}
          </p>
          {deleteFailed && (
            <p role="alert" className="mt-4 rounded-xl border border-[#efd4cf] bg-[#fff5f2] px-3 py-2 text-sm text-[#9a4539] dark:border-[#69453f] dark:bg-[#2a1c19] dark:text-[#f0b6aa]">
              {deleteError ?? text.taskDeleteError}
            </p>
          )}
          <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button ref={cancelDeleteButtonRef} type="button" onClick={closeDeleteDialog} disabled={isDeleting} className="min-h-11 rounded-xl border border-[#dfe5de] px-4 text-sm font-semibold hover:bg-[#f4f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#719378] disabled:opacity-50 dark:border-[#34443a] dark:hover:bg-[#253128]">
              {text.cancel}
            </button>
            <button type="button" onClick={() => void deleteTask()} disabled={isDeleting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a45b51] px-4 text-sm font-semibold text-white transition hover:bg-[#914b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a4539] disabled:cursor-wait disabled:opacity-70">
              {isDeleting && <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              {isDeleting ? text.processing : text.deleteTask}
            </button>
          </div>
        </dialog>
      )}
    </main>
  );
}
