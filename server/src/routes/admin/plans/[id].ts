import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Plans from "@serv/models/plans";
import Validator from "validator-checker-js";
import Payments from "@serv/models/payments";
import Logs from "@serv/models/log";

const router = Router();

router.use("/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).SendFailed("The plan is not valid");
  const plan = await Plans.findById(req.params.id);
  if (!plan) return res.status(404).SendFailed("The plan is not found");
  res.locals.plan = plan;
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
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  res.status(200).sendSuccess(payments);
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
