import { Router } from "express";
import IdRouter from "./[id]";
import { Document } from "mongoose";
const router = Router();

router.get("/", (req, res) => {
  const exercise = res.locals.exercise as Document<
    DataBase.Populate.ModelArray<DataBase.Models.Exercises, "workoutIds">,
    DataBase.Populate.ModelArray<DataBase.Models.Exercises, "workoutIds">,
    DataBase.Populate.ModelArray<DataBase.Models.Exercises, "workoutIds">
  >;
  res
    .status(200)
    .sendSuccess(exercise.toObject().workoutIds.filter((val) => !val?.hide));
});
router.use(IdRouter);
export default router;
