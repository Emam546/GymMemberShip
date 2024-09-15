/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

export interface UserTokenInfo
  extends Omit<DataBase.Models.Transaction, "data"> {
  _id: string;
}
const schema = new mongoose.Schema<DataBase.Models.Transaction>(
  {},
  { minimize: false }
);
schema.index({ userId: 1 });
schema.index({ planId: 1 });
export default mongoose.model("transaction", schema);
