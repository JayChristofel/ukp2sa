import mongoose, { Schema } from "mongoose";

const DashboardMetricSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  lastUpdate: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

DashboardMetricSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, unknown>) {
    if (ret._id) {
      ret.id = String(ret._id);
    }
    delete ret._id;
  }
});

export interface IDashboardMetric extends mongoose.Document {
  key: string;
  value: any;
  lastUpdate: string;
}

export const DashboardMetricModel: mongoose.Model<IDashboardMetric> = 
  mongoose.models.DashboardMetric || mongoose.model<IDashboardMetric>("DashboardMetric", DashboardMetricSchema);
