import { Router } from "express";
import Plans from "@serv/models/plans";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
const router = Router();
const registerValidator = new Validator({
  name: ["string"],
  prices: [
    {
      type: ["string", "required"],
      num: ["integer", "required"],
    },
    "object",
    {
      ".": ["required"],
    },
  ],
  details: {
    desc: ["string"],
    ".": ["required"],
  },
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).json({
      success: false,
      msg: "invalid Data",
      err: result.errors,
    });
  result.data;
  const plan = new Plans({
    createdAt: Date.now(),
    ...result.data,
  } as DataBase.Models.Plans);
  const SavedPlan = await plan.save();
  res.status(200).sendSuccess(SavedPlan);
});
router.get("/", async (req, res) => {
  const plans = await Plans.find({});
  res.status(200).sendSuccess(plans);
});
router.use(IdRouter);
export default router;
