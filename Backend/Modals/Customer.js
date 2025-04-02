const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  CustomerGstin: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceNumber: {
    type: mongoose.Schema.Types.Array,
    required: true,
    unique: true,
  },
  invoiceDate: {
    type: mongoose.Schema.Types.Array,
    required: true,
  },
  email: {
    type: String,
  },
  GSTIN: {
    type: String,
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

const CustomerModal = mongoose.model("customer", CustomerSchema);

module.exports = CustomerModal;
