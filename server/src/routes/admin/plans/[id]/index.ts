import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Plans from "@serv/models/plans";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
import logsRouter from "./logs";
import paymentsRouter from "./payments";
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
  prices: [["integer"], "object"],
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

router.use("/:id", logsRouter);
router.use("/:id", paymentsRouter);
export default router;
