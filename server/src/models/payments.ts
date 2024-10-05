import mongoose from "mongoose";
import User from "./users";
import Plans from "./plans";
import Admins from "./admins";
const schema = new mongoose.Schema<DataBase.Models.Payments>(
  {
    createdAt: { type: Date, default: Date.now, immutable: true },
    startAt: { type: Date, default: Date.now, required: true },
    endAt: { type: Date, default: Date.now, required: true },
    logsCount: { type: Number, default: 0 },
    paid: { type: Number, required: true },
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
    createdBy: String,
    remaining: { type: Number, default: 0, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admins.modelName,
    } as never,
  },
  { minimize: false }
);
schema.index({ userId: 1, createdAt: -1 });
schema.index({ planId: 1, createdAt: -1 });
schema.index({ adminId: 1, createdAt: -1 });
schema.index({ createdAt: -1 });
export default ((mongoose.models && mongoose.models.payments) ||
  mongoose.model(
    "payments",
    schema
  )) as mongoose.Model<DataBase.Models.Payments>;
