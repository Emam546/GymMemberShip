/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
import Admins from "./admins";
const schema = new mongoose.Schema<DataBase.Models.Plans>(
  {
    createdAt: { type: Date, default: Date.now, immutable: true },
    details: { type: Object, required: true },
    name: String,
    prices: { type: Object, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admins.modelName,
      required: true,
    } as never,
  },
  { minimize: false }
);
schema.index({ createdAt: -1 });
export default ((mongoose.models && mongoose.models.plans) ||
  mongoose.model("plans", schema)) as mongoose.Model<DataBase.Models.Plans>;
