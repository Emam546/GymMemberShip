import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Admins from "@serv/models/admins";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";

const router = Router();
export async function getAdmin(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The admin id is not valid");
  const user = await Admins.findById(id).select("+password");
  if (!user) throw new RouteError(404, "The admin is not found");
  return user;
}
router.use("/:id", async (req, res, next) => {
  res.locals.user = await getAdmin(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.user);
});
const registerUpdate = new Validator({
  name: ["string"],
  password: ["string"],
  email: ["string", "email"],
  phone: ["string"],
  type: ["string", { in: ["admin", "assistant"] }],
});
router.post("/:id", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Admins>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  const newUser = await Admins.findByIdAndUpdate(
    user._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newUser);
});
router.delete("/:id", async (req, res) => {
  const user = res.locals.user as Document<DataBase.Models.Admins>;
  const newUser = await Admins.findByIdAndDelete(user._id);
  res.status(200).sendSuccess(newUser);
});

export default router;
