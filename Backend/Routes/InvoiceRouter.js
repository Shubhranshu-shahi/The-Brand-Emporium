const {
  getAllInvoice,
  invoiceByID,
  invoiceInsert,
  invoiceUpdate,
  invoiceDelete,
} = require("../Controllers/InvoiceController");


const router = require("express").Router();

router.get("/", getAllInvoice);
router.get("/:id", invoiceByID);
router.post("/", invoiceInsert);
router.put("/:id", invoiceUpdate);
router.delete("/:id", invoiceDelete);

module.exports = router;
