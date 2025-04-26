const InvoiceModal = require("../Modals/Invoice");

const getAllInvoice = async (req, res) => {
  const invoice = await InvoiceModal.find({});
  res
    .status(200)
    .json({ message: "All invoice", success: true, data: invoice });
};

const invoiceByID = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await InvoiceModal.findOne({
      "customerAndInvoice.invoiceNumber": id,
    });
    if (!invoice) {
      return res.status(404).send("invoice not found");
    }

    res
      .status(201)
      .json({ message: "invoice found", success: true, data: invoice });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const invoiceInsert = async (req, res) => {
  try {
    const invoice = req.body;

    let invoiceNumber = invoice.customerAndInvoice.invoiceNumber;

    const checkinvoice = await InvoiceModal.findOne({
      "customerAndInvoice.invoiceNumber": invoiceNumber,
    });

    const errMessage = "invoice already exits,or change Invoice number";
    if (checkinvoice) {
      return res.status(409).json({
        message: errMessage,
        success: false,
      });
    }
    const invoices = new InvoiceModal(invoice);
    await invoices.save();
    res
      .status(201)
      .json({ message: "invoice generated", success: true, data: invoices });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const invoiceDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModal.findByIdAndDelete({ _id: id });

    if (!invoice) {
      return res.status(404).send("invoice not found");
    }
    return res
      .status(200)
      .json({ message: "invoice delete Successfully", success: false });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const invoiceUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedinvoice = req.body;
    let updatedInv = {
      ...updatedinvoice,
      updatedAt: new Date(),
    };

    const invoice = await InvoiceModal.findOneAndUpdate(
      { "customerAndInvoice.invoiceNumber": id },
      updatedInv,
      { new: true }
    );

    if (!invoice) {
      return res.status(404).send("invoice not found");
    }
    res
      .status(200)
      .json({ message: "invoice updated", success: true, data: invoice });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const invoiceNumbersSearch = async (req, res) => {
  try {
    const { invoiceNumbers } = req.body;

    if (!Array.isArray(invoiceNumbers) || invoiceNumbers.length === 0) {
      return res
        .status(400)
        .json({ message: "invoiceNumbers must be a non-empty array" });
    }

    // Double-check if values are strings
    const sanitizedInvoiceNumbers = invoiceNumbers.map((num) =>
      String(num).trim()
    );

    const invoices = await InvoiceModal.find({
      "customerAndInvoice.invoiceNumber": { $in: sanitizedInvoiceNumbers },
    });

    return res.json({ message: "Match Found", success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const InvoiceProductIdSearch = async (req, res) => {
  const { selectedProduct } = req.body;

  const invoice = await InvoiceModal.find({
    "rows.productId": selectedProduct.id,
  });
  if (!invoice) {
    return res
      .status(400)
      .json({ message: "No invoice found with this product", success: false });
  }
  return res
    .status(200)
    .json({ message: "Invoice Found", success: true, data: invoice });
};

module.exports = {
  getAllInvoice,
  invoiceByID,
  invoiceInsert,
  invoiceUpdate,
  invoiceDelete,
  invoiceNumbersSearch,
  InvoiceProductIdSearch,
};
