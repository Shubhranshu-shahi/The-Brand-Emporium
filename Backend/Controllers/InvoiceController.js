const InvoiceModal = require("../Modals/Invoice");
const { parse } = require("json2csv");

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
  const { page = 1, pageSize = 10, startDate, endDate, search } = req.query;
  const filter = {};

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
      { "customerAndInvoice.phone": { $regex: search, $options: "i" } },
      { "customerAndInvoice.GSTType": { $regex: search, $options: "i" } },
      { "customerAndInvoice.billedBy": { $regex: search, $options: "i" } },
      { "customerAndInvoice.updatedBy": { $regex: search, $options: "i" } },
      { "totalDetails.type": { $regex: search, $options: "i" } },
    ];
  }

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
  const { startDate, endDate, search, gstType } = req.query;
  const filter = {};

  console;

  // Apply date range filter if present
  if (startDate && endDate) {
    filter["customerAndInvoice.invoiceDate"] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Apply search filter if present
  if (search) {
    filter.$or = [
      { "customerAndInvoice.customerName": { $regex: search, $options: "i" } },
      { "customerAndInvoice.invoiceNumber": { $regex: search, $options: "i" } },
      { "customerAndInvoice.phone": { $regex: search, $options: "i" } },
      { "customerAndInvoice.GSTType": { $regex: search, $options: "i" } },
      { "customerAndInvoice.billedBy": { $regex: search, $options: "i" } },
      { "customerAndInvoice.updatedBy": { $regex: search, $options: "i" } },
      { "totalDetails.type": { $regex: search, $options: "i" } },
    ];
  }

  // Apply GSTType filter if 'gstType' is passed as query parameter
  if (gstType && gstType !== "both") {
    filter["customerAndInvoice.GSTType"] = gstType;
  }

  try {
    // Fetch invoices from the database with applied filters
    const invoices = await InvoiceModal.find(filter);

    // Format the data for CSV
    const csvData = invoices
      .map((invoice) => {
        return invoice.rows.map((item) => ({
          InvoiceNumber: invoice.customerAndInvoice.invoiceNumber,
          InvoiceDate: invoice.customerAndInvoice.invoiceDate,
          CustomerName: invoice.customerAndInvoice.customerName,
          Phone: invoice.customerAndInvoice.phone,
          ItemCode: item.itemCode,
          HSN: item.hsn || "", // Assuming hsn field exists
          ItemName: item.itemName,
          Qty: item.qty,
          MRP: item.mrp,
          SalePrice: item.salePrice,
          TaxableAmount: item.taxAmount,
          TaxPercent: item.taxSale,
          DiscountAmount: item.discountAmount,
          DiscountPercentage: item.discountSale,
          CGST: parseFloat(item.taxAmount / 2).toFixed(2) || 0,
          SGST: parseFloat(item.taxAmount / 2).toFixed(2) || 0,
          IGST: item.igst || 0,
          Total: item.sellingPrice,
        }));
      })
      .flat(); // Flatten array if there are multiple items per invoice

    // Convert data to CSV format
    const csv = parse(csvData);

    // Send the CSV data as the response
    res.header("Content-Type", "text/csv");
    res.attachment("invoices.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error exporting invoices", error: err });
  }
};

const aggregatedInvoiceData = async (req, res) => {
  const { startDate, endDate, groupBy } = req.body;

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

const invoicesummary = async (req, res) => {
  try {
    // Build filters based on query params
    const filters = {};

    if (req.query.search) {
      filters.$or = [
        {
          "customerAndInvoice.customerName": {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          "customerAndInvoice.invoiceNumber": {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          "customerAndInvoice.phone": {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          "customerAndInvoice.GSTType": {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          "customerAndInvoice.billedBy": {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          "customerAndInvoice.updatedBy": {
            $regex: req.query.search,
            $options: "i",
          },
        },
        { "totalDetails.type": { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.startDate && req.query.endDate) {
      filters["customerAndInvoice.invoiceDate"] = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Total invoice count in DB (not affected by filters)
    const totalInvoices = await InvoiceModal.countDocuments();

    // Filtered aggregation
    const filteredSummary = await InvoiceModal.aggregate([
      { $match: filters }, // Apply filters if any
      {
        $group: {
          _id: null,
          filteredCount: { $sum: 1 },
          filteredTotalReceived: { $sum: "$totalDetails.receive" },
          filteredTotalRemaining: {
            $sum: "$totalDetails.remaining",
          },
        },
      },
    ]);

    // Default summary if no filtered invoices
    const summary = filteredSummary[0] || {
      filteredCount: 0,
      filteredTotalReceived: 0,
      filteredTotalRemaining: 0,
    };

    res.json({
      totalInvoices, // Total invoices count
      ...summary, // Filtered count and totals
    });
  } catch (err) {
    console.error("Error getting invoice summary:", err);
    res.status(500).json({ error: "Server error" });
  }
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
  invoicesummary,
};
