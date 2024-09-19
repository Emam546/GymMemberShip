import { Router } from "express";
import userRouter from "./users";
import plansRouter from "./plans";
import paymentsRouter from "./payments";
import LogsRouter from "./log";
const router = Router();

router.use("/users", userRouter);
router.use("/plans", plansRouter);
router.use("/payments", paymentsRouter);
router.use("/logs", LogsRouter);
export default router;
