import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Users from "@serv/models/users";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
import paymentsRouter from "./payments";
import logsRouter from "./logs";
const router = Router();
export async function getUser(
  id: string,
  populate: (keyof DataBase.Models.User)[] = ["adminId"]
) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The user id is not valid");
  const query = Users.findById(id);
  const user = await populate.reduce((acc, key) => acc.populate(key), query);
  if (!user) throw new RouteError(404, "The user is not found");
  return user;
}
router.use("/:id", async (req, res, next) => {
  res.locals.user = await getUser(req.params.id, []);
  next();
});
router.get("/:id", async (req, res) => {
  res.status(200).sendSuccess(await getUser(req.params.id));
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
    return res.status(400).sendFailed("invalid Data", result.errors);
  const newUser = await Users.findByIdAndUpdate(
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
  res.status(200).sendSuccess(newUser);
});

router.use("/:id", paymentsRouter);
router.use("/:id", logsRouter);
export default router;
