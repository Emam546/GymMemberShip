import { Router } from "express";
import { getWorkOut } from "@serv/routes/admin/exercises/workout/[id]";
const router = Router();

router.use("/:id", async (req, res, next) => {
  res.locals.workout = await getWorkOut(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.workout);
});

export default router;
