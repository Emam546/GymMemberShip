import { Router } from "express";
import { Document } from "mongoose";
import Logs from "@serv/models/log";
import { getLogs } from "@serv/routes/admin/log";
const router = Router();

router.get("/logs", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await getLogs(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 },
    ["planId", "paymentId", "adminId"]
  );
  res.status(200).sendSuccess(logs);
});
router.get("/logs/LogCount", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await Logs.countDocuments({ userId: user._id }).hint({
    userId: 1,
    createdAt: -1,
  });
  res.status(200).sendSuccess(logs);
});
export default router;
