import mongoose, { Schema } from "mongoose";
import { FundingSourceType, DisbursementStage } from "../types";
import mongooseHistoryTrace from "mongoose-history-trace";

const FinancialRecordSchema = new Schema({
  instansiId: { type: String, required: true },
  programName: { type: String, required: true },
  allocation: { type: Number, required: true },
  realization: { type: Number, required: true },
  percentage: { type: Number, required: true },
  source: { type: String, enum: Object.values(FundingSourceType), required: true },
  disbursementStage: { type: String, enum: ['Planning', 'Approval', 'Treasury', 'Transfer', 'Completed'], required: true },
  history: [{
    stage: String,
    amount: Number,
    date: { type: String, default: () => new Date().toISOString() },
    note: String
  }],
  lastUpdate: { type: String, default: () => new Date().toISOString() },
  status: { type: String, enum: ['Draft', 'Final'], default: 'Draft' },
  orderId: { type: String },
  paymentStatus: { type: String, default: 'pending' }
}, { timestamps: true });

FinancialRecordSchema.virtual('instansi', {
  ref: 'Partner',
  localField: 'instansiId',
  foreignField: 'id',
  justOne: true
});

// Audit Trail for Money!
FinancialRecordSchema.plugin(mongooseHistoryTrace as any, {
  collection: "audit_traces",
  isAuthenticated: true,
  userField: "updatedBy",
});
FinancialRecordSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: Record<string, any>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IFinancialRecordDocument extends mongoose.Document {
  instansiId: string;
  instansi?: any;
  programName: string;
  allocation: number;
  realization: number;
  percentage: number;
  source: FundingSourceType;
  disbursementStage: DisbursementStage;
  history: Array<{
    stage: string;
    amount: number;
    date: string;
    note: string;
  }>;
  lastUpdate: string;
  status: 'Draft' | 'Final';
  orderId?: string;
  paymentStatus?: string;
}

export const FinancialRecordModel: mongoose.Model<IFinancialRecordDocument> = 
  mongoose.models.FinancialRecord || mongoose.model<IFinancialRecordDocument>("FinancialRecord", FinancialRecordSchema);

const KPITargetSchema = new Schema({
  sector: { type: String, enum: ['Sosial', 'Infrastruktur', 'Ekonomi', 'Lingkungan'], required: true },
  indicator: { type: String, required: true },
  unit: { type: String, required: true },
  target: { type: Number, required: true },
  actual: { type: Number, required: true },
  lastUpdate: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

KPITargetSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: Record<string, any>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IKPITargetDocument extends mongoose.Document {
  sector: 'Sosial' | 'Infrastruktur' | 'Ekonomi' | 'Lingkungan';
  indicator: string;
  unit: string;
  target: number;
  actual: number;
  lastUpdate: string;
}

export const KPITargetModel: mongoose.Model<IKPITargetDocument> = 
  mongoose.models.KPITarget || mongoose.model<IKPITargetDocument>("KPITarget", KPITargetSchema);
