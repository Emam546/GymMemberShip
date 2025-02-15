/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Router } from "express";
import { PipelineStage, RootFilterQuery, SortValues } from "mongoose";
import Payments from "@serv/models/subscriptions";
import Validator from "validator-checker-js";
import { RouteErrorHasError } from "@serv/declarations/classes";
import {} from "mongoose";
const router = Router();
const registerQuery = new Validator({
  sex: ["string", { in: ["male", "female"] }],
  startAt: ["isDate"],
  endAt: ["isDate"],
  blocked: ["boolean"],
  ageMin: ["numeric"],
  ageMax: ["numeric"],
  tallMin: ["numeric"],
  tallMax: ["numeric"],
  weightMin: ["numeric"],
  weightMax: ["numeric"],
  skip: ["numeric"],
  limit: ["numeric"],
  active: ["string", { in: ["true", "false"] }],
  remaining: [{ in: ["true", "false"] }, "string"],
  ".": ["required"],
});
function _getAggregateOptions(q: unknown, match?: any) {
  const currentDate = new Date();
  const result = registerQuery.passes(registerQuery.validAttr(q));
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const firstQuery: Record<string, any> = { ...match };
  const { active, remaining, startAt, endAt } = result.data;
  if (typeof active != "undefined") {
    if (active == "true") {
      firstQuery["$and"] = [
        { endAt: { $gt: currentDate } },
        {
          $expr: {
            $lt: ["$logsCount", "$plan.num"], // Compare logsCount with plan.num
          },
        },
      ];
    } else if (active == "false") {
      firstQuery["$or"] = [
        { endAt: { $lte: currentDate } },
        {
          $expr: {
            $gte: ["$logsCount", "$plan.num"], // Compare logsCount with plan.num
          },
        },
      ];
    }
  }
  if (startAt || endAt) {
    firstQuery["startAt"] = {};
    if (startAt) firstQuery["startAt"]["$gte"] = new Date(startAt as string);
    if (endAt) firstQuery["startAt"]["$lte"] = new Date(endAt as string);
  }
  if (remaining) firstQuery["remaining"] = { $gt: 0 };

  const query: RootFilterQuery<DataBase.Models.User> = {};
  const {
    ageMax,
    ageMin,
    tallMax,
    tallMin,
    weightMax,
    weightMin,
    skip,
    limit,
  } = result.data;
  if (tallMin || tallMax) {
    query["userId.tall"] = {
      $lte: parseInt(tallMax as string) || Infinity,
      $gte: parseInt(tallMin as string) || 0,
    };
  }
  if (ageMin || ageMax) {
    query["userId.age"] = {
      $lte: parseInt(ageMax as string) || Infinity,
      $gte: parseInt(ageMin as string) || 0,
    };
  }
  if (weightMin || weightMax) {
    query["userId.weight"] = {
      $lte: parseInt(weightMax as string) || Infinity,
      $gte: parseInt(weightMin as string) || 0,
    };
  }
  const aggregate: PipelineStage[] = [
    {
      $match: firstQuery,
    },
    {
      $sort: { endAt: -1 }, // Optionally sort by endAt in descending order
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        firstPayment: { $first: "$$ROOT" }, // Store the first payment for each user
        paymentsCount: { $sum: 1 }, // Count the number of payments per user
      },
    },
    {
      $addFields: {
        "firstPayment.paymentsCount": "$paymentsCount", // Add paymentsCount to the first payment
      },
    },
    {
      $replaceRoot: { newRoot: "$firstPayment" }, // Replace the root with the first payment document
    },
    {
      // Populating the userId field with user details, including age
      $lookup: {
        from: "users", // Collection name of the users
        localField: "userId", // Field in Payments document
        foreignField: "_id", // Field in Users document
        as: "userId",
      },
    },
    {
      $unwind: "$userId", // Unwind the user array to treat it as an object
    },
    {
      $match: query,
    },
    {
      $skip: parseInt(skip as string) || 0,
    },
  ];
  if (!isNaN(parseInt(limit as string))) {
    const g = parseInt(limit as string);
    aggregate.push({
      $limit: g || 1, // Get the first document
    });
  }

  return aggregate;
}
export function getAggregateOptions(
  ...params: Parameters<typeof _getAggregateOptions>
) {
  const aggregate = _getAggregateOptions(...params);

  aggregate.push(
    ...[
      {
        $lookup: {
          from: "admins", // Collection name of the users
          localField: "adminId", // Field in Payments document
          foreignField: "_id", // Field in Users document
          as: "adminId",
        },
      },
      {
        $unwind: "$adminId", // Unwind the user array to treat it as an object
      },
    ]
  );
  return aggregate;
}
router.get("/", async (req, res) => {
  const aggregate = getAggregateOptions(req.query);
  aggregate.push(
    ...[
      {
        $lookup: {
          from: "plans", // Collection name of the users
          localField: "planId", // Field in Payments document
          foreignField: "_id", // Field in Users document
          as: "planId",
        },
      },
      {
        $unwind: "$planId", // Unwind the user array to treat it as an object
      },
    ]
  );
  const queryRes = await Payments.aggregate(aggregate);
  return res.status(200).sendSuccess(queryRes);
});
const registerProfitQuery = new Validator({
  year: ["accepted"],
  month: ["accepted"],
  day: ["accepted"],
  ".": ["required"],
});
export function getAggregateOptionsProfit(
  ...[q, ...params]: Parameters<typeof getAggregateOptions>
) {
  const aggregate = _getAggregateOptions(q, ...params);
  const ID: Record<string, unknown> = {};
  const result = registerProfitQuery.passes(registerProfitQuery.validAttr(q));
  if (!result.state)
    throw new RouteErrorHasError(400, "invalidData", result.errors);
  if (result.data?.year) ID["year"] = { $year: "$createdAt" };
  if (result.data?.month) ID["month"] = { $month: "$createdAt" };
  if (result.data?.day) ID["day"] = { $dayOfMonth: "$createdAt" };
  aggregate.push(
    ...[
      {
        $group: {
          _id: ID,
          profit: { $sum: "$paid" },
          paymentCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1 as SortValues,
          "_id.month": 1 as SortValues,
          "_id.day": 1 as SortValues,
        } as Record<string, 1>,
      },
    ]
  );
  return aggregate;
}
router.get("/profit", async (req, res) => {
  const aggregate = getAggregateOptionsProfit(req.query);
  const queryRes = await Payments.aggregate(aggregate);
  return res.status(200).sendSuccess(queryRes);
});
export default router;
