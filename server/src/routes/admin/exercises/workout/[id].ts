import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
import Workouts from "@serv/models/workout";
const router = Router();
export async function getWorkOut(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The trainer id is not valid");
  const trainer = await Workouts.findById(id);
  if (!trainer) throw new RouteError(404, "The trainer is not found");
  return trainer;
}
router.use("/:id", async (req, res, next) => {
  res.locals.workout = await getWorkOut(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.workout);
});
const registerUpdate = new Validator({
  title: ["string"],
  hide: ["boolean"],
  steps: [
    {
      files: [["string"], "array", ["required"]],
      desc: ["string"],
      title: ["string"],
      _id: ["string"],
    },
    "array",
  ],
});
router.post("/:id", async (req, res) => {
  const workout = res.locals.workout as Document<DataBase.Models.Workouts>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const newExercises = await Workouts.findByIdAndUpdate(
    workout._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newExercises);
});
router.delete("/:id", async (req, res) => {
  const user = res.locals.workout as Document<DataBase.Models.Workouts>;
  const newTrainer = await Workouts.findByIdAndDelete(user._id);
  res.status(200).sendSuccess(newTrainer);
});
export default router;
