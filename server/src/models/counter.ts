import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export default ((mongoose.models && mongoose.models.counter) ||
  mongoose.model(
    "counter",
    counterSchema
  )) as mongoose.Model<DataBase.Models.Counter>;
