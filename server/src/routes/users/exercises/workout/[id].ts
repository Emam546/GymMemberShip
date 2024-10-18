import { Router } from "express";
import { getWorkOut } from "@serv/routes/admin/exercises/workout/[id]";
import { RouteError } from "@serv/declarations/classes";
const router = Router();

router.use("/:id", async (req, res, next) => {
  const workout = await getWorkOut(req.params.id);
  if (workout.hide) throw new RouteError(404, "the workout is not visible");
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.workout);
});

export default router;
