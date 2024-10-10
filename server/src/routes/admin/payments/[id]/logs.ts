import { Document } from "mongoose";
import Payments from "@serv/models/payments";
import Trainers from "@serv/models/trainers";
import Validator from "validator-checker-js";
import Logs from "@serv/models/log";
import { getLogs } from "@serv/routes/admin/log";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.User>;
  const logs = await getLogs(
    req.query,
    { paymentId: payment._id },
    {
      paymentId: 1,
      createdAt: -1,
    },
    ["adminId", "trainerId"]
  );

  res.status(200).sendSuccess(logs);
});
export async function IncrementPaymentLogs(id: string, dir: number) {
  return await Payments.findByIdAndUpdate(
    id,
    {
      $inc: { logsCount: dir },
    },
    { new: true }
  );
}
const registerValidator = new Validator({
  trainerId: [{ existedId: { path: Trainers.modelName } }],
});
router.post("/", async (req, res) => {
  const payment = res.locals.payment as Document<
    DataBase.Models.Payments,
    DataBase.Models.Payments,
    DataBase.Models.Payments
  >;
  const result = await registerValidator.asyncPasses(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const log = new Logs({
    paymentId: payment._id.toString(),
    planId: payment.toObject().planId,
    userId: payment.toObject().userId,
    adminId: req.user?._id,
    createdBy: "Admin",
    ...result.data,
  });
  const newPayment = await IncrementPaymentLogs(
    payment._id as unknown as string,
    1
  );
  const logSave = await log.save();
  res.status(200).sendSuccess({ log: logSave, count: newPayment });
});
router.get("/count", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.User>;
  const logs = await Logs.countDocuments({ paymentId: payment._id }).hint({
    paymentId: 1,
    createdAt: -1,
  });
  res.status(200).sendSuccess(logs);
});
export default router;
