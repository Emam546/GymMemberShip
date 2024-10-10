import mongoose from "mongoose";
import User from "./users";
import Plans from "./plans";
import Trainers from "./trainers";
import Payments from "./payments";
const schema = new mongoose.Schema<DataBase.Models.Subscriptions>(
  {
    startAt: { type: Date, default: Date.now, required: true },
    endAt: { type: Date, default: Date.now, required: true },
    logsCount: { type: Number, default: 0 },
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
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Trainers.modelName,
    } as never,
    plan: { type: Object, required: true },
  },
  { minimize: false }
);

schema.index({ planId: 1, createdAt: -1, __t: 1 });
schema.index({ trainerId: 1, createdAt: -1, __t: 1 });

export default ((mongoose.models && mongoose.models.subscriptions) ||
  Payments.discriminator(
    "subscriptions",
    schema
  )) as mongoose.Model<DataBase.Models.Subscriptions>;
