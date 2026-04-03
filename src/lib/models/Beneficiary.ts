import mongoose, { Schema } from "mongoose";

const BeneficiarySchema = new Schema({
  nik: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  regency: { type: String, required: true },
  timeline: [{
    stage: { type: String, enum: ["Tenda", "Huntara", "Huntap"] },
    date: String,
    location: String,
    status: { type: String, enum: ["Completed", "In Progress", "Pending"] },
    note: String
  }]
}, { timestamps: true });

BeneficiarySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IBeneficiaryDocument extends mongoose.Document {
  nik: string;
  name: string;
  regency: string;
  timeline: Array<{
    stage: "Tenda" | "Huntara" | "Huntap";
    date: string;
    location: string;
    status: "Completed" | "In Progress" | "Pending";
    note?: string;
  }>;
}

export const BeneficiaryModel: mongoose.Model<IBeneficiaryDocument> = 
  mongoose.models.Beneficiary || mongoose.model<IBeneficiaryDocument>("Beneficiary", BeneficiarySchema);
