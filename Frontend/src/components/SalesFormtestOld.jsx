import { Eye, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { productById } from "../assets/helper/productApi";
import { currentDate, currentDateAndTime } from "../assets/helper/Helpers";
import { customerByPhone, customerInsert } from "../assets/helper/customerApi";
import { invoiceInsert } from "../assets/helper/InvoiceApi";

function SalesFormtestOld() {
  const [product, setProduct] = useState([]);

  let navigate = useNavigate();
  //for rows of tables
  const [rows, setRows] = useState([
    {
      items: 1,
      itemCode: "",
      productId: "",
      mrp: "",
      qty: "1",
      itemName: "",
      discountSale: "0",
      sellingPrice: "",
      taxSale: "0",
      taxAmount: "",
      salePrice: "",
      show: false,
      purchasedPrice: "",
      discountAmount: "",
    },
  ]);
  const lastInputRef = useRef(null);

  // to barcode scanner to search a product
  const searchByidProduct = async (itemCode) => {
    const prod = await productById(itemCode);
    setProduct(prod);
    // console.log("Fetched Product:", prod);
    return prod;
  };

  useEffect(() => {
    // to not call an api at the empty searial no
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      if (lastRow.itemCode && lastRow.itemCode.length > 7) {
        searchByidProduct(lastRow.itemCode);
      }
    }

    if (lastInputRef.current) {
      lastInputRef.current.focus();
    }
  }, [rows.itemCode]);

  // round will set at render
  useEffect(() => {
    setRoundOff(totalAmount);
  }, [rows]);

  const handleRoundOffChange = (event) => {
    const value = event.target.value;
    setRoundOff(value);
  };

  // add another row
  const addRow = () => {
    const newRow = {
      items: rows.length + 1,
      itemCode: "",
      mrp: "",
      itemName: "",
      qty: "1",
      productId: "",
      discountSale: "0",
      sellingPrice: "",
      taxSale: "0",
      taxAmount: "",
      salePrice: "",
      show: false,
      purchasedPrice: "",
      discountAmount: "",
    };
    setRows([...rows, newRow]);

    setTimeout(() => {
      if (lastInputRef.current) {
        lastInputRef.current.focus();
      }
    }, 0);
  };

  // to delete exiting row
  const deleteRow = (index) => {
    if (rows.length > 1 && index !== 0) {
      const newRows = rows.filter((_, i) => i !== index);
      // Reassign item numbers after deletion
      const updatedRows = newRows.map((row, i) => ({
        ...row,
        items: i + 1, // Reassign item numbers sequentially
      }));
      setRows(updatedRows);
    }
  };
  const generateProductId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${timestamp}${randomNum}`;
  };
  // to handle tables input changes
  const handleInputChange = async (index, key, value) => {
    setRows((prevRows) => {
      let newRows = [...prevRows];

      // Create a new object to avoid direct mutation
      let row = { ...newRows[index] };

      // Always update the input field in state first
      row[key] = value;
      newRows[index] = row;
      setRows([...newRows]);

      if (key === "itemCode" && value.trim() !== "" && value.length >= 12) {
        const existingIndex = newRows.findIndex(
          (r, i) => r.itemCode === value && i !== index
        );

        if (existingIndex !== -1) {
          // Merge quantities
          newRows[existingIndex].qty = (
            parseInt(newRows[existingIndex].qty, 10) + 1
          ).toString();
          newRows = updateRowCalculations(newRows, existingIndex);

          // Remove the duplicate row and reassign item numbers
          newRows = newRows
            .filter((_, i) => i !== index)
            .map((r, i) => ({
              ...r,
              items: i + 1, // Ensure sequential numbering
            }));

          return newRows;
        } else {
          // Proceed with async API call
          searchByidProduct(value)
            .then((prod) => {
              if (prod) {
                // Update row with the product data received from the API
                newRows[index] = createNewRowData(newRows[index], prod);

                // Reassign item numbers correctly after API call
                const updatedRows = newRows.map((r, i) => ({
                  ...r,
                  items: i + 1,
                }));
                // Update state after API success
                setRows(updatedRows);
              }
            })
            .catch((err) => {
              console.error("API Error:", err);

              // ---API Error: Preserve user input---
              // Keep the itemCode and other fields the user typed.
              row.itemCode = value; // Retain the user-typed itemCode
              newRows[index] = row;
              console.log(row);
              // Reassign item numbers correctly after an error
              newRows = newRows.map((r, i) => ({
                ...r,
                items: i + 1,
              }));

              setRows([...newRows]); // Update state with preserved user input
            });
        }
      } else {
        // Handle other keys and update values
        row[key] = value;
        newRows[index] = row;

        // Update row calculations for specific keys
        if (["discountSale", "taxSale", "mrp", "qty"].includes(key)) {
          newRows = updateRowCalculations(newRows, index);
        }

        // Reassign item numbers before returning
        newRows = newRows.map((r, i) => ({
          ...r,
          items: i + 1,
        }));
        setRows(newRows);
      }

      return [...newRows]; // Ensure we return updated rows
    });
  };

  const createNewRowData = (row, prod) => {
    const qty = parseFloat(row.qty) || 1;
    const newMrp = prod.mrp * qty;
    const discountAmount = newMrp * (prod.discountSale / 100);

    return {
      ...row,
      mrp: prod.mrp || "",
      productId: prod._id,
      itemName: prod.itemName,
      discountSale: prod.discountSale || "",
      sellingPrice: prod.sellingPrice || "",
      taxSale: prod.taxSale || "0",
      taxAmount: (prod.sellingPrice || 0) * ((prod.taxSale || 100) / 100),
      salePrice: prod.salePrice || "",
      itemCode: prod.itemCode,
      purchasedPrice: prod.purchasedPrice,
      discountAmount,
    };
  };

  const updateRowCalculations = (rows, index) => {
    let row = rows[index];
    const qty = parseFloat(row.qty) || 1;
    const mrp = parseFloat(row.mrp) || 0;
    const discount = parseFloat(row.discountSale) || 0;

    const taxSale = parseFloat(row.taxSale) || 0;

    const newMrp = mrp * qty;

    const sellingPrice = newMrp * ((discount || 100) / 100);
    const discountAmount = newMrp - sellingPrice;
    const taxAmount = sellingPrice * (taxSale / 100);
    const salePrice = sellingPrice - taxAmount;

    console.log(newMrp, "-----new mrp");
    console.log(discount, "-----discount");
    console.log(sellingPrice, "-----selling price");

    rows[index] = {
      ...row,
      productId: rows[index].productId || generateProductId(),
      sellingPrice,
      taxAmount,
      salePrice,
      discountAmount,
    };

    return rows;
  };

  const [customerAndInvoice, setCustomerAndInvoice] = useState({
    customerName: "",
    phone: "",
    CustomerGstin: "",
    customerEmail: "",
    customerId: "",
    invoiceNumber: currentDateAndTime(),
    invoiceDate: currentDate(),
  });

  // to gether everyinformation at the time of save
  const handleSubmit = async () => {
    const formData = {
      customerAndInvoice,
      rows,
      totalDetails: {
        total: totalAmount,
        roundOff: roundOff,
        receive: receive,
        remaining: remaining,
        type,
      },
    };

    const invoiceData = await invoiceInsert(formData);
    if (invoiceData) {
      const cust = await customerInsert(customerAndInvoice);
      setCustomerAndInvoice({ ...customerAndInvoice, customerId: cust._id });

      console.log("Submitted Data:", JSON.stringify(formData, null, 2));
      console.log(invoiceData);
      console.log(`/invoice/${customerAndInvoice.invoiceNumber}`);

      navigate(`/invoice/${customerAndInvoice.invoiceNumber}`, {
        state: { id: customerAndInvoice.invoiceNumber },
      });
      alert("Data saved! Check the console.");
    }
  };

  // to show the purchase price or not to show toggle
  const toggleShow = (index) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, show: !row.show } : row
      )
    );
  };

  // for total calculation
  const totalAmount = rows.reduce(
    (sum, row) => sum + (parseFloat(row.sellingPrice) || 0),
    0
  );
  // Calculate Total Quantity
  const totalQty = rows.reduce((sum, row) => sum + Number(row.qty), 0);

  // Calculate Total Amount

  // total states
  const [roundOff, setRoundOff] = useState(totalAmount);
  const [receive, setReceive] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [type, setType] = useState("Online");

  //check get customer by number
  const getCustomerByPhone = async (phone) => {
    const cust = await customerByPhone(phone);

    setCustomerAndInvoice((prevState) => ({
      ...prevState,
      customerName: cust.customerName || "",
      customerId: cust._id,
      email: cust.email || "",
      phone,
    }));
    console.log(cust, "---customer");
  };

  return (
    <div className="flex w-full items-center justify-center mt-2">
      <div class="p-2 w-full bg-white rounded-xl">
        <div class="overflow-x-auto min-w-full mx-auto bg-gray-50 p-6 rounded-lg shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h1 class="font-bold text-black text-3xl">Sales</h1>
          </div>
          {/* Customer & Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Customer Details */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="font-semibold text-gray-700 mb-2">
                Customer Details
              </h2>
              <label className="block font-semibold text-gray-400">
                Customer
              </label>
              <input
                id="CustomerId"
                name="customerName"
                className="w-full p-2 border text-black rounded border-amber-600"
                onChange={(e) =>
                  setCustomerAndInvoice({
                    ...customerAndInvoice,
                    customerName: e.target.value,
                  })
                }
                value={customerAndInvoice.customerName}
              />

              <label className="block font-semibold text-gray-400 mt-2">
                Phone No.
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                onChange={(e) => {
                  setCustomerAndInvoice({
                    ...customerAndInvoice,
                    phone: e.target.value,
                  });
                  if (
                    e.target.value.trim() !== "" &&
                    e.target.value.length > 9 &&
                    e.target.value.length < 11
                  ) {
                    getCustomerByPhone(e.target.value);
                  }
                }}
                value={customerAndInvoice.phone}
                className="w-full p-2 text-black border rounded"
                placeholder="Phone No."
              />

              <label className="block font-semibold text-gray-400 mt-1">
                Customer GSTIN
              </label>
              <input
                id="CustomerGstin"
                name="CustomerGstin"
                className="w-full p-2 border text-black rounded border-amber-600"
                onChange={(e) =>
                  setCustomerAndInvoice({
                    ...customerAndInvoice,
                    CustomerGstin: e.target.value,
                  })
                }
                value={customerAndInvoice.CustomerGstin}
              />
              <label className="block font-semibold text-gray-400 mt-1">
                Customer Email
              </label>
              <input
                id="CustomerGstin"
                name="CustomerGstin"
                className="w-full p-2 border text-black rounded border-amber-600"
                onChange={(e) =>
                  setCustomerAndInvoice({
                    ...customerAndInvoice,
                    customerEmail: e.target.value,
                  })
                }
                value={customerAndInvoice.customerEmail}
              />
            </div>
            <div></div>

            {/* Invoice Details */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="font-semibold text-gray-700 mb-2">
                Invoice Details
              </h2>
              <label className="font-semibold text-gray-400">
                Invoice Number:
              </label>
              <input
                type="text"
                className="w-full p-2 border text-black rounded mb-2"
                name="invoiceinvoiceNumberNum"
                value={customerAndInvoice.invoiceNumber}
                onChange={(e) =>
                  setCustomerAndInvoice({
                    ...customerAndInvoice,
                    invoiceNumber: e.target.value,
                  })
                }
                placeholder="Enter Invoice No."
              />
              <label className="font-semibold text-gray-400">
                Invoice Date:
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={customerAndInvoice.invoiceDate}
                onChange={(e) =>
                  setCustomerAndInvoice({
                    ...customerAndInvoice,
                    invoiceDate: e.target.value,
                  })
                }
                className="w-full p-2 text-black border rounded"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700 bg-white">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                    {[
                      "Item",
                      "Item Code",
                      "Product Name",
                      "MRP",
                      "Qty",
                      "Discount %",
                      "Discount Amount",
                      "Tax %",
                      "Tax Amount",
                      "Price",
                      "Amount",
                      "Show",
                      "Action",
                    ].map((header) => (
                      <th key={header} className="px-4 py-3 border">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.items}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 text-center border">
                        {row.items}
                      </td>

                      <td className="px-4 py-3 border">
                        <input
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={row.itemCode}
                          onChange={(e) =>
                            handleInputChange(index, "itemCode", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border">
                        <input
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={row.itemName}
                          onChange={(e) =>
                            handleInputChange(index, "itemName", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border">
                        <input
                          className="w-full p-2 border rounded-lg"
                          type="number"
                          min="0"
                          value={row.mrp}
                          onChange={(e) =>
                            handleInputChange(index, "mrp", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border">
                        <input
                          className="w-full p-2 border rounded-lg"
                          type="number"
                          min="0"
                          value={row.qty}
                          onChange={(e) =>
                            handleInputChange(index, "qty", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-4 py-3 border">
                        <input
                          className="w-full p-2 border rounded-lg"
                          value={row.discountSale}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "discountSale",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td className="px-4 py-3 text-center border">
                        {row.discountAmount}
                      </td>

                      <td className="px-4 py-3 border w-28">
                        <select
                          className="w-full p-2 border rounded-lg text-center"
                          value={row.taxSale}
                          onChange={(e) =>
                            handleInputChange(index, "taxSale", e.target.value)
                          }
                        >
                          {["0", "5", "12", "18", "28"].map((tax) => (
                            <option key={tax} value={tax}>
                              {tax}%
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3 text-center border">
                        {row.taxAmount}
                      </td>
                      <td className="px-4 py-3 text-center border">
                        {row.salePrice}
                      </td>
                      <td className="px-4 py-3 font-semibold text-center border">
                        {row.sellingPrice}
                      </td>

                      <td className="px-4 py-3 text-center border">
                        <button
                          onClick={() => toggleShow(index)}
                          className={`w-10 h-8 rounded-lg flex items-center justify-center ${
                            row.show
                              ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {row.show ? row.purchasedPrice : <Eye size={16} />}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-center border">
                        {rows.length > 1 && index !== 0 && (
                          <button
                            onClick={() => deleteRow(index)}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
                            title="Delete Row"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-gray-100 font-medium">
                  <tr>
                    <td colSpan="4" className="px-4 py-2 border text-left">
                      Total:
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {rows.reduce((sum, row) => sum + Number(row.qty), 0)}
                    </td>
                    <td />
                    <td className="px-4 py-2 border text-center">
                      {rows.reduce(
                        (sum, row) => sum + Number(row.discountAmount || 0),
                        0
                      )}
                    </td>
                    <td />
                    <td className="px-4 py-2 border text-center">
                      {rows.reduce(
                        (sum, row) => sum + Number(row.taxAmount || 0),
                        0
                      )}
                    </td>
                    <td />
                    <td className="px-4 py-2 border text-center">
                      {rows.reduce(
                        (sum, row) => sum + Number(row.sellingPrice || 0),
                        0
                      )}
                    </td>
                    <td colSpan="2" />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={addRow}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Row
              </button>
            </div>
          </div>

          <div class="flex justify-between mt-4 items-center">
            {/* to work on  */}
            {/* ---------------------------------------------------- */}
            <div className="flex-1">
              <div className="flex justify-start"></div>

              <div className="flex justify-end mt-4">
                <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg md:w-1/4 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg">₹ {totalAmount.toFixed(2)}</span>
                  </div>

                  {/* Round Off with Input */}
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center space-x-2">
                      <span className="font-semibold">Round Off:</span>
                    </label>
                    <input
                      type="text"
                      min="0"
                      className="w-1/3 p-1 text-white border rounded"
                      placeholder="0.00"
                      //   value={roundOff}
                      //   onChange={(e) => setRoundOff(e.target.value)}
                      value={roundOff}
                      onChange={handleRoundOffChange}
                      onKeyDown={(e) =>
                        ["e", "E", "-", "+"].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                  </div>

                  {/* Receive with Input */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Receive:</span>
                    <input
                      type="text"
                      min="0"
                      className="w-1/3 p-1 text-white border rounded"
                      placeholder="0.00"
                      onChange={(e) => {
                        setReceive(e.target.value);

                        setRemaining(
                          parseFloat(roundOff) - parseFloat(e.target.value || 0)
                        );
                      }}
                      value={receive}
                      onKeyDown={(e) =>
                        ["e", "E", "-", "+"].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Type:</span>
                    <select
                      className="w-1/3 p-2 border rounded-lg text-center"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      {["Online", "Cash"].map((tax) => (
                        <option key={tax} value={tax} className="text-black">
                          {tax}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-semibold">Remaining:</span>
                    <span className="text-lg">₹ {remaining}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------- */}
          </div>

          <div class="flex justify-end mt-4 space-x-2">
            <button class="bg-blue-500 px-4 py-2 rounded">Share</button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesFormtestOld;
