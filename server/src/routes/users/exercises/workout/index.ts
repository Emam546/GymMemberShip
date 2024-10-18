import { Router } from "express";
import IdRouter from "./[id]";
import Workouts from "@serv/models/workout";
import { Document, RootFilterQuery } from "mongoose";
const router = Router();
export async function getAllWorkouts(
  match: RootFilterQuery<DataBase.Models.Workouts>
) {
  return await Workouts.find(match);
}
router.get("/", (req, res) => {
  const exercise = res.locals.exercise as Document<
    DataBase.Models.Exercises,
    DataBase.Models.Exercises,
    DataBase.Models.Exercises
  >;
  res.status(200).sendSuccess(exercise.toObject().workoutIds);
});
router.use(IdRouter);
export default router;
