import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Model Role (Hak Akses)
 * Digunakan untuk integrasi RBSA (Role-Based Service Access)
 */
const RoleSchema = new Schema({
  id: { type: String, required: true, unique: true }, // slug: 'admin', 'partner', etc.
  name: { type: String, required: true },
  description: { type: String, required: true },
  permissions: [{ type: String }], // Array of strings from PERMISSIONS.REPORTS_READ, etc.
}, { timestamps: true });

RoleSchema.virtual('permissionDetails', {
  ref: 'Permission',
  localField: 'permissions',
  foreignField: 'id'
});

RoleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: Record<string, any>) {
    if (ret._id) {
      delete ret._id;
    }
  }
});

export interface IRole extends Document {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const RoleModel: Model<IRole> = 
  mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);
