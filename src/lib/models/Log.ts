import mongoose, { Schema } from "mongoose";

/**
 * Mongoose Schema for Winston MongoDB Logs
 * This allows the Admin Dashboard to query the "system_logs" collection 
 * created by winston-mongodb for the Audit Trail.
 */
const LogSchema = new Schema({
  timestamp: { type: Date, required: true },
  level: { type: String, required: true },
  message: { type: String, required: true },
  meta: {
    service: String,
    action: String,
    module: String,
    userName: String,
    ip: String,
    userAgent: String,
    diff: Schema.Types.Mixed,
  }
}, { 
  collection: "system_logs", // Must match winston.transports.MongoDB.collection
  timestamps: false           // Winston handles timestamps manually
});

export const LogModel = mongoose.models.Log || mongoose.model("Log", LogSchema);
