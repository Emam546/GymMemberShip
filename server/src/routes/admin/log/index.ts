/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import "@serv/validator/database";
import Validator from "validator-checker-js";
import Users from "@serv/models/users";
import Plans from "@serv/models/plans";
import Payments from "@serv/models/payments";
import Logs from "@serv/models/log";
import IdRouter from "./[id]";
import { RouteErrorHasError } from "@serv/declarations/classes";
import { IncrementPaymentLogs } from "../payments/[id]";
const router = Router();
const registerValidator = new Validator({
  planId: ["required", { existedId: { path: Plans.modelName } }],
  userId: ["required", { existedId: { path: Users.modelName } }],
  paymentId: ["required", { existedId: { path: Payments.modelName } }],
  ".": ["required"],
});
router.post("/", async (req, res) => {
  const result = await registerValidator.asyncPasses(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  await IncrementPaymentLogs(result.data.paymentId, 1);
  const log = new Logs({
    ...result.data,
    adminId: req.user?._id,
    createdBy: "Admin",
  } as DataBase.Models.Logs);
  const logSave = await log.save();
  res.status(200).sendSuccess(logSave);
});
const registerGetQuery = new Validator({
  startAt: ["numeric"],
  endAt: ["numeric"],
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
export async function getLogs(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 },
  populate: (keyof DataBase.Models.Logs)[] = [
    "planId",
    "userId",
    "paymentId",
    "adminId",
    "trainerId",
  ]
) {
  const result = registerGetQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  const { skip, limit, startAt, endAt } = result.data;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const matchQuery: Record<string, unknown> = { ...match };
  if (startAt || endAt) {
    matchQuery["createdAt"] = {
      $lte: parseInt(endAt as string) || Infinity,
      $gte: parseInt(startAt as string) || 0,
    };
  }

  const MongQuery = Logs.find(matchQuery)
    .hint(hint)
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  const payments = await populate.reduce(
    (query, val) => query.populate(val),
    MongQuery
  );
  return payments;
}
router.get("/", async (req, res) => {
  const payments = await getLogs(req.query);
  res.status(200).sendSuccess(payments);
});
const registerLogDataQuery = new Validator({
  startAt: ["numeric"],
  endAt: ["numeric"],
  year: ["accepted"],
  month: ["accepted"],
  day: ["accepted"],
});
export async function getLogsCount(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 }
) {
  const result = registerLogDataQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalidData", result.errors);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const matchQuery: {
    createdAt?: {
      $gte?: unknown;
      $lte?: unknown;
    };
  } = { ...match };
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
  ]).hint(hint);
  return logs as DataBase.Queries.Logs.LogsCount[];
}
router.get("logs/count", async (req, res) => {
  const payments = await getLogsCount(req.query);
  res.status(200).sendSuccess(payments);
});
router.use(IdRouter);
export default router;
