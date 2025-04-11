import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceGenrate, updateInvoice } from "../assets/helper/InvoiceApi";

import CustomerDetails from "./CustomerDetails";
import InvoiceDetails from "./InvoiceDetails";
import ProductTable from "./ProductTable";
import TotalSummaryCard from "./TotalSummaryCard";

export default function EditSalesForm() {
  const { invoiceNumber } = useParams();
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

  const handleUpdate = async () => {
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

    const result = await updateInvoice(invoiceNumber, formData);
    if (result) {
      navigate(`/invoice/${invoiceNumber}`, { state: { id: invoiceNumber } });
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
          searchByidProduct={() => {}}
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
