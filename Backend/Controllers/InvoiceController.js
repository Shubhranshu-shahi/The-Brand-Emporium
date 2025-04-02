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
    console.log(req.params);
    // const invoice = await InvoiceModal.findById(req.params.id);
    // const invoice = await InvoiceModal.findOne({ _id: id });
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
  console.log(req.body);
  // res.send("check");
  try {
    const invoice = req.body;
    console.log(invoice);
    let invoiceNumber = invoice.customerAndInvoice.invoiceNumber;

    // const { itemCode } = req.body;
    //   const invoice = await InvoiceModal.find();
    console.log(invoiceNumber, "--------invoiceNumber");
    const checkinvoice = await InvoiceModal.findOne({
      "customerAndInvoice.invoiceNumber": invoiceNumber,
    });
    console.log(checkinvoice, "-------check");
    const errMessage = "invoice already exits,or change Invoice number";
    if (checkinvoice) {
      console.log("check");
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
    console.log(err);
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
    // const invoice = await InvoiceModal.findOne({ itemCode });
    if (!invoice) {
      return res.status(404).send("invoice not found");
    }
    res
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
    const {
      itemName,
      itemHSN,
      category,
      itemCode,
      mrp,
      discountSale,
      salePrice,
      taxSale,
      sellingPrice,
      purchasePrice,
      taxPurchase,
      purchasedPrice,
    } = req.body;
    let updatedinvoice = {
      itemName,
      itemHSN,
      category,
      itemCode,
      mrp,
      discountSale,
      salePrice,
      taxSale,
      sellingPrice,
      purchasePrice,
      taxPurchase,
      purchasedPrice,
      updatedAt: new Date(),
    };
    const invoice = await InvoiceModal.findByIdAndUpdate(id, updatedinvoice, {
      new: true,
    });
    // const invoice = await InvoiceModal.findOne({ itemCode });
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
module.exports = {
  getAllInvoice,
  invoiceByID,
  invoiceInsert,
  invoiceUpdate,
  invoiceDelete,
};
