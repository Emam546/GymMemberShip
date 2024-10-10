import mongoose from "mongoose";
import User from "./users";
import Admins from "./admins";
const schema = new mongoose.Schema<DataBase.Models.Payments>(
  {
    createdAt: { type: Date, default: Date.now, immutable: true },
    paid: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
    } as never,
    remaining: { type: Number, default: 0, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admins.modelName,
    } as never,
  },
  { minimize: false }
);
schema.index({ __t: 1 });
schema.index({ adminId: 1, createdAt: -1, __t: 1 });
schema.index({ userId: 1, createdAt: -1, __t: 1 });
schema.index({ createdAt: -1, __t: 1 });

export default ((mongoose.models && mongoose.models.payments) ||
  mongoose.model(
    "payments",
    schema
  )) as mongoose.Model<DataBase.Models.Payments>;
