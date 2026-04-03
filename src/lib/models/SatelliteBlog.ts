import mongoose, { Schema } from "mongoose";
const mongooseHistoryTrace = require("mongoose-history-trace");

const PublicUpdateSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Berita", "Pengumuman", "Literasi", "Hoaks & Klarifikasi"],
    required: true 
  },
  publishDate: { type: String, default: () => new Date().toISOString() },
  author: { type: String, required: true },
  image: { type: String },
  tags: [String],
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Audit Trail
PublicUpdateSchema.plugin(mongooseHistoryTrace as any, {
  collection: "audit_traces",
  isAuthenticated: true,
  userField: "updatedBy",
});
PublicUpdateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IPublicUpdateDocument extends mongoose.Document {
  title: string;
  summary: string;
  content: string;
  category: "Berita" | "Pengumuman" | "Literasi" | "Hoaks & Klarifikasi";
  publishDate: string;
  author: string;
  image?: string;
  tags?: string[];
  views: number;
}

export const PublicUpdateModel: mongoose.Model<IPublicUpdateDocument> = 
  mongoose.models.PublicUpdate || mongoose.model<IPublicUpdateDocument>("PublicUpdate", PublicUpdateSchema);

const SatelliteIntelSchema = new Schema({
  intelId: { type: String, required: true },
  type: { type: String, enum: ["Rainfall", "Deformation", "Vegetation", "Heatmap"], required: true },
  value: { type: Number, required: true },
  coordinates: { type: [Number], required: true }, // [lng, lat]
  timestamp: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

SatelliteIntelSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface ISatelliteIntelDocument extends mongoose.Document {
  intelId: string;
  type: "Rainfall" | "Deformation" | "Vegetation" | "Heatmap";
  value: number;
  coordinates: number[];
  timestamp: string;
}

export const SatelliteIntelModel: mongoose.Model<ISatelliteIntelDocument> = 
  mongoose.models.SatelliteIntel || mongoose.model<ISatelliteIntelDocument>("SatelliteIntel", SatelliteIntelSchema);
