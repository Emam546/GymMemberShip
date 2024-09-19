/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose, { Model } from "mongoose";
import User from "./users";
import Plans from "./plans";
import Payment from "./payments";
const schema = new mongoose.Schema<DataBase.Models.Logs>(
  {
    createdAt: { type: Date, default: Date.now, immutable: true },
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
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Payment.modelName,
      required: true,
    } as never,
    createdBy: { type: Object, required: true },
  },
  { minimize: false }
);
schema.index({ userId: 1, createdAt: -1 });
schema.index({ planId: 1, createdAt: -1 });
schema.index({ paymentId: 1, createdAt: -1 });
export default ((mongoose.models && mongoose.models.logs) ||
  mongoose.model("logs", schema)) as mongoose.Model<DataBase.Models.Logs>;
