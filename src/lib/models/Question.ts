import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionOption {
  key: string;
  label: {
    id: string;
    en: string;
  };
}

export interface IQuestion extends Document {
  id: number;
  topicId: number;
  parentId: number | null;
  question: {
    id: string;
    en: string;
  };
  questionType: 'long_text' | 'single_choice' | 'boolean' | 'short_text';
  options?: IQuestionOption[];
  required?: boolean;
}

const QuestionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  topicId: { type: Number, required: true },
  parentId: { type: Number, default: null },
  question: {
    id: { type: String, required: true },
    en: { type: String, required: true }
  },
  questionType: { 
    type: String, 
    required: true,
    enum: ['long_text', 'single_choice', 'boolean', 'short_text']
  },
  options: [{
    key: String,
    label: {
      id: String,
      en: String
    }
  }],
  required: { type: Boolean, default: false }
}, { timestamps: true });

export const QuestionModel = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
