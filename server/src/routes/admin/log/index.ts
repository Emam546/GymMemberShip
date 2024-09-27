/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Router } from "express";
import "@serv/validator/database";
import Validator from "validator-checker-js";
import Users from "@serv/models/users";
import Plans from "@serv/models/plans";
import Payments from "@serv/models/payments";
import Logs from "@serv/models/log";
import IdRouter from "./[id]";
import { RouteErrorHasError } from "@serv/declarations/classes";
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
  startAt: ["numeric"],
  endAt: ["numeric"],
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
export async function getLogs(query: unknown) {
  const result = registerQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  const { skip, limit, startAt, endAt } = result.data;
  const matchQuery: Record<string, unknown> = {};
  if (startAt || endAt) {
    matchQuery["createdAt"] = {
      $lte: parseInt(endAt as string) || Infinity,
      $gte: parseInt(startAt as string) || 0,
    };
  }

  const payments = await Logs.find(matchQuery)
    .hint({ createdAt: -1 })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity)
    .populate("userId")
    .populate("planId")
    .populate("paymentId");
  return payments;
}
router.get("/", async (req, res) => {
  const payments = await getLogs(req.query);
  res.status(200).sendSuccess(payments);
});
const registerProfitQuery = new Validator({
  startAt: ["numeric"],
  endAt: ["numeric"],
  year: ["accepted"],
  month: ["accepted"],
  day: ["accepted"],
});
export async function getLogsCount(query: unknown) {
  const result = registerProfitQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalidData", result.errors);
  const matchQuery: {
    createdAt?: {
      $gte?: unknown;
      $lte?: unknown;
    };
  } = {};
  const ID: Record<string, unknown> = {
    currency: "$paid.type",
  };
  if (result.data?.startAt || result.data?.endAt) {
    matchQuery["createdAt"] = {};
    if (result.data.startAt)
      matchQuery["createdAt"]["$gte"] = new Date(
        parseInt(result.data.startAt as string)
      );
    if (result.data.endAt)
      matchQuery["createdAt"]["$lte"] = new Date(
        parseInt(result.data.endAt as string)
      );
  }
  if (result.data?.year) ID["year"] = { $year: "$createdAt" };
  if (result.data?.month) ID["month"] = { $month: "$createdAt" };
  if (result.data?.day) ID["day"] = { $dayOfMonth: "$createdAt" };
  const logs = await Logs.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: ID,
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);
  return logs as DataBase.Queries.Logs.LogsCount[];
}
router.get("/logCount", async (req, res) => {
  const payments = await getLogsCount(req.query);
  res.status(200).sendSuccess(payments);
});
router.use(IdRouter);
export default router;
