const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    detail: { type: String, required: true },
    image: { type: String, required: true }
  },
  {timestamps: true}
);

const Product = mongoose.model("product", ProductSchema);


module.exports = Product;