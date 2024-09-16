/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
const schema = new mongoose.Schema<DataBase.Models.Transaction>(
  {},
  { minimize: false }
);
schema.index({ userId: 1, createdAt: 1 });
schema.index({ planId: 1, createdAt: 1 });
export default mongoose.model("transaction", schema);
