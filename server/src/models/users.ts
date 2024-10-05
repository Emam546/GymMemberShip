/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
import Admins from "./admins";
const schema = new mongoose.Schema<DataBase.Models.User>(
  {
    age: Number,
    email: String,
    sex: String,
    tall: Number,
    weight: Number,
    name: String,
    phone: String,
    details: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
    blocked: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    createdBy: String,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admins.modelName,
    } as never,
    provider_type: String,
    providerId: String,
  },
  { minimize: false }
);
schema.index({ createdAt: -1 });
schema.index({ adminId: 1, createdAt: -1 });
schema.index({ provider_id: 1, provider_type: 1 });
export default ((mongoose.models && mongoose.models.user) ||
  mongoose.model("user", schema)) as mongoose.Model<DataBase.Models.User>;
