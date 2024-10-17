import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
import Exercises from "@serv/models/exercise";
import Workout from "@serv/models/workout";
import WorkOutRouter from "./workout";
const router = Router();
export async function getExercise(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The trainer id is not valid");
  const trainer = await Exercises.findById(id).populate("workoutIds");
  if (!trainer) throw new RouteError(404, "The trainer is not found");
  return trainer;
}
router.use("/:id", async (req, res, next) => {
  res.locals.exercise = await getExercise(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.exercise);
});
router.post("/:id", async (req, res) => {
  const registerUpdate = new Validator({
    title: ["string"],
    order: ["integer"],
    workoutIds: [
      [{ existedId: { path: Workout.modelName } }, "string"],
      "array",
    ],
  });
  const exercise = res.locals.exercise as Document<DataBase.Models.Exercises>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);

  const newExercises = await Exercises.findByIdAndUpdate(
    exercise._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newExercises);
});
router.delete("/:id", async (req, res) => {
  const user = res.locals.exercise as Document<DataBase.Models.Exercises>;
  const newTrainer = await Exercises.findByIdAndDelete(user._id);
  res.status(200).sendSuccess(newTrainer);
});
router.use("/:id/workouts", WorkOutRouter);
export default router;
