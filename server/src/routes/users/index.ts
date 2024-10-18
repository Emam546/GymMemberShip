import { Router } from "express";
import exercises from "./exercises";
import workoutIdRouter from "./exercises/workout";
const router = Router();
router.use("/exercises", exercises);
router.use("/workouts", workoutIdRouter);

// router.use("/plans", plansRouter);
// router.use("/subscriptions", paymentsRouter);
// router.use("/logs", LogsRouter);
// router.use("/trainers", TrainersRouter);

export default router;
