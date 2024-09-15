/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

export interface UserTokenInfo extends Omit<DataBase.Models.Plans, "data"> {
  _id: string;
}
const schema = new mongoose.Schema<DataBase.Models.Plans>(
  {},
  { minimize: false }
);

export default mongoose.model("plans", schema);
