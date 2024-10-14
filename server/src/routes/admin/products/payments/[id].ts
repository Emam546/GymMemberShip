import { Router } from "express";
import mongoose, { Document } from "mongoose";
import ProductsPayments from "@serv/models/productsPayments";
import Validator from "validator-checker-js";
import Products from "@serv/models/products";
import Logs from "@serv/models/log";
import { RouteError } from "@serv/declarations/classes";
const router = Router();
export async function getProductPayment(
  id: string,
  populate: (keyof DataBase.Models.ProductPayments)[] = ["adminId", "userId"]
) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new RouteError(404, "the Product Payment id is not valid");
  const query = ProductsPayments.findById(id);
  const payment = await populate.reduce<typeof query>(
    (acc, key) => acc.populate(key),
    query
  );

  if (!payment)
    throw new RouteError(404, "the Product Payment id is not exist");
  return payment;
}
router.use("/:id", async (req, res, next) => {
  res.locals.payment = await getProductPayment(req.params.id, []);
  next();
});
router.get("/:id", async (req, res) => {
  res.status(200).sendSuccess(await getProductPayment(req.params.id));
});
const registerUpdate = new Validator({
  products: [
    {
      productId: ["required", { existedId: { path: Products.modelName } }],
      num: ["integer", "required"],
    },
    "array",
    ["required"],
  ],
  paid: ["integer", "required"],
  remaining: ["integer", "required"],
  ".": ["required"],
});
router.post("/:id", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.Subscriptions>;
  const result = registerUpdate.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const newPayment = await ProductsPayments.findByIdAndUpdate(
    payment._id,
    {
      $set: { ...result.data },
    },
    { new: true }
  );

  res.status(200).sendSuccess(newPayment);
});
router.delete("/:id", async (req, res) => {
  const payment = res.locals.payment as Document<DataBase.Models.Subscriptions>;
  const newPayment = await ProductsPayments.findByIdAndDelete(payment._id);
  await Logs.deleteMany({ paymentId: payment._id });
  res.status(200).sendSuccess(newPayment);
});

export default router;
