import { Router } from "express";
import {
  getSubscriptions,
  getSubscriptionsProfit,
} from "@serv/routes/admin/subscriptions";
import { Document } from "mongoose";
const router = Router();

router.get("/", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Plans>;
  const logs = await getSubscriptions(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 },
    ["planId", "adminId", "trainerId"],
    { endAt: -1 }
  );
  res.status(200).sendSuccess(logs);
});
router.get("/profit", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Plans>;
  const payments = await getSubscriptionsProfit(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 }
  );
  res.status(200).sendSuccess(payments);
});
export default router;
