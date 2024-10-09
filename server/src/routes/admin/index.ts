import { Router } from "express";
import userRouter from "./users";
import plansRouter from "./plans";
import paymentsRouter from "./payments";
import LogsRouter from "./log";
import AdminsRouter from "./admins";
import TrainersRouter from "./trainers";
import AuthRouter from "./admins/login";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import whatsapp from "./whatsapp";
const router = Router();
router.use("/admins/auth/", AuthRouter);
router.use((req, res, next) => {
  if (!req.isAuthenticated())
    return res.status(HttpStatusCodes.UNAUTHORIZED).sendFailed("UnAuthorized");
  next();
});
router.use("/users", userRouter);
router.use("/plans", plansRouter);
router.use("/payments", paymentsRouter);
router.use("/logs", LogsRouter);
router.use("/admins", AdminsRouter);
router.use("/trainers", TrainersRouter);
router.use("/whatsapp", whatsapp);
export default router;
