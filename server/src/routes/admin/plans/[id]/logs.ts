import { Router } from "express";
import { getLogsCount, getLogs } from "@serv/routes/admin/log";
import { Document } from "mongoose";
const router = Router();

router.get("/logs", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const logs = await getLogs(
    req.query,
    { planId: plan._id },
    { planId: 1, createdAt: -1 },
    ["userId", "paymentId", "adminId"]
  );
  res.status(200).sendSuccess(logs);
});
router.get("/logCount", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const payments = await getLogsCount(
    req.query,
    { planId: plan._id },
    { planId: 1, createdAt: -1 }
  );
  res.status(200).sendSuccess(payments);
});
export default router;
