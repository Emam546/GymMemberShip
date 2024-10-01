/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

const schema = new mongoose.Schema<DataBase.Models.Admins>({
  name: String,
  password: String,
  type: String,
});
export default ((mongoose.models && mongoose.models.admins) ||
  mongoose.model("admins", schema)) as mongoose.Model<DataBase.Models.Admins>;
