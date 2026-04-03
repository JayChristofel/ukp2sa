import mongoose, { Schema, Document } from "mongoose";

export interface ILoginAttempt extends Document {
  email: string;
  ip: string;
  count: number;
  lastAttempt: Date;
}

const LoginAttemptSchema = new Schema({
  email: { type: String, required: true },
  ip: { type: String, required: true },
  count: { type: Number, default: 0 },
  lastAttempt: { type: Date, default: Date.now },
});

// TTL Index buat beresin data lama (misal 15 menit cooldown)
LoginAttemptSchema.index({ lastAttempt: 1 }, { expireAfterSeconds: 900 });

export const LoginAttemptModel: mongoose.Model<ILoginAttempt> = 
  mongoose.models.LoginAttempt || mongoose.model<ILoginAttempt>("LoginAttempt", LoginAttemptSchema);
