import { Router } from "express";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
import Exercises from "@serv/models/exercise";
const router = Router();
const registerValidator = new Validator({
  title: ["string", "required"],
  order: ["integer"],
  ".": ["required"],
});
router.post("/", async (req, res) => {
  const result = await registerValidator.asyncPasses(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const exercises = new Exercises({
    ...result.data,
  } as DataBase.Models.Exercises);
  const savedUser = await exercises.save();
  res.status(200).sendSuccess(savedUser);
});
export async function getAllExercises() {
  return await Exercises.find({}).hint({ order: 1 }).populate("workoutIds");
}
router.get("/", async (req, res) => {
  const results = await getAllExercises();
  res.status(200).sendSuccess(results);
});
router.use(IdRouter);
export default router;
