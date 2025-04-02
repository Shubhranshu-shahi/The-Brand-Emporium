const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemHSN: {
    type: String,
    // required: true,
    // unique : true
  },
  category: {
    type: String,
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  mrp: {
    type: String,
    required: true,
  },
  discountSale: {
    type: String,
    // required: false,
  },
  discountAmount: {
    type: String,
  },
  salePrice: {
    type: String,
    required: true,
  },
  taxSale: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: String,
    required: true,
  },
  taxPurchase: {
    type: String,
    required: true,
  },
  purchasedPrice: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const ProductModal = mongoose.model("products", ProductSchema);

module.exports = ProductModal;
