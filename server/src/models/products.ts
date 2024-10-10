import mongoose from "mongoose";
const schema = new mongoose.Schema<DataBase.Models.Products>(
  {
    name: String,
    barcode: { unique: true, type: String },
    num: {
      type: Object,
      required: true,
    },
    price: { type: Object, required: true },
  },
  { minimize: false }
);

schema.index({ barcode: 1 });
schema.index({ createdAt: -1 });
schema.index({ adminId: 1, createdAt: -1 });
schema.index({ provider_id: 1, provider_type: 1 });
export default ((mongoose.models && mongoose.models.products) ||
  mongoose.model(
    "products",
    schema
  )) as mongoose.Model<DataBase.Models.Products>;
