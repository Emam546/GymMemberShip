/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from "express";
import "@serv/validator/database";
import Payments from "@serv/models/payments";
import Validator from "validator-checker-js";
import Users from "@serv/models/users";
import Plans from "@serv/models/plans";
import IdRouter from "./[id]";
import { RouteError, RouteErrorHasError } from "@serv/declarations/classes";
const router = Router();
const registerValidator = new Validator({
  planId: ["required", { existedId: { path: Plans.modelName } }],
  userId: ["required", { existedId: { path: Users.modelName } }],
  separated: ["boolean", "required"],
  paid: ["integer", "required"],
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
  startAt: ["numeric"],
  endAt: ["numeric"],
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
export async function getPayments(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 },
  populate: (keyof DataBase.Models.Logs)[] = ["planId", "userId"]
) {
  const result = registerQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  const { skip, limit, startAt, endAt } = result.data;
  const matchQuery: Record<string, unknown> = { ...match };
  if (startAt || endAt) {
    matchQuery["createdAt"] = {
      $lte: parseInt(endAt as string) || Infinity,
      $gte: parseInt(startAt as string) || 0,
    };
  }

  const queryMongo = Payments.find(matchQuery)
    .hint(hint)
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);
  const payments = await populate.reduce(
    (query, val) => query.populate(val),
    queryMongo
  );
  return payments;
}
router.get("/", async (req, res) => {
  const payments = await getPayments(req.query);
  res.status(200).sendSuccess(payments);
});
const registerProfitQuery = new Validator({
  startAt: ["numeric"],
  endAt: ["numeric"],
  year: ["accepted"],
  month: ["accepted"],
  day: ["accepted"],
});
export async function getPaymentsProfit(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 }
) {
  const result = registerProfitQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalidData", result.errors);
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
  const payments = await Payments.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: ID,
        profit: { $sum: "$paid" },
        paymentCount: { $sum: 1 },
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
  return payments as DataBase.Queries.Payments.Profit[];
}
router.get("/profit", async (req, res) => {
  const payments = await getPaymentsProfit(req.query);
  res.status(200).sendSuccess(payments);
});
router.use(IdRouter);
export default router;
