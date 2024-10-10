import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Payments from "@serv/models/subscriptions";
import Validator from "validator-checker-js";
import Trainers from "@serv/models/trainers";
import Logs from "@serv/models/log";
import { RouteError } from "@serv/declarations/classes";
import LogsRouter from "./logs";
const router = Router();
export async function getPayment(
  id: string,
  populate: (keyof DataBase.Models.Subscriptions)[] = [
    "adminId",
    "userId",
    "planId",
    "trainerId",
  ]
) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "the plan id is not valid");
  const query = Payments.findById(id);
  const payment = await populate.reduce<typeof query>(
    (acc, key) => acc.populate(key),
    query
  );

  if (!payment) throw new RouteError(404, "the plan id is not exist");
  return payment;
}
router.use("/:id", async (req, res, next) => {
  res.locals.payment = await getPayment(req.params.id, []);
  next();
});
router.get("/:id", async (req, res) => {
  res.status(200).sendSuccess(await getPayment(req.params.id));
});
const registerUpdate = new Validator({
  startAt: ["isDate"],
  endAt: ["isDate"],
  paid: ["integer"],
  trainerId: [{ existedId: { path: Trainers.modelName } }],
  plan: {
    type: ["string", { in: ["day", "year", "month"] }, "required"],
    num: ["integer", "required"],
  },
  remaining: ["integer"],

  ".": ["required"],
});
router.post("/:id", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.Subscriptions>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
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
  const payment = res.locals.payment as Document<DataBase.Models.Subscriptions>;
  const newPayment = await Payments.findByIdAndDelete(payment._id);
  await Logs.deleteMany({ paymentId: payment._id });
  res.status(200).sendSuccess(newPayment);
});
router.use("/:id/logs", LogsRouter);

export default router;
