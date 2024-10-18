import { Router } from "express";
import WorkOutRouter from "./workout";
import { getExercise } from "@serv/routes/admin/exercises/[id]";
const router = Router();

router.use("/:id", async (req, res, next) => {
  const exercise = (await getExercise(
    req.params.id
  )) as unknown as DataBase.Populate.ModelArray<
    DataBase.Models.Exercises,
    "workoutIds"
  >;
  exercise.workoutIds = exercise.workoutIds.filter((val) => !val?.hide);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.exercise);
});

router.use("/:id/workouts", WorkOutRouter);
export default router;
