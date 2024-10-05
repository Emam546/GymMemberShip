import { Router } from "express";
import { Document } from "mongoose";
import Logs from "@serv/models/log";
import { getLogs, getLogsCount } from "@serv/routes/admin/log";
const router = Router();

router.get("/logs", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await getLogs(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 },
    ["planId", "paymentId", "adminId", "trainerId"]
  );
  res.status(200).sendSuccess(logs);
});
router.get("/logs/count", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await getLogsCount(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 }
  );
  res.status(200).sendSuccess(logs);
});
export default router;
