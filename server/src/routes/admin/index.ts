import { Router } from "express";
import userRouter from "./user";
import plansRouter from "./plans";
import paymentsRouter from "./payments";
const router = Router();

router.use("/user", userRouter);
router.use("/plans", plansRouter);
router.use("/payments", paymentsRouter);
export default router;
