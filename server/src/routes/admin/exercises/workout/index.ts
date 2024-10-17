import { Router } from "express";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
import Workouts from "@serv/models/workout";
import { Document, RootFilterQuery } from "mongoose";
const router = Router();
const registerValidator = new Validator({
  title: ["string", "required"],
  hide: ["boolean"],
  steps: [
    {
      files: [["string"], "array", ["required"]],
      desc: ["string"],
    },
    "array",
    ["required"],
  ],
  ".": ["required"],
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const exercises = new Workouts({
    ...result.data,
  } as DataBase.Models.Workouts);
  const savedUser = await exercises.save();
  res.status(200).sendSuccess(savedUser);
});
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
