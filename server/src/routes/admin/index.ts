import { Router } from "express";
import userRouter from "./user";
import plansRouter from "./plans";

const router = Router();

router.use("/user", userRouter);
router.use("/plans", plansRouter);
export default router;
