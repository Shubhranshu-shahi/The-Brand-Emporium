function InvoiceDetails({ invoice, setInvoice }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="font-semibold text-gray-700 mb-2">Invoice Details</h2>

      <label className="font-semibold text-gray-400">Invoice Number:</label>
      <input
        type="text"
        className="w-full p-2 border text-black rounded mb-2"
        name="invoiceNumber"
        value={invoice.invoiceNumber}
        onChange={(e) =>
          setInvoice({ ...invoice, invoiceNumber: e.target.value })
        }
        placeholder="Enter Invoice No."
      />

      <label className="font-semibold text-gray-400">Invoice Date:</label>
      <input
        type="date"
        name="invoiceDate"
        value={invoice.invoiceDate}
        onChange={(e) =>
          setInvoice({ ...invoice, invoiceDate: e.target.value })
        }
        className="w-full p-2 text-black border rounded"
      />
    </div>
  );
}

export default InvoiceDetails;
