import { Router } from "express";
import "@serv/validator/database";
import Validator from "validator-checker-js";
import Users from "@serv/models/user";
import Plans from "@serv/models/plans";
import Payments from "@serv/models/payments";
import Logs from "@serv/models/log";
import IdRouter from "./[id]";
const router = Router();
const registerValidator = new Validator({
  planId: ["required", { existedId: { path: Plans.modelName } }],
  userId: ["required", { existedId: { path: Users.modelName } }],
  paymentId: ["required", { existedId: { path: Payments.modelName } }],
});
router.post("/", async (req, res) => {
  const result = await registerValidator.asyncPasses(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);

  const log = new Logs({
    ...result.data,
    createdBy: { type: "Admin" },
  } as DataBase.Models.Logs);
  const logSave = await log.save();
  res.status(200).sendSuccess(logSave);
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
  const logs = await Logs.find({})
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);
  res.status(200).sendSuccess(logs);
});
router.use(IdRouter);
export default router;
