import "server-only";

import mongoose, { Schema, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    dueDate: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    durationMinutes: { type: Number, min: 5, max: 720, default: null },
    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },
    isPinned: { type: Boolean, default: false },
    position: { type: Number, default: () => -Date.now() },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false },
);

taskSchema.index({ userId: 1, status: 1, createdAt: -1 });

export type Task = InferSchemaType<typeof taskSchema>;
export const TaskModel = mongoose.models.Task ?? mongoose.model("Task", taskSchema);
