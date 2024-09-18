import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Payments from "@serv/models/payments";
import Logs from "@serv/models/log";
import Users from "@serv/models/user";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
const router = Router();
export async function getUser(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The user id is not valid");
  const user = await Users.findById(id);
  if (!user) throw new RouteError(404, "The user is not found");
  return user;
}
router.use("/:id", async (req, res, next) => {
  res.locals.user = await getUser(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.user);
});
const registerUpdate = new Validator({
  name: ["string"],
  age: ["integer", { min: 0 }],
  sex: ["string", { in: ["male", "female"] }],
  email: ["email"],
  phone: ["string"],
  details: {
    whyDidYouCame: ["string"],
  },
  tall: ["integer", { min: 0 }],
  weight: ["integer", { min: 0 }],
  blocked: ["boolean"],
});
router.post("/:id", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);

  const newUser = await Users.findOneAndUpdate(
    user._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newUser);
});
router.delete("/:id", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const newUser = await Users.findByIdAndDelete(user._id);
  await Payments.deleteMany({ userId: user._id });
  await Logs.deleteMany({ userId: user._id });
  res.status(200).sendSuccess(newUser);
});
const registerQuery = new Validator({
  skip: ["numeric"],
  limit: ["numeric"],
  ".": ["required"],
});
router.get("/:id/payments", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const { skip, limit } = result.data;
  const user = res.locals.user as Document<DataBase.Models.User>;
  const payments = await Payments.find({ userId: user._id })
    .hint({
      userId: 1,
      createdAt: -1,
    })
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity)
    .populate("planId");

  res.status(200).sendSuccess(payments);
});
router.get("/:id/payments/count", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Plans>;
  const count = await Payments.countDocuments({ userId: user._id }).hint({
    userId: 1,
    createdAt: -1,
  });

  res.status(200).sendSuccess(count);
});
router.get("/:id/logs", async (req, res) => {
  const result = registerQuery.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const { skip, limit } = result.data;
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await Logs.find({ userId: user._id })
    .hint({
      userId: 1,
      createdAt: -1,
    })
    .populate("planId")
    .skip(parseInt(skip as string) || 0)
    .limit(parseInt(limit as string) || Infinity);

  res.status(200).sendSuccess(logs);
});
router.get("/:id/logs/count", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.User>;
  const logs = await Logs.countDocuments({ userId: user._id }).hint({
    userId: 1,
    createdAt: -1,
  });
  res.status(200).sendSuccess(logs);
});
export default router;
