/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Router } from "express";
import Products from "@serv/models/products";
import Validator from "validator-checker-js";
import IdRouter from "./[id]";
import { RouteErrorHasError } from "@serv/declarations/classes";
const router = Router();
const registerValidator = new Validator({
  name: ["string", "required"],
  num: ["integer", "required"],
  price: ["integer", "required"],
});
router.post("/", async (req, res) => {
  const result = registerValidator.passes(req.body);
  if (!result.state)
    return res.status(400).sendFailed("invalid Data", result.errors);
  const user = new Products({
    ...result.data,
  } as DataBase.Models.Products);
  const savedUser = await user.save();
  res.status(200).sendSuccess(savedUser);
});
const registerQuery = new Validator({});

export function getProducts(query?: unknown) {
  const result = registerQuery.passes(query);
  if (!result.state)
    throw new RouteErrorHasError(400, "invalid Data", result.errors);
  return Products.find({});
}
router.get("/", async (req, res) => {
  const results = await getProducts();
  res.status(200).sendSuccess(results);
});
// const registerQueryParam = new Validator({
//   ".": ["required"],
//   barcode: ["string", "required"],
// });
// router.get("/barcode", async (req, res) => {
//   const result = registerQueryParam.passes(req.query);
//   if (!result.state)
//     return res.status(400).sendFailed("invalid Data", result.errors);
//   const { barcode } = result.data;
//   if (!barcode) return res.status(200).sendSuccess([]);
//   const results = await Products.find({ barcode: parseInt(barcode) })
//     .hint({
//       barcode: 1,
//     })
//     .limit(1)
//     .populate("adminId");
//   res.status(200).sendSuccess(results);
// });
router.use(IdRouter);
export default router;
