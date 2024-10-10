import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
import logsRouter from "./logs";
import Trainers from "@serv/models/trainers";
const router = Router();
export async function getTrainer(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The trainer id is not valid");
  const trainer = await Trainers.findById(id);
  if (!trainer) throw new RouteError(404, "The trainer is not found");
  return trainer;
}
router.use("/:id", async (req, res, next) => {
  res.locals.trainer = await getTrainer(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.trainer);
});
const registerUpdate = new Validator({
  name: ["string"],
  email: ["email"],
  phone: ["string"],
});
router.post("/:id", async (req, res) => {
  const user = res.locals.trainer as Document<DataBase.Models.Trainers>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);

  const newTrainer = await Trainers.findByIdAndUpdate(
    user._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newTrainer);
});
router.delete("/:id", async (req, res) => {
  const user = res.locals.trainer as Document<DataBase.Models.User>;
  const newTrainer = await Trainers.findByIdAndDelete(user._id);
  res.status(200).sendSuccess(newTrainer);
});
router.use("/:id/logs", logsRouter);
export default router;
