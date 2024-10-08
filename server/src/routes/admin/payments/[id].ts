import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Payments from "@serv/models/payments";
import Validator from "validator-checker-js";
import Logs from "@serv/models/log";
import { RouteError } from "@serv/declarations/classes";
const router = Router();
export async function getPayment(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "the plan id is not valid");
  const payment = await Payments.findById(id)
    .populate("userId")
    .populate("planId");
  if (!payment) throw new RouteError(404, "the plan id is not exist");
  return payment;
}
router.use("/:id", async (req, res, next) => {
  res.locals.payment = await getPayment(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.payment);
});
const registerUpdate = new Validator({
  separated: ["boolean"],
  paid: ["integer"],
  plan: {
    type: ["string", { in: ["day", "year", "month"] }, "required"],
    num: ["integer", "required"],
  },
  ".": ["required"],
});
router.post("/:id", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.Payments>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const newPayment = await Payments.findByIdAndUpdate(
    payment._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newPayment);
});
router.delete("/:id", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.Payments>;
  const newPayment = await Payments.findByIdAndDelete(payment._id);
  await Logs.deleteMany({ paymentId: payment._id });
  res.status(200).sendSuccess(newPayment);
});
const registerQuery = new Validator({
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
router.get("/:id/logs", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const { skip, limit } = result.data;
  const payment = res.locals.payment as Document<DataBase.Models.User>;
  const logs = await Logs.find({ paymentId: payment._id })
    .hint({
      userId: 1,
      createdAt: -1,
    })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  res.status(200).sendSuccess(logs);
});
router.post("/:id/logs", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.User> &
    DataBase.Models.Payments;
  const log = new Logs({
    paymentId: payment._id.toString(),
    planId: payment.planId,
    userId: payment.userId,
    adminId: req.user?._id,
    createdBy: "Admin",
  });
  const logSave = await log.save();
  res.status(200).sendSuccess(logSave);
});
router.get("/:id/logs/count", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.User>;
  const logs = await Logs.countDocuments({ paymentId: payment._id }).hint({
    paymentId: 1,
    createdAt: -1,
  });
  res.status(200).sendSuccess(logs);
});
export default router;
