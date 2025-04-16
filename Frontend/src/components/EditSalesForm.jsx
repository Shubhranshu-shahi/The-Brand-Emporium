import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceGenrate, updateInvoice } from "../assets/helper/InvoiceApi";

import CustomerDetails from "./CustomerDetails";
import InvoiceDetails from "./InvoiceDetails";
import ProductTable from "./ProductTable";
import TotalSummaryCard from "./TotalSummaryCard";
import { productById } from "../assets/helper/productApi";

export default function EditSalesForm({ invoiceNumber }) {
  const navigate = useNavigate();
  const lastInputRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState([]);
  const [customerAndInvoice, setCustomerAndInvoice] = useState({});
  const [roundOff, setRoundOff] = useState(0);
  const [receive, setReceive] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [type, setType] = useState("Online");

  const totalAmount = rows.reduce(
    (sum, row) => sum + (parseFloat(row.sellingPrice) || 0),
    0
  );

  const searchByidProduct = async (itemCode) => {
    const prod = await productById(itemCode);
    setProduct(prod);
    return prod;
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      const invoice = await invoiceGenrate(invoiceNumber);
      if (invoice) {
        setCustomerAndInvoice(invoice.customerAndInvoice);
        setRows(invoice.rows);
        setRoundOff(invoice.totalDetails.roundOff);
        setReceive(invoice.totalDetails.receive);
        setRemaining(invoice.totalDetails.remaining);
        setType(invoice.totalDetails.type);
      }
    };

    fetchInvoice();
  }, [invoiceNumber]);
  const updatedBy = localStorage.getItem("loggedInUser");
  const handleUpdate = async () => {
    const sanitizedRows = rows.map((row) => {
      const { purchasedPrice = 0, qty = 1 } = row;
      const purchasedWithQty = row.purchasedWithQty ?? purchasedPrice * qty;

      return {
        ...row,
        purchasedWithQty,
      };
    });
    const formData = {
      customerAndInvoice: {
        ...customerAndInvoice,
        updatedBy,
      },
      rows: sanitizedRows,
      totalDetails: {
        total: totalAmount,
        roundOff,
        receive,
        remaining,
        type,
      },
    };
    // console.log("Form Data:", formData);
    console.log("Invoice Number:", invoiceNumber);
    const result = await updateInvoice(invoiceNumber, formData);
    if (result) {
      navigate(`/invoice/${invoiceNumber}`, {
        state: { id: invoiceNumber },
      });
    }
  };
  useEffect(() => {
    const newRoundOff = totalAmount;
    setRoundOff(newRoundOff);
    setRemaining(newRoundOff - receive);
  }, [rows, totalAmount, receive]);

  return (
    <div className="p-2 w-full bg-white rounded-xl">
      <div className="overflow-x-auto min-w-full mx-auto bg-gray-50 p-6 rounded-lg shadow-lg">
        <h1 className="font-bold text-black text-3xl mb-4">Edit Invoice</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <CustomerDetails
            customer={customerAndInvoice}
            setCustomer={setCustomerAndInvoice}
            getCustomerByPhone={() => {}}
            errors={() => {}}
            setErrors={() => {}}
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
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Update Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
