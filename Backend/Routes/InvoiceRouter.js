const {
  getAllInvoice,
  invoiceByID,
  invoiceInsert,
  invoiceUpdate,
  invoiceDelete,
  invoiceNumbersSearch,
  InvoiceProductIdSearch,

  invoicesExport,
  test,
  getInvoices,
  aggregatedInvoiceData,
  invoicesummary,
} = require("../Controllers/InvoiceController");

const router = require("express").Router();

router.get("/", getAllInvoice);
router.get("/:id", invoiceByID);
router.post("/", invoiceInsert);
router.put("/:id", invoiceUpdate);
router.delete("/:id", invoiceDelete);
router.post("/invoice-numbers", invoiceNumbersSearch);
router.post("/product-id", InvoiceProductIdSearch);

router.get("/reports/invoices", getInvoices);
router.post("/api/aggregated-invoice-data", aggregatedInvoiceData);
router.get("/api/summary", invoicesummary);
router.get("/api/exports", invoicesExport);

module.exports = router;
