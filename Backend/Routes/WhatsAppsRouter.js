const { sendInvoice, sendStockUpdate } = require("../Controllers/WhatsAppController");

const router = require("express").Router();

router.post("/send", sendInvoice);
router.post("/stock",sendStockUpdate)
module.exports = router;
