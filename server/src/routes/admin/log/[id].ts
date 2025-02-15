import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Logs from "@serv/models/log";
import { IncrementPaymentLogs } from "@serv/routes/admin/subscriptions/[id]/logs";
const router = Router();

router.use("/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).sendFailed("The log is not valid");
  const log = await Logs.findById(req.params.id)
    .populate("adminId")
    .populate("userId");
  if (!log) return res.status(404).sendFailed("The log is not found");
  res.locals.log = log;
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.log);
});
router.delete("/:id", async (req, res) => {
  const log = res.locals.log as Document<
    DataBase.Models.Logs,
    DataBase.Models.Logs,
    DataBase.Models.Logs
  >;
  await IncrementPaymentLogs(log.toObject().paymentId, -1);
  await Logs.findByIdAndDelete(log._id);
  res.status(200).sendSuccess(null);
});
export default router;
