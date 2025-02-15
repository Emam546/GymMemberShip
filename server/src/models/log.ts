/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
import User from "./users";
import Plans from "./plans";
import Payment from "./subscriptions";
import Admins from "./admins";
import Trainers from "./trainers";
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
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Trainers.modelName,
    } as never,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admins.modelName,
    } as never,
  },
  { minimize: false }
);
schema.index({ createdAt: -1 });
schema.index({ userId: 1, createdAt: -1 });
schema.index({ planId: 1, createdAt: -1 });
schema.index({ paymentId: 1, createdAt: -1 });
schema.index({ trainerId: 1, createdAt: -1 });
schema.index({ adminId: 1, createdAt: -1 });
export default ((mongoose.models && mongoose.models.logs) ||
  mongoose.model("logs", schema)) as mongoose.Model<DataBase.Models.Logs>;
