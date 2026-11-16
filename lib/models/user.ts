import "server-only";

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    image: { type: String },
    phoneNumber: { type: String },
    planningMode: { type: String, enum: ["basic", "advanced"], default: "basic" },
    timeZone: { type: String, default: "Africa/Mogadishu" },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { collection: "user", strict: false, versionKey: false },
);

export const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema);
