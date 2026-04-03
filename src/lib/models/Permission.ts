import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Model Permission (Master Izin)
 * Digunakan untuk mendefinisikan apa saja yang bisa dilakukan di sistem.
 */
const PermissionSchema = new Schema({
  id: { type: String, required: true, unique: true }, // slug: 'reports:read'
  name: { type: String, required: true },
  module: { type: String, required: true }, // Group: 'Laporan', 'Keuangan'
  description: { type: String },
}, { timestamps: true });

PermissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: Record<string, any>) {
    if (ret._id) delete ret._id;
  }
});

export interface IPermission extends Document {
  id: string;
  name: string;
  module: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PermissionModel: Model<IPermission> = 
  mongoose.models.Permission || mongoose.model<IPermission>("Permission", PermissionSchema);
