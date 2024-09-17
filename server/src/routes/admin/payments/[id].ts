import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Payments from "@serv/models/payments";
import Validator from "validator-checker-js";
import Logs from "@serv/models/log";
const router = Router();

router.use("/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).SendFailed("The payment is not valid");
  const payment = await Payments.findById(req.params.id);
  if (!payment) return res.status(404).SendFailed("The payment is not found");
  res.locals.payment = payment;
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.payment);
});
const registerUpdate = new Validator({
  separated: ["boolean"],
  paid: {
    type: ["string", "required"],
    num: ["integer", "required"],
  },
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
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await Logs.find({ userId: user._id })
    .hint({
      userId: 1,
      createdAt: -1,
    })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  res.status(200).sendSuccess(logs);
});
export default router;
