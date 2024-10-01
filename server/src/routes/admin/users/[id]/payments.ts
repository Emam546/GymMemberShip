import { Router } from "express";
import { getPayments, getPaymentsProfit } from "@serv/routes/admin/payments";
import { Document } from "mongoose";
const router = Router();

router.get("/payments", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Plans>;
  const logs = await getPayments(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 },
    ["planId", "adminId"]
  );
  res.status(200).sendSuccess(logs);
});
router.get("/payments/profit", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Plans>;
  const payments = await getPaymentsProfit(
    req.query,
    { userId: user._id },
    { userId: 1, createdAt: -1 }
  );
  res.status(200).sendSuccess(payments);
});
export default router;
