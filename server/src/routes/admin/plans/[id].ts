import { Router, Response } from "express";
import mongoose, { Document } from "mongoose";
import Plans from "@serv/models/plans";
import Validator from "validator-checker-js";
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
    return res.status(400).json({
      success: false,
      msg: "invalid Data",
      err: result.errors,
    });
  const newPlan = await Plans.findOneAndUpdate(
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
  const result = registerUpdate.passes(req.query);
  if (!result.state)
    return res.status(400).json({
      success: false,
      msg: "invalid Data",
      err: result.errors,
    });
  const newPlan = await Plans.findByIdAndDelete(plan._id);
  res.status(200).sendSuccess(newPlan);
});
export default router;
