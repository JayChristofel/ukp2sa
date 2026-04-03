import mongoose, { Schema } from "mongoose";

const AlignmentSchema = new Schema({
  location: { type: String, required: true },
  isOverlapping: { type: Boolean, default: false },
  conflictDetails: { type: String },
  programs: [{
    source: String,
    name: String,
    budget: Number,
    status: String
  }]
}, { timestamps: true });

AlignmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IAlignmentDocument extends mongoose.Document {
  location: string;
  isOverlapping: boolean;
  conflictDetails?: string;
  programs: Array<{
    source: string;
    name: string;
    budget: number;
    status: string;
  }>;
}

export const AlignmentModel: mongoose.Model<IAlignmentDocument> = 
  mongoose.models.Alignment || mongoose.model<IAlignmentDocument>("Alignment", AlignmentSchema);
