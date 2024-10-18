import { Router } from "express";
import IdRouter from "./[id]";
import { Document } from "mongoose";
const router = Router();

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
