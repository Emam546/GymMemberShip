import mongoose from "mongoose";
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

schema.index({ barcode: 1 });
schema.index({ createdAt: -1 });
schema.index({ adminId: 1, createdAt: -1 });
schema.index({ provider_id: 1, provider_type: 1 });
export default ((mongoose.models && mongoose.models.productsPayments) ||
  Payments.discriminator<DataBase.Models.ProductPayments>(
    "productsPayments",
    schema
  )) as mongoose.Model<DataBase.Models.ProductPayments>;
