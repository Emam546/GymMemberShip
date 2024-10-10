/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose, { CallbackError } from "mongoose";
import Admins from "./admins";
import Counter from "./counter";
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
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admins.modelName,
    } as never,
    barcode: { unique: true, type: Number },
    provider_type: String,
    providerId: String,
  },
  { minimize: false }
);
// Pre-save hook to auto-increment userNumber
schema.pre("save", async function (next) {
  if (!this.isNew && this.barcode != undefined) {
    return next(); // Only generate a number for new users
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "user" }, // Assuming you have a single counter for users
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Create if it doesn't exist
    );

    this.barcode = counter.seq;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});
schema.index({ barcode: 1 });
schema.index({ createdAt: -1 });
schema.index({ adminId: 1, createdAt: -1 });
schema.index({ provider_id: 1, provider_type: 1 });
export default ((mongoose.models && mongoose.models.user) ||
  mongoose.model("user", schema)) as mongoose.Model<DataBase.Models.User>;
