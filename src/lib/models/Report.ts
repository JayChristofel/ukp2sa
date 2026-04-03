import mongoose, { Schema } from "mongoose";
import { IReport } from "../types";
import mongooseHistoryTrace from "mongoose-history-trace";
import { encrypt, decrypt } from "../crypto";

const ReportSchema = new Schema({
  id: { type: String, unique: true }, // Custom ID from frontend/timestamp
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  
  // Detailed Location
  regency: { type: String, required: true },
  district: { type: String },
  village: { type: String },
  address: { type: String },

  // PII Data (Encrypted)
  reporterName: { type: String, required: true },
  contactPhone: { type: String },
  nik: { type: String },

  latitude: { type: String },
  longitude: { type: String },
  timeAgo: { type: String },
  status: { 
    type: String, 
    enum: ['Diproses', 'Selesai', 'Menunggu'],
    default: 'Menunggu'
  },
  category: { type: String, required: true },
  source: { 
    type: String, 
    enum: ['rest', 'graphql', 'mobile', 'satellite'],
    default: 'rest'
  },
  reporterType: { 
    type: String, 
    enum: ['masyarakat', 'pemerintah', 'admin', 'partner', 'ngo'],
    default: 'masyarakat'
  },
  isVerified: { type: Boolean, default: false },

  // Attachments & Dynamic Data
  images: [String],
  answers: [
    {
      questionId: Number,
      answer: Schema.Types.Mixed,
    },
  ],

  adminReply: {
    content: String,
    repliedAt: String,
    repliedBy: String
  },
  satelliteIntel: {
    rainfallLevel: String,
    groundDeformation: String,
    vegetationIndex: Number,
    confidenceScore: Number,
    lastScan: String
  }
}, { timestamps: true });

// Audit Trail
ReportSchema.plugin(mongooseHistoryTrace as any, {
  collection: "audit_traces",
  isAuthenticated: true,
  userField: "updatedBy",
});

// Encryption Hook before saving
ReportSchema.pre('save', async function(this: any) {
  if (this.isModified('nik') && this.nik) {
    this.nik = encrypt(this.nik);
  }
  if (this.isModified('contactPhone') && this.contactPhone) {
    this.contactPhone = encrypt(this.contactPhone);
  }
});

// Decryption Hook when retrieving (post-init)
ReportSchema.post('init', function(doc) {
  if (doc.nik) {
    doc.nik = decrypt(doc.nik);
  }
  if (doc.contactPhone) {
    doc.contactPhone = decrypt(doc.contactPhone);
  }
});

export interface IReportDocument extends IReport, mongoose.Document {
    id: string;
}

export const ReportModel: mongoose.Model<IReportDocument> = 
  mongoose.models.Report || mongoose.model<IReportDocument>("Report", ReportSchema);
