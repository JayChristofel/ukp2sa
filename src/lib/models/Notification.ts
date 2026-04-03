import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["payment", "report", "system", "assignment"],
      default: "system",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    actionLabel: { type: String },
    link: { type: String },
    externalId: { type: String, unique: true, sparse: true }, // To prevent duplicates from external APIs
    isRead: { type: Boolean, default: false },
    readBy: [{ type: String }], // Optional: Array of user IDs who have read it
  },
  { timestamps: true }
);

export const NotificationModel =
  mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
