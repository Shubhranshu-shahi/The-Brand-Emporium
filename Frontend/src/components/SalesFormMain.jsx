import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, X } from "lucide-react";

import { currentDate, currentDateAndTime } from "../assets/helper/Helpers";
import { customerByPhone, customerInsert } from "../assets/helper/customerApi";
import { invoiceInsert } from "../assets/helper/InvoiceApi";
import { productById } from "../assets/helper/productApi";

import TotalSummaryCard from "./TotalSummaryCard";
import CustomerDetails from "./CustomerDetails";
import InvoiceDetails from "./InvoiceDetails";
import ProductTable from "./ProductTable";

function SalesFormMain() {
  const navigate = useNavigate();
  const lastInputRef = useRef(null);

  const [product, setProduct] = useState([]);
  const [errors, setErrors] = useState({
    phone: false,
    customerName: false,
  });
  const [rows, setRows] = useState([
    {
      items: 1,
      itemCode: "",
      productId: "",
      mrp: "",
      qty: "1",
      itemName: "",
      discountSale: "",
      sellingPrice: "",
      taxSale: "0",
      taxAmount: "",
      salePrice: "",
      show: false,
      purchasedPrice: "",
      discountAmount: "",
      purchasedWithQty: "",
    },
  ]);

  const [customerAndInvoice, setCustomerAndInvoice] = useState({
    customerName: "",
    phone: "",
    CustomerGstin: "",
    email: "",
    customerId: "",
    billedBy: localStorage.getItem("loggedInUser"),
    updatedBy: "",
    invoiceNumber: currentDateAndTime(),
    invoiceDate: currentDate(),
  });

  const [roundOff, setRoundOff] = useState(0);
  const [receive, setReceive] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [type, setType] = useState("Online");

  const totalAmount = rows.reduce(
    (sum, row) => sum + (parseFloat(row.sellingPrice) || 0),
    0
  );

  useEffect(() => {
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      if (lastRow.itemCode && lastRow.itemCode.length > 7) {
        searchByidProduct(lastRow.itemCode);
      }
    }
    if (lastInputRef.current) lastInputRef.current.focus();
  }, [rows.itemCode]);

  useEffect(() => {
    const newRoundOff = parseInt(totalAmount);
    setRoundOff(newRoundOff);
    setRemaining(newRoundOff - receive);
  }, [rows, totalAmount]);
  useEffect(() => {
    setRemaining(roundOff - receive);
  }, [roundOff]);

  const handleSubmit = async () => {
    const newErrors = {};

    if (!customerAndInvoice.phone || customerAndInvoice.phone.length !== 10) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!customerAndInvoice.customerName?.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitting customer:", customerAndInvoice);
      const cust = await customerInsert(customerAndInvoice);
      setCustomerAndInvoice({
        ...customerAndInvoice,
        customerId: cust._id,
      });
      const formData = {
        customerAndInvoice,
        rows,
        totalDetails: {
          total: totalAmount,
          roundOff,
          receive,
          remaining,
          type,
        },
      };

      const invoiceData = await invoiceInsert(formData);
      if (invoiceData) {
        navigate(`/invoice/${customerAndInvoice.invoiceNumber}`, {
          state: { id: customerAndInvoice.invoiceNumber },
        });
      }
      // Submit the form (API call or parent handler)
    }
  };

  const getCustomerByPhone = async (phone) => {
    const cust = await customerByPhone(phone);
    setCustomerAndInvoice((prev) => ({
      ...prev,
      customerName: cust.customerName || "",
      customerId: cust._id,
      email: cust.email || "",
      CustomerGstin: cust.CustomerGstin || "",
      phone,
    }));
  };

  const searchByidProduct = async (itemCode) => {
    const prod = await productById(itemCode);
    setProduct(prod);
    return prod;
  };

  return (
    <div className="p-2 w-full bg-white rounded-xl">
      <div className="overflow-x-auto min-w-full mx-auto bg-gray-50 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-black text-3xl">Sales</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <CustomerDetails
            customer={customerAndInvoice}
            setCustomer={setCustomerAndInvoice}
            getCustomerByPhone={getCustomerByPhone}
            errors={errors}
            setErrors={setErrors}
          />
          <div></div>
          <InvoiceDetails
            invoice={customerAndInvoice}
            setInvoice={setCustomerAndInvoice}
          />
        </div>

        <ProductTable
          rows={rows}
          setRows={setRows}
          product={product}
          setProduct={setProduct}
          lastInputRef={lastInputRef}
          searchByidProduct={searchByidProduct}
        />

        <div className="flex justify-between mt-4 items-start">
          <div className="flex-1">
            <TotalSummaryCard
              totalAmount={totalAmount}
              roundOff={roundOff}
              setRoundOff={setRoundOff}
              receive={receive}
              setReceive={setReceive}
              remaining={remaining}
              setRemaining={setRemaining}
              type={type}
              setType={setType}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-blue-500 px-4 py-2 rounded">Share</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesFormMain;
