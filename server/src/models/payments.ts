import mongoose, { Model } from "mongoose";
import User from "./user";
import Plans from "./plans";
const schema = new mongoose.Schema<DataBase.Models.Payments>(
  {
    createdAt: { type: Date, default: Date.now, immutable: true },
    paid: { type: Object, required: true },
    separated: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    } as never,
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Plans.modelName,
      required: true,
    } as never,
    plan: { type: Object, required: true },
    createdBy: { type: Object },
  },
  { minimize: false }
);
schema.index({ userId: 1, createdAt: -1 });
schema.index({ planId: 1, createdAt: -1 });
schema.index({ createdAt: -1 });
export default ((mongoose.models && mongoose.models.payments) ||
  mongoose.model(
    "payments",
    schema
  )) as mongoose.Model<DataBase.Models.Payments>;
