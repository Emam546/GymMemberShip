/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Router } from "express";
import Users from "@serv/models/users";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
import { RootFilterQuery } from "mongoose";
import { RouteError, RouteErrorHasError } from "@serv/declarations/classes";
const router = Router();
const registerValidator = new Validator({
  name: ["string"],
  age: ["integer", { min: 0 }],
  sex: ["string", { in: ["male", "female"] }],
  email: ["email"],
  phone: ["string"],
  details: {
    whyDidYouCame: ["string"],
    ".": ["required"],
  },
  tall: ["integer", { min: 0 }],
  weight: ["integer", { min: 0 }],
  ".": ["required"],
  blocked: ["boolean"],
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const user = new Users({
    ...result.data,
    adminId: req.user?._id,
  } as DataBase.Models.User);
  const savedUser = await user.save();
  res.status(200).sendSuccess(savedUser);
});
const registerQuery = new Validator({
  name: ["string"],
  startAt: ["isDate"],
  endAt: ["isDate"],
  ageMin: ["numeric"],
  ageMax: ["numeric"],
  tallMin: ["numeric"],
  tallMax: ["numeric"],
  weightMin: ["numeric"],
  weightMax: ["numeric"],
  ".": ["required"],
});
export function getQuery(q: unknown) {
  const result = registerQuery.passes(registerQuery.validAttr(q));
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  const {
    ageMax,
    ageMin,
    tallMax,
    tallMin,
    weightMax,
    weightMin,
    name,
    startAt,
    endAt,
  } = result.data;
  const query: RootFilterQuery<DataBase.Models.User> = {};

  if (startAt || endAt) {
    query["createdAt"] = {};
    if (startAt) query["createdAt"]["$gte"] = new Date(startAt as string);
    if (endAt) query["createdAt"]["$lte"] = new Date(endAt as string);
  }
  if (tallMin || tallMax) {
    query["tall"] = {
      $lte: parseInt(tallMax as string) || Infinity,
      $gte: parseInt(tallMin as string) || 0,
    };
  }
  if (ageMin || ageMax) {
    query["age"] = {
      $lte: parseInt(ageMax as string) || Infinity,
      $gte: parseInt(ageMin as string) || 0,
    };
  }
  if (weightMin || weightMax) {
    query["weight"] = {
      $lte: parseInt(weightMax as string) || Infinity,
      $gte: parseInt(weightMin as string) || 0,
    };
  }
  if (name) query["name"] = { $regex: name, $options: "i" };
  return query;
}
const registerSkip = new Validator({
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});

export async function getUsers(
  q: unknown,
  populate: (keyof DataBase.Models.User)[] = ["adminId"]
) {
  const query = getQuery(q);
  const result = registerSkip.passes(registerSkip.validAttr(q));
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  const { limit, skip } = result.data;
  const queryMongo = Users.find(query)
    .hint({
      createdAt: -1,
    })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);
  const users = await populate.reduce(
    (query, val) => query.populate(val),
    queryMongo
  );
  return users;
}
router.get("/", async (req, res) => {
  res.status(200).sendSuccess(await getUsers(req.query));
});
const registerCountQuery = new Validator({
  year: ["accepted"],
  month: ["accepted"],
  day: ["accepted"],

  ".": ["required"],
});
export async function getUsersCount(
  query: unknown,
  match?: any,
  hint: Record<string, unknown> = { createdAt: -1 }
) {
  const matchQuery: Record<string, any> = { ...match, ...getQuery(query) };
  const ID: Record<string, unknown> = {};
  const result = registerCountQuery.passes(registerCountQuery.validAttr(query));
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  if (result.data?.year) ID["year"] = { $year: "$createdAt" };
  if (result.data?.month) ID["month"] = { $month: "$createdAt" };
  if (result.data?.day) ID["day"] = { $dayOfMonth: "$createdAt" };

  const payments = await Users.aggregate([
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

  return payments as DataBase.Queries.Payments.Profit[];
}
router.get("/count", async (req, res) => {
  res.status(200).sendSuccess(await getUsersCount(req.query));
});
const registerQueryParam = new Validator({
  ".": ["required"],
  barcode: ["string", "numeric", "required"],
});
router.get("/barcode", async (req, res) => {
  const result = registerQueryParam.passes(req.query);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const { barcode } = result.data;
  if (!barcode) return res.status(200).sendSuccess([]);
  const results = await Users.find({ barcode: parseInt(barcode) })
    .hint({
      barcode: 1,
    })
    .limit(1)
    .populate("adminId");
  res.status(200).sendSuccess(results);
});
router.use(IdRouter);
export default router;
