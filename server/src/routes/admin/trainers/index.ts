import { Router } from "express";
import Trainers from "@serv/models/trainers";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";

const router = Router();
const registerValidator = new Validator({
  name: ["string", "required"],
  email: ["email", "string"],
  phone: ["string"],
  ".": ["required"],
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  result.data;
  const trainer = new Trainers({
    ...result.data,
  } as DataBase.Models.Trainers);
  const savedUser = await trainer.save();
  res.status(200).sendSuccess(savedUser);
});
export async function getAllTrainers() {
  return await Trainers.find({});
}
router.get("/", async (req, res) => {
  const results = await getAllTrainers();
  res.status(200).sendSuccess(results);
});
router.use(IdRouter);
export default router;
