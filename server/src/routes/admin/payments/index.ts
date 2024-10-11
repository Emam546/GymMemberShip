/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from "express";
import "@serv/validator/database";
import Payments from "@serv/models/payments";
import Validator from "validator-checker-js";
import { RouteErrorHasError } from "@serv/declarations/classes";
import { SortOrder } from "mongoose";
const router = Router();
const registerQuery = new Validator({
  startAt: ["numeric"],
  endAt: ["numeric"],
  skip: ["numeric"],
  limit: ["numeric"],
  remaining: ["accepted"],
  ".": ["required"],
});
export async function getPayments(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 },
  populate: (keyof DataBase.Models.Subscriptions)[] = [
    "planId",
    "userId",
    "adminId",
    "trainerId",
  ],
  sort: Record<string, SortOrder> = {}
) {
  const result = registerQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  const { skip, limit, startAt, endAt, remaining } = result.data;
  const matchQuery: Record<string, unknown> = {
    ...match,
  };
  if (startAt || endAt) {
    matchQuery["createdAt"] = {
      $lte: parseInt(endAt as string) || Infinity,
      $gte: parseInt(startAt as string) || 0,
    };
  }
  if (remaining) matchQuery["remaining"] = { $gt: 0 };
  const queryMongo = Payments.find(matchQuery)
    .hint({ ...hint, __t: 1 })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity)
    .sort(sort);
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
  active: ["string", { in: ["true", "false"] }],
  remaining: ["accepted"],
  ".": ["required"],
});
export async function getPaymentsProfit(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 }
) {
  const result = registerProfitQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalidData", result.errors);

  const matchQuery: Record<string, any> = { ...match };

  const { remaining } = result.data;
  if (remaining) matchQuery["remaining"] = { $gt: 0 };
  const ID: Record<string, unknown> = {};
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
  ]).hint({ ...hint, __t: 1 });

  return payments as DataBase.Queries.Payments.Profit[];
}
router.get("/profit", async (req, res) => {
  const payments = await getPaymentsProfit(req.query);
  res.status(200).sendSuccess(payments);
});

export default router;
