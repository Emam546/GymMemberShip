import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Logs from "@serv/models/log";
const router = Router();

router.use("/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).SendFailed("The log is not valid");
  const log = await Logs.findById(req.params.id);
  if (!log) return res.status(404).SendFailed("The log is not found");
  res.locals.log = log;
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.log);
});
router.delete("/:id", async (req, res) => {
  const log = res.locals.log as Document<DataBase.Models.Logs>;
  await Logs.findByIdAndDelete(log._id);
  res.status(200).sendSuccess(null);
});
export default router;
