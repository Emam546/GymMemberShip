import { Router } from "express";
import {
  getSubscriptions,
  getSubscriptionsProfit,
} from "@serv/routes/admin/subscriptions";
import { Document } from "mongoose";
import { getAggregateOptions } from "@serv/routes/admin/subscriptions/query";
import Payments from "@serv/models/subscriptions";
const router = Router();

router.get("/", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const logs = await getSubscriptions(
    req.query,
    { planId: plan._id },
    { planId: 1, createdAt: -1 },
    ["userId", "adminId", "trainerId"]
  );
  res.status(200).sendSuccess(logs);
});
router.get("/query", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const aggregate = getAggregateOptions(req.query, { planId: plan._id });
  const queryRes = await Payments.aggregate(aggregate);
  return res.status(200).sendSuccess(queryRes);
});
router.get("/profit", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const payments = await getSubscriptionsProfit(
    req.query,
    { planId: plan._id },
    { planId: 1, createdAt: -1 }
  );
  res.status(200).sendSuccess(payments);
});
export default router;
