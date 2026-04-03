import mongoose, { Schema, Document } from "mongoose";

export interface ITopic extends Document {
  id: number;
  name: {
    id: string;
    en: string;
  };
  count?: number;
}

const TopicSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: {
    id: { type: String, required: true },
    en: { type: String, required: true }
  },
  count: { type: Number, default: 0 }
}, { timestamps: true });

export const TopicModel = mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
