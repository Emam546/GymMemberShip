/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
const schema = new mongoose.Schema<DataBase.Models.User>(
  {
    name: String,
    email: String,
    phone: String,
  },
  { minimize: false }
);
export default ((mongoose.models && mongoose.models.trainers) ||
  mongoose.model("trainers", schema)) as mongoose.Model<DataBase.Models.User>;
