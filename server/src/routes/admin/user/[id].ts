import { Router, Response } from "express";
import mongoose, { Document } from "mongoose";
import Users from "@serv/models/user";
import Validator from "validator-checker-js";
const router = Router();

router.use("/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).SendFailed("The user id is not valid");
  const user = await Users.findById(req.params.id);
  if (!user) return res.status(404).SendFailed("The user is not found");
  res.locals.user = user;
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
  const result = registerUpdate.passes(req.query);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const newUser = await Users.findByIdAndDelete(user._id);
  res.status(200).sendSuccess(newUser);
});
export default router;
