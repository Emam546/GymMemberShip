import { Router } from "express";
import IdRouter from "./[id]";
import { getAllExercises } from "@serv/routes/admin/exercises";
const router = Router();

router.get("/", async (req, res) => {
  const results = await getAllExercises();
  res.status(200).sendSuccess(results);
});
router.use(IdRouter);
export default router;
