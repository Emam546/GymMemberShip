import { Router } from "express";
import Admins from "@serv/models/admins";
import IdRouter from "./[id]";
import LoginRouter from "./login";
import Validator from "validator-checker-js";

const router = Router();
export async function getAdmins() {
  const admins = await Admins.find({});
  return admins;
}
router.get("/", async (req, res) => {
  res.sendSuccess(await getAdmins());
});
const registerValidator = new Validator({
  name: ["string", "required"],
  password: ["string", "required"],
  email: ["string", "required"],
  type: ["string", { in: ["admin", "assistant"] }, "required"],
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).SendFailed("invalid Data", result.errors);
  result.data;
  const user = new Admins({
    ...result.data,
  } as DataBase.Models.Admins);
  const savedUser = await user.save();
  res.status(200).sendSuccess(savedUser);
});

router.use(IdRouter);
router.use("auth", LoginRouter);
export default router;
