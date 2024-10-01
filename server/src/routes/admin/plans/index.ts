import { Router } from "express";
import Plans from "@serv/models/plans";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
const router = Router();
const registerValidator = new Validator({
  name: ["string"],
  prices: [
    ["integer"],
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
    return res.status(400).SendFailed("invalid Data", result.errors);
  const plan = new Plans({
    adminId: req.user?._id,
    ...result.data,
  });
  const SavedPlan = await plan.save();
  res.status(200).sendSuccess(SavedPlan);
});
export async function getAllPlans() {
  return await Plans.find({}).populate("adminId");
}
router.get("/", async (req, res) => {
  const plans = await getAllPlans();
  res.status(200).sendSuccess(plans);
});

router.use(IdRouter);
export default router;
