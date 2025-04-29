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

const getInvoices = async (req, res) => {
  console.log("i in");
  const { page = 1, pageSize = 10, startDate, endDate, search } = req.query;
  const filter = {};

  console.log("Query params:", req.query);

  // Apply date range filter
  if (startDate && endDate) {
    filter["customerAndInvoice.invoiceDate"] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Apply search filter (customer name or invoice number)
  if (search && search.trim() !== "") {
    filter.$or = [
      { "customerAndInvoice.customerName": { $regex: search, $options: "i" } },
      { "customerAndInvoice.invoiceNumber": { $regex: search, $options: "i" } },
    ];
  }
  console.log("Filter:", filter);

  try {
    const skip = (page - 1) * pageSize;
    const invoices = await InvoiceModal.find(filter)
      .skip(Number(skip))
      .limit(Number(pageSize));

    const total = await InvoiceModal.countDocuments(filter);

    res.json({
      invoices,
      total,
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: "Error fetching invoices", error: err });
  }
};

const invoicesExport = async (req, res) => {
  const { startDate, endDate, search } = req.query;
  const filter = {};

  if (startDate && endDate) {
    filter["customerAndInvoice.invoiceDate"] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (search) {
    filter.$or = [
      { "customerAndInvoice.customerName": { $regex: search, $options: "i" } },
      { "customerAndInvoice.invoiceNumber": { $regex: search, $options: "i" } },
    ];
  }

  try {
    const invoices = await InvoiceModal.find(filter);

    res.json({
      invoices,
    });
  } catch (err) {
    res.status(500).json({ message: "Error exporting invoices", error: err });
  }
};

const aggregatedInvoiceData = async (req, res) => {
  const { startDate, endDate, groupBy } = req.body;

  console.log(
    "Start date = ",
    startDate,
    " End Date = ",
    endDate,
    " group by = ",
    groupBy
  );

  // Validate input
  if (!startDate || !endDate || !groupBy) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  // Convert startDate and endDate to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Set end date to the end of the day

  try {
    // Aggregation pipeline

    const invoices = await InvoiceModal.aggregate([
      {
        $match: {
          "customerAndInvoice.invoiceDate": { $gte: start, $lte: end },
        },
      },
      {
        $unwind: "$rows",
      },
      {
        $group: {
          _id:
            groupBy === "daily"
              ? {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$customerAndInvoice.invoiceDate",
                  },
                }
              : groupBy === "monthly"
              ? {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$customerAndInvoice.invoiceDate",
                  },
                }
              : {
                  $dateToString: {
                    format: "%Y",
                    date: "$customerAndInvoice.invoiceDate",
                  },
                },

          totalRevenue: {
            $sum: {
              $toDouble: "$totalDetails.receive",
            },
          },
          totalCost: {
            $sum: {
              $multiply: [
                { $toDouble: "$rows.purchasedWithQty" },
                { $toDouble: "$rows.qty" },
              ],
            },
          },
          totalProfit: {
            $sum: {
              $subtract: [
                { $toDouble: "$totalDetails.receive" },
                {
                  $multiply: [
                    { $toDouble: "$rows.purchasedWithQty" },
                    { $toDouble: "$rows.qty" },
                  ],
                },
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ]);

    // Fill in missing dates (if no data for certain dates)
    const filledData = fillMissingDates(invoices, groupBy);

    res.json(filledData);
  } catch (error) {
    console.error("Error aggregating invoice data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to fill missing dates
const fillMissingDates = (data, groupBy) => {
  if (data.length === 0) return [];

  const parseDate = (str) => {
    if (groupBy === "daily") return new Date(str);
    if (groupBy === "monthly") {
      const [year, month] = str.split("-");
      return new Date(Number(year), Number(month) - 1, 1);
    }
    if (groupBy === "yearly") {
      return new Date(Number(str), 0, 1);
    }
  };

  const formatDate = (date) => {
    if (groupBy === "daily") {
      return date.toISOString().split("T")[0];
    } else if (groupBy === "monthly") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else if (groupBy === "yearly") {
      return `${date.getFullYear()}`;
    }
  };

  const allDates = [];
  let currentDate = parseDate(data[0]._id);
  const lastDate = parseDate(data[data.length - 1]._id);

  while (currentDate <= lastDate) {
    allDates.push(formatDate(new Date(currentDate)));

    if (groupBy === "daily") {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (groupBy === "monthly") {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (groupBy === "yearly") {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }

  const dataMap = data.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});

  return allDates.map((date) =>
    dataMap[date]
      ? dataMap[date]
      : { _id: date, totalRevenue: 0, totalCost: 0, totalProfit: 0 }
  );
};

module.exports = { aggregatedInvoiceData };

module.exports = {
  getAllInvoice,
  invoiceByID,
  invoiceInsert,
  invoiceUpdate,
  invoiceDelete,
  invoiceNumbersSearch,
  InvoiceProductIdSearch,
  getInvoices,
  invoicesExport,
  aggregatedInvoiceData,
};
