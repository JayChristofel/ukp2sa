import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Model Token buat Reset Password (UKP2SA)
 * Expired dalam waktu 1 jam
 */
const PasswordResetSchema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Auto-delete lewat TTL Index
}, { timestamps: true });

export interface IPasswordReset extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export const PasswordResetModel: Model<IPasswordReset> = 
  mongoose.models.PasswordReset || mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema);
