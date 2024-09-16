/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

const schema = new mongoose.Schema<DataBase.Models.Plans>(
  {
    createdAt: Number,
    details: Object,
    name: String,
    prices: Object,
  },
  { minimize: false }
);

export default mongoose.model("plans", schema);
