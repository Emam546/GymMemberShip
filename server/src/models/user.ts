/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";

const schema = new mongoose.Schema<DataBase.Models.User>(
  {
    age: Number,
    email: String,
    sex: String,
    tall: Number,
    weight: Number,
    name: String,
    phone: String,
    createdAt: Number,
    details: Object,
    createdBy: String,
  },
  { minimize: false }
);
schema.index({ provider_id: 1, provider_type: 1 });
export default mongoose.model("user", schema);
