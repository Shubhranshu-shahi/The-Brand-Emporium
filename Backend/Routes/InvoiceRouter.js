const {
  getAllInvoice,
  invoiceByID,
  invoiceInsert,
  invoiceUpdate,
  invoiceDelete,
  invoiceNumbersSearch,
  InvoiceProductIdSearch,
} = require("../Controllers/InvoiceController");


const router = require("express").Router();

router.get("/", getAllInvoice);
router.get("/:id", invoiceByID);
router.post("/", invoiceInsert);
router.put("/:id", invoiceUpdate);
router.delete("/:id", invoiceDelete);
router.post("/invoice-numbers", invoiceNumbersSearch);
router.post("/product-id", InvoiceProductIdSearch);

module.exports = router;
