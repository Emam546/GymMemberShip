/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from "express";
import { Document } from "mongoose";
import { getLogs, getLogsCount } from "@serv/routes/admin/log";
const router = Router();

router.get("/logs", async (req, res) => {
  const user = res.locals.trainer as Document<DataBase.Models.Trainers>;
  const logs = await getLogs(
    req.query,
    { trainerId: user._id },
    { trainerId: 1, createdAt: -1 },
    ["userId", "planId", "paymentId", "adminId"]
  );
  res.status(200).sendSuccess(logs);
});
router.get("/logs/count", async (req, res) => {
  const user = res.locals.trainer as Document<DataBase.Models.Trainers>;
  const logs = await getLogsCount(
    req.query,
    { trainerId: user._id },
    { trainerId: 1, createdAt: -1 }
  );
  res.status(200).sendSuccess(logs);
});
export default router;
