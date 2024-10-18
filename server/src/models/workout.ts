/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
const schema = new mongoose.Schema<DataBase.Models.Workouts>(
  {
    title: { type: String, required: true },
    steps: [
      {
        files: { type: [{ type: String }], required: true },
        desc: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
    hide: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);
export default ((mongoose.models && mongoose.models.workouts) ||
  mongoose.model(
    "workouts",
    schema
  )) as mongoose.Model<DataBase.Models.Workouts>;
