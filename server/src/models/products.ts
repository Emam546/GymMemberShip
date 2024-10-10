import mongoose from "mongoose";
const schema = new mongoose.Schema<DataBase.Models.Products>(
  {
    name: { type: String, required: true },
    num: {
      type: Number,
      required: true,
    },
    price: { type: Number, required: true },
  },
  { minimize: false }
);

schema.index({ barcode: 1 });
export default ((mongoose.models && mongoose.models.products) ||
  mongoose.model(
    "products",
    schema
  )) as mongoose.Model<DataBase.Models.Products>;
