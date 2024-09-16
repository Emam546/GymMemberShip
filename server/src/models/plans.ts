/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

const schema = new mongoose.Schema<DataBase.Models.Plans>(
  {
    createdAt: { type: Date, default: Date.now, immutable: true },
    details: { type: Object, required: true },
    name: String,
    prices: { type: Object, required: true },
  },
  { minimize: false }
);

export default mongoose.model("plans", schema);
