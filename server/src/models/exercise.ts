/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose from "mongoose";
import Workouts from "./workout";
const schema = new mongoose.Schema<DataBase.Models.Exercises>(
  {
    title: { type: String, required: true },
    workoutIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Workouts.modelName,
        required: true,
      } as never,
    ],
    order: { type: Number, default: Date.now },
  },
  { minimize: false }
);
schema.index({ order: 1 });
export default ((mongoose.models && mongoose.models.exercises) ||
  mongoose.model(
    "exercises",
    schema
  )) as mongoose.Model<DataBase.Models.Exercises>;
