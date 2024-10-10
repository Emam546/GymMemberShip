import { Router } from "express";
import mongoose, { Document } from "mongoose";
import Products from "@serv/models/products";
import Validator from "validator-checker-js";
import { RouteError } from "@serv/declarations/classes";
const router = Router();
export async function getProduct(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "The user id is not valid");
  const product = await Products.findById(id);
  if (!product) throw new RouteError(404, "The user is not found");
  return product;
}
router.use("/:id", async (req, res, next) => {
  res.locals.product = await getProduct(req.params.id);
  next();
});
router.get("/:id", (req, res) => {
  res.status(200).sendSuccess(res.locals.product);
});
const registerUpdate = new Validator({
  name: ["string"],
  num: ["integer"],
  price: ["integer"],
});
router.post("/:id", async (req, res) => {
  const product = res.locals.product as Document<DataBase.Models.Products>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const newUser = await Products.findByIdAndUpdate(
    product._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );
  res.status(200).sendSuccess(newUser);
});
router.delete("/:id", async (req, res) => {
  const product = res.locals.product as Document<DataBase.Models.Products>;
  const newUser = await Products.findByIdAndDelete(product._id);
  res.status(200).sendSuccess(newUser);
});

export default router;
