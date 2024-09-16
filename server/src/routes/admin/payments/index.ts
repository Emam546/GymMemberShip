import { Router } from "express";
import "@serv/validator/database";
import Payments from "@serv/models/payments";
import Validator from "validator-checker-js";
import Users from "@serv/models/user";
import Plans from "@serv/models/plans";
// import IdRouter from "./[id]";
const router = Router();
const registerValidator = new Validator({
  planId: ["required", { existedId: { path: Plans.modelName } }],
  userId: ["required", { existedId: { path: Users.modelName } }],
  separated: ["boolean", "required"],
  paid: {
    type: ["string", "required"],
    num: ["integer", "required"],
    ".": ["required"],
  },
  plan: {
    type: ["string", { in: ["day", "year", "month"] }, "required"],
    num: ["integer", "required"],
    ".": ["required"],
  },
  ".": ["required"],
});
router.post("/", async (req, res) => {
  const result = await registerValidator.asyncPasses(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);

  const plan = new Payments({
    ...result.data,
    createdBy: { type: "Admin" },
  } as DataBase.Models.Payments);
  const Payment = await plan.save();
  res.status(200).sendSuccess(Payment);
});
const registerQuery = new Validator({
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
router.get("/", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const { skip, limit } = result.data;
  const payments = await Payments.find({})
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);
  res.status(200).sendSuccess(payments);
});
// router.use(IdRouter);
export default router;
