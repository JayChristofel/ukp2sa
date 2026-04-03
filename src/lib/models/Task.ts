import mongoose, { Schema } from "mongoose";
import { TaskStatus, TaskPriority } from "../types";
import mongooseHistoryTrace from "mongoose-history-trace";

const TaskSchema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
  title: { type: String, required: true },
  assignedTo: { type: String, required: true }, // Partner ID or Name
  assignedToCategory: { 
    type: String, 
    enum: ['K/L', 'Pemda', 'Satgas', 'NGO'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Critical', 'High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'En Route', 'On Site', 'Resolved', 'Escalated'], 
    default: 'Pending' 
  },
  deadline: { type: String },
  notes: { type: String },
  resolvedAt: { type: String }
}, { timestamps: true });

TaskSchema.virtual('instansi', {
  ref: 'Partner',
  localField: 'assignedTo',
  foreignField: 'id',
  justOne: true
});

// Audit Trail
TaskSchema.plugin(mongooseHistoryTrace as any, {
  collection: "audit_traces",
  isAuthenticated: true,
  userField: "updatedBy",
});
TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: Record<string, any>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface ITaskDocument extends mongoose.Document {
  reportId?: string;
  title: string;
  assignedTo: string;
  instansi?: any;
  assignedToCategory: 'K/L' | 'Pemda' | 'Satgas' | 'NGO';
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  notes: string;
  createdAt: Date;
  resolvedAt?: string;
}

export const TaskModel: mongoose.Model<ITaskDocument> = 
  mongoose.models.Task || mongoose.model<ITaskDocument>("Task", TaskSchema);
