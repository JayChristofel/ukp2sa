import mongoose, { Schema } from "mongoose";
import { UserStatus, UserRole } from "../types";
import mongooseHistoryTrace from "mongoose-history-trace";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { 
    type: String, 
    enum: ['presiden', 'deputi', 'partner', 'ngo', 'admin', 'operator', 'superadmin', 'public'],
    default: 'public'
  },
  instansiId: { type: String },
  status: { 
    type: String, 
    enum: Object.values(UserStatus), 
    default: UserStatus.ACTIVE 
  },
  avatar: { type: String },
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
}, { timestamps: true });

// Audit Trail
UserSchema.plugin(mongooseHistoryTrace as any, {
  collection: "audit_traces",
  isAuthenticated: true,
  userField: "updatedBy",
  ignore: ['password', 'resetToken', 'resetTokenExpiry'] // Prevent logging sensitive info
});
UserSchema.virtual('instansi', {
  ref: 'Partner',
  localField: 'instansiId',
  foreignField: 'id',
  justOne: true
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  instansiId?: string;
  instansi?: any;
  status: UserStatus;
  avatar?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel: mongoose.Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
