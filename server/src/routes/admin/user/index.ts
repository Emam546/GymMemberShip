import { Router } from "express";
import Users from "@serv/models/user";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
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
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);;
  result.data;
  const user = new Users({
    ...result.data,

    createdBy: "admin",
  } as DataBase.Models.User);
  const savedUser = await user.save();
  res.status(200).sendSuccess(savedUser);
});
const registerQuery = new Validator({
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
interface Query {
  ageMin?: string;
  ageMax?: string;
  tallMin?: string;
  tallMax?: string;
  weightMin?: string;
  weightMax?: string;
  skip?: number;
  limit?: number;
}
router.get("/", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);;
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
  const results = await Users.find({
    tall: {
      $lte: parseInt(tallMax as string) || Infinity,
      $gte: parseInt(tallMin as string) || 0,
    },
    age: {
      $lte: parseInt(ageMax as string) || Infinity,
      $gte: parseInt(ageMin as string) || 0,
    },
    weight: {
      $lte: parseInt(weightMax as string) || Infinity,
      $gte: parseInt(weightMin as string) || 0,
    },
  })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);
  res.status(200).sendSuccess(results);
});
router.use(IdRouter);
export default router;
