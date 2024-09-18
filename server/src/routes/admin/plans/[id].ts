import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Plans from "@serv/models/plans";
import Validator from "validator-checker-js";
import Payments from "@serv/models/payments";
import Logs from "@serv/models/log";
import { RouteError } from "@serv/declarations/classes";

const router = Router();
export async function getPlan(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "the plan id is not valid");
  const plan = await Plans.findById(id);
  if (!plan) throw new RouteError(404, "the plan id is not exist");
  return plan;
}
router.use("/:id", async (req, res, next) => {
  res.locals.plan = await getPlan(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.plan);
});
const registerUpdate = new Validator({
  name: ["string"],
  prices: [
    {
      type: ["string", "required"],
      num: ["integer", "required"],
    },
    "object",
  ],
  details: {
    desc: ["string"],
  },
});
router.post("/:id", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const newPlan = await Plans.findByIdAndUpdate(
    plan._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newPlan);
});
router.delete("/:id", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const newPlan = await Plans.findByIdAndDelete(plan._id);
  res.status(200).sendSuccess(newPlan);
});
const registerQuery = new Validator({
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
router.get("/:id/payments", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const { skip, limit } = result.data;
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const payments = await Payments.find({ planId: plan._id })
    .hint({
      planId: 1,
      createdAt: -1,
    })
    .populate("userId")
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  res.status(200).sendSuccess(payments);
});
router.get("/:id/payments/count", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const count = await Payments.countDocuments({ planId: plan._id }).hint({
    planId: 1,
    createdAt: -1,
  });

  res.status(200).sendSuccess(count);
});
router.get("/:id/logs", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const { skip, limit } = result.data;
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const logs = await Logs.find({ planId: plan._id })
    .hint({
      userId: 1,
      createdAt: -1,
    })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  res.status(200).sendSuccess(logs);
});
router.get("/:id/logs/count", async (req, res) => {
  const plan = res.locals.plan as Document<DataBase.Models.Plans>;
  const logs = await Logs.countDocuments({ planId: plan._id }).hint({
    planId: 1,
    createdAt: -1,
  });

  res.status(200).sendSuccess(logs);
});
export default router;
