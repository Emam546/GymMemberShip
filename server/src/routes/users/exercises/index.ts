import { Router } from "express";
import IdRouter from "./[id]";
import { getAllExercises } from "@serv/routes/admin/exercises";
const router = Router();

router.get("/", async (req, res) => {
  const results = await getAllExercises();

  res.status(200).sendSuccess(
    (
      results as unknown as DataBase.Populate.ModelArray<
        DataBase.Models.Exercises,
        "workoutIds"
      >[]
    ).map((val) => {
      val.workoutIds = val.workoutIds.filter((val) => !val?.hide);
      return val;
    })
  );
});
router.use(IdRouter);
export default router;
