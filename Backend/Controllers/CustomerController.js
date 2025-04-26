const CustomerModal = require("../Modals/Customer");

const getAllCustomer = async (req, res) => {
  const customer = await CustomerModal.find({});
  res
    .status(200)
    .json({ message: "All Customer", success: true, data: customer });
};

const customerByID = async (req, res) => {
  try {
    const { id, phone } = req.params;

    let customer;

    customer = await CustomerModal.findOne({ phone: id });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    res
      .status(201)
      .json({ message: "Customer found", success: true, data: customer });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const customerInsert = async (req, res) => {
  try {
    const customer = req.body;

    const checkCustomer = await CustomerModal.findOne({
      phone: customer.phone,
    });

    if (checkCustomer) {
      checkCustomer.invoiceNumber.push(customer.invoiceNumber);
      checkCustomer.invoiceDate.push(customer.invoiceDate);
      const Updcustomer = await CustomerModal.findByIdAndUpdate(
        checkCustomer._id,
        checkCustomer,
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "Customer updated",
        success: true,
        data: checkCustomer,
      });
    } else {
      const customers = new CustomerModal(customer);
      await customers.save();
      return res
        .status(201)
        .json({ message: "Customer Inserted", success: true, data: customers });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const customerDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerModal.findByIdAndDelete({ _id: id });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    return res
      .status(200)
      .json({ message: "Customer delete Successfully", success: false });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const customerUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const cust = req.body;

    cust.updatedAt = new Date();

    const customer = await CustomerModal.findByIdAndUpdate(id, cust, {
      new: true,
    });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    res
      .status(200)
      .json({ message: "Customer updated", success: true, data: customer });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
module.exports = {
  getAllCustomer,
  customerByID,
  customerInsert,
  customerUpdate,
  customerDelete,
};
