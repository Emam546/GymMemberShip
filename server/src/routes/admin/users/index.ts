import { Router } from "express";
import Users from "@serv/models/users";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
import { RootFilterQuery } from "mongoose";
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
    return res.status(400).SendFailed("invalid Data", result.errors);
  result.data;
  const user = new Users({
    ...result.data,

    createdBy: "admin",
  } as DataBase.Models.User);
  const savedUser = await user.save();
  res.status(200).sendSuccess(savedUser);
});
const registerQuery = new Validator({
  name: ["string"],
  ageMin: ["numeric"],
  ageMax: ["numeric"],
  tallMin: ["numeric"],
  tallMax: ["numeric"],
  weightMin: ["numeric"],
  weightMax: ["numeric"],
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
router.get("/", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const {
    ageMax,
    ageMin,
    tallMax,
    tallMin,
    weightMax,
    weightMin,
    skip,
    limit,
    name,
  } = result.data;
  const query: RootFilterQuery<DataBase.Models.User> = {};
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
  const results = await Users.find(query)
    .hint({
      createdAt: -1,
    })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);
  res.status(200).sendSuccess(results);
});
router.use(IdRouter);
export default router;
