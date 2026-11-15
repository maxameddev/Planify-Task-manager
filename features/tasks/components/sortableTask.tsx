"use client";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "motion/react";

export function TaskColumn({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: "column" } });
  return <section ref={setNodeRef} aria-label={label} className={`min-h-64 rounded-2xl border bg-[#e4ede0] p-4 shadow-[0_2px_8px_rgba(23,63,43,0.05)] transition-colors dark:bg-[#151e18] sm:p-5 ${isOver ? "border-[#477a52] bg-[#d6e9d6] dark:border-[#719378] dark:bg-[#202d24]" : "border-[#b8cdb6] dark:border-[#405546]"}`}>{children}</section>;
}
export function SortableTask({ id, title, locale, disabled, exiting, completed, children }: { id: string; title: string; locale: string; disabled: boolean; exiting: boolean; completed?: boolean; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  return <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition: reduceMotion ? undefined : transition }} className={`task-card relative rounded-xl border p-4 shadow-[0_3px_10px_rgba(23,63,43,0.09)] dark:border-[#48604e] dark:bg-[#1a251e] ${completed ? "border-[#a7c3a5] bg-[#f4faf1]" : "border-[#bccfbc] bg-white"} ${isDragging ? "z-10 ring-2 ring-[#719378]/50 shadow-xl shadow-[#183c22]/15 dark:ring-[#9fbea4]/40" : ""}`}>
    <button type="button" data-task-drag-handle={id} {...attributes} {...listeners} aria-label={`${locale === "so" ? "Dhaqaaji hawsha" : "Move task"}: ${title}`} className="absolute left-2 top-3 grid size-8 touch-none place-items-center rounded-md text-xs text-[#657168] focus-visible:outline-2 focus-visible:outline-[#719378] disabled:hidden dark:text-[#b4c0b7]" title={locale === "so" ? "Jiid si aad u dhaqaajiso" : "Drag to move"}>⠿</button>
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: exiting ? 0 : isDragging ? 0.94 : 1, y: exiting ? -8 : isDragging ? -3 : 0, scale: exiting ? 0.98 : isDragging ? 1.025 : 1 }}
      layout={reduceMotion ? false : "position"}
      transition={reduceMotion ? { duration: 0 } : {
        opacity: { duration: exiting ? 0.22 : 0.3, ease: "easeOut" },
        y: { type: "spring", stiffness: 280, damping: 24 },
        scale: { type: "spring", stiffness: 320, damping: 22 },
        layout: { type: "spring", stiffness: 280, damping: 28 },
      }}
      className="origin-center"
    >
      {children}
    </motion.div>
  </li>;
}
