/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

export interface UserTokenInfo extends Omit<DataBase.Models.User, "data"> {
  _id: string;
}
const schema = new mongoose.Schema<DataBase.Models.User>(
  {
    age: Number,
    email: String,
    sex: String,
    tall: Number,
    weight: Number,
    name: String,
    phone: String,
    signedIn: Number,
    details: Object,
    signedInBy: String,
  },
  { minimize: false }
);
schema.index({ provider_id: 1, provider_type: 1 });
export default mongoose.model("user", schema);
