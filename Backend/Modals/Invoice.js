const { required, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
  {
    customerAndInvoice: {
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
      },
      invoiceNumber: {
        type: String,
        required: true,
        unique: true,
      },
      invoiceDate: {
        type: Date,
        required: true,
      },
    },
    rows: [
      {
        items: {
          type: Number,
          required: true,
        },
        productId: {
          type: String,
          required: true,
        },
        itemName: {
          type: String,
          required: true,
        },
        itemHSN: {
          type: String,
          // required: true,
          // unique : true
        },
        qty: {
          type: Number,
          required: true,
        },
        itemCode: {
          type: String,
          required: true,
          //   unique: true,
        },
        mrp: {
          type: String,
          required: true,
        },
        discountSale: {
          type: String,
          // required: false,
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
        discountAmount: {
          type: String,
        },
      },
    ],
    totalDetails: {
      total: {
        type: Number,
        required: true,
      },
      roundOff: {
        type: Number,
      },
      receive: {
        type: Number,
      },
      remaining: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const InvoiceModal = mongoose.model("invoice", InvoiceSchema);

module.exports = InvoiceModal;
