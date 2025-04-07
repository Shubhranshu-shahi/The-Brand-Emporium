import React, { useState } from "react";
import { numberToWords } from "../assets/helper/Helpers";
import { invoiceGenrate } from "../assets/helper/InvoiceApi";
import logo from "../img/logo.jpeg";
import sign from "../img/sign.jpeg";
import { Mail, MapPin, PhoneCall } from "lucide-react";

function InvoiceBill({ id, pdf }) {
  const [inv, setInv] = useState({
    rows: [],
    customerAndInvoice: {},
    totalDetails: {},
  });
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  console.log(id, "-------id");

  const [totalgstAmount, setTotalgstAmount] = useState(0);
  const calculateGST = () => {
    if (!inv.rows.length) return;
    let totalSgst = 0;
    let totalCgst = 0;

    let gstTotalAmount = 0;

    inv.rows.forEach((item) => {
      const totalTaxAmount = (item.taxSale / 100) * item.sellingPrice;
      gstTotalAmount += totalTaxAmount;
      totalSgst += totalTaxAmount / 2;
      totalCgst += totalTaxAmount / 2;
    });

    setSgst(totalSgst.toFixed(2));
    setCgst(totalCgst.toFixed(2));
    setTotalgstAmount(gstTotalAmount);
  };

  const [discountAm, setDiscountAm] = useState(0);

  const calDiscount = () => {
    let diff = 0;
    if (inv.rows.length) {
      inv.rows.forEach((item) => {
        const totalDiffAmount = item.mrp * item.qty - item.sellingPrice;
        diff += totalDiffAmount;
      });

      setDiscountAm(diff.toFixed(2));
    }
  };

  const getinvoice = async () => {
    console.log("Fetching invoice...");
    try {
      const invoice = await invoiceGenrate(id); // Ensure API is awaited
      if (invoice) {
        setInv(invoice);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  React.useEffect(() => {
    getinvoice();
  }, [id]);

  React.useEffect(() => {
    if (inv.rows.length > 0) {
      calculateGST();
      calDiscount();
    }
  }, [inv]);

  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      await getinvoice();
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center p-6">Loading Invoice...</div>;
  }

  return (
    <div className="bg-gray-100 p-6 text-black">
      <div className="max-w-6xl mt-8 mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex flex-wrap  text-sm md:text-base">
          <div className="bg-[#0f1316] w-full md:w-1/4 flex justify-center p-2">
            <img src={logo} className="h-16" alt="Logo" />
          </div>
          <div className="bg-red-600 gap-2 font-sans w-full md:w-3/4 text-white p-4 flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="flex items-center text-sm md:text-base">
              <PhoneCall className="mr-2" /> 9519708116
            </p>
            <p className="flex items-center text-sm md:text-base">
              <Mail className="mr-2 w-10" />
              thebrandemporiumenterprise@gmail.com
            </p>
            <p className="flex items-center text-sm md:text-base">
              <MapPin className="mr-2" /> L-II/9/F Sector-F Kanpur Road, Lucknow
            </p>
          </div>
        </div>
        <div className="p-4 font-sans bg-[#0f1316] text-gray-100  md:rounded-r-full text-center md:text-left text-sm w-full md:text-base md:w-4/6">
          <h1 className="text-xl font-bold">The Brand Emporium Enterprise</h1>
          <p>GSTIN: 09AAWFT0842R1Z4</p>
          <p>State: 09 - Uttar Pradesh</p>
        </div>
        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 text-sm md:text-base">
          <div className="md:col-span-2">
            <h3 className="text-red-500 font-bold">Bill To:</h3>
            <p>
              <strong>Name:</strong> {inv.customerAndInvoice.customerName}
            </p>
            <p>
              <strong>Contact No.:</strong> {inv.customerAndInvoice.phone}
            </p>
            {inv.customerAndInvoice.CustomerGstin && (
              <p>
                <strong>GSTIN:</strong> {inv.customerAndInvoice.CustomerGstin}
              </p>
            )}
          </div>
          <div className="md:col-span-4">
            <h2 className="text-lg font-semibold">Tax Invoice</h2>
            <p>
              <strong>Invoice No:</strong>{" "}
              {inv.customerAndInvoice.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(inv.customerAndInvoice.invoiceDate).toDateString()}
            </p>
          </div>
        </div>
        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4 text-sm md:text-base">
            <thead>
              <tr className="bg-[#0f1316] text-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Item Name</th>
                <th className="border p-2">HSN/SAC</th>
                <th className="border p-2">MRP</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price/Unit</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2">Discount Amount</th>
                <th className="border p-2">GST</th>
                <th className="border p-2">GST Amount</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.rows.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">
                    {item.itemName} {item.itemCode ? item.itemCode : ""}
                  </td>
                  <td className="border p-2"></td>
                  <td className="border p-2 text-right">₹ {item.mrp}</td>
                  <td className="border p-2 text-right">{item.qty}</td>
                  <td className="border p-2 text-right">₹ {item.salePrice}</td>
                  <td className="border p-2 text-right">
                    ₹ {item.discountAmount}
                  </td>
                  <td className="border p-2 text-right">
                    ₹ {item.discountSale} %
                  </td>
                  <td className="border p-2 text-right">% {item.taxSale}</td>
                  <td className="border p-2 text-right">
                    ₹ {(item.taxSale / 100) * item.sellingPrice}
                  </td>
                  <td className="border p-2 text-right font-bold">
                    ₹ {item.sellingPrice}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan="3" className="border p-2 text-left">
                  Total:
                </td>
                <td colSpan="1" className="border p-2 text-right">
                  ₹ {inv.rows.reduce((sum, row) => sum + Number(row.mrp), 0)}
                </td>
                <td className="border p-2 text-right">
                  {inv.rows.reduce((sum, row) => sum + Number(row.qty || 0), 0)}
                </td>
                <td></td>
                <td className="border p-2 text-right">₹ {discountAm}</td>
                <td></td>
                <td></td>
                <td className="border p-2 text-right">₹ {totalgstAmount}</td>
                <td className="border p-2 text-right">
                  ₹{" "}
                  {inv.rows.reduce(
                    (sum, row) => sum + Number(row.sellingPrice || 0),
                    0
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* Summary Section */}
        <div className="mt-4 p-4 border bg-gray-100 text-sm md:text-right text-center  md:text-base">
          <p>
            <strong>Sub Total:</strong> ₹ {inv.totalDetails.total}
          </p>
          <p>
            <strong>Discount:</strong> ₹ {discountAm}
          </p>
          <p>
            <strong>SGST :</strong> ₹ {sgst}
          </p>
          <p>
            <strong>CGST :</strong> ₹ {cgst}
          </p>
          <p>
            <strong>Round Off:</strong> ₹ {inv.totalDetails.roundOff}
          </p>
          <p className="pt-1 pb-1 text-xl font-bold text-blue-700">
            <strong>Total: ₹ {inv.totalDetails.roundOff} </strong>
          </p>
          <p>
            <strong>Received:</strong> ₹ {inv.totalDetails.receive}
          </p>
          <p>
            <strong>Balance:</strong> ₹{" "}
            {inv.totalDetails.roundOff - inv.totalDetails.receive}
          </p>
          <p className="text-green-600 font-bold">
            <strong>You Saved:</strong> ₹ {discountAm}
          </p>
        </div>
        {/* Invoice Amount In Words */}
        <div className="mt-4 p-4">
          <p>
            <strong className="text-red-600">Invoice Amount In Words:</strong>
          </p>
          <p>
            {inv.totalDetails.roundOff
              ? numberToWords(parseInt(inv.totalDetails.roundOff))
              : "N/A"}{" "}
          </p>
        </div>
        {/* Terms and Conditions */}
        <div className="mt-4 p-4 border-t">
          <p className="font-bold text-red-600">Terms And Conditions</p>
          <p>No return nor refund.</p>
        </div>
        {/* Footer */}
        <div className="mt-8 flex justify-end items-end flex-col text-right">
          <p className="mb-1">For: The Brand Emporium Enterprise</p>
          <img src={sign} alt="Authorized Sign" className="h-16 mb-1" />
          <p className="font-bold">Authorized Signatory</p>
        </div>
        <div className="mt-4 p-4 text-left">
          <button onClick={pdf} className="hover:text-blue-600">
            Download invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceBill;
