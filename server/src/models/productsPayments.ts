import mongoose, { CallbackError } from "mongoose";
import Payments from "./payments";
import Products from "./products";

const schema = new mongoose.Schema<DataBase.Models.ProductPayments>(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Products.modelName,
          required: true,
        },
        num: { type: Number, required: true },
      },
    ],
  },
  { minimize: false }
);
schema.pre("save", async function (next) {
  try {
    await Products.updateMany(
      { _id: { $in: this.products.map((v) => v.productId) } },
      { $inc: { num: -1 } }
    );
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});
export default ((mongoose.models && mongoose.models.productsPayments) ||
  Payments.discriminator<DataBase.Models.ProductPayments>(
    "productsPayments",
    schema
  )) as mongoose.Model<DataBase.Models.ProductPayments>;
