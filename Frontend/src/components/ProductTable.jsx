import { Eye, X } from "lucide-react";
import { useMemo } from "react";

function ProductTable({ rows, setRows, lastInputRef, searchByidProduct }) {
  const generateProductId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${timestamp}${randomNum}`;
  };
  const toggleShow = (index) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index ? { ...row, show: !row.show } : row
      )
    );
  };

  const handleInputChange = async (index, key, value) => {
    setRows((prevRows) => {
      let newRows = [...prevRows];
      let row = { ...newRows[index] };
      row[key] = value;
      newRows[index] = row;

      if (key === "itemCode" && value.trim() !== "" && value.length >= 12) {
        const existingIndex = newRows.findIndex(
          (r, i) => r.itemCode === value && i !== index
        );

        if (existingIndex !== -1) {
          newRows[existingIndex].qty = (
            parseInt(newRows[existingIndex].qty, 10) + 1
          ).toString();
          newRows = updateRowCalculations(newRows, existingIndex);
          newRows = newRows
            .filter((_, i) => i !== index)
            .map((r, i) => ({ ...r, items: i + 1 }));
          return newRows;
        } else {
          searchByidProduct(value).then((prod) => {
            if (prod) {
              newRows[index] = createNewRowData(newRows[index], prod);
              const updatedRows = newRows.map((r, i) => ({
                ...r,
                items: i + 1,
              }));
              setRows(updatedRows);
            }
          });
        }
      } else {
        if (
          ["discountSale", "taxSale", "mrp", "qty", "purchasedPrice"].includes(
            key
          )
        ) {
          newRows = updateRowCalculations(newRows, index);
        }
        newRows = newRows.map((r, i) => ({ ...r, items: i + 1 }));
        setRows(newRows);
      }

      return [...newRows];
    });
  };

  const createNewRowData = (row, prod) => {
    const qty = parseFloat(row.qty) || 1;
    const newMrp = prod.mrp * qty;
    const discountAmount = newMrp * (prod.discountSale / 100);
    const purchasedWithQty = (prod.purchasedPrice || 0) * qty;

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
      purchasedWithQty,
    };
  };

  const updateRowCalculations = (rows, index) => {
    let row = rows[index];
    const qty = parseFloat(row.qty) || 1;
    const mrp = parseFloat(row.mrp) || 0;
    const discount = parseFloat(row.discountSale) / 100 || 0;
    const taxSale = parseFloat(row.taxSale) || 0;

    const newMrp = mrp * qty;
    const sellingPrice = newMrp - newMrp * discount;
    const discountAmount = newMrp - sellingPrice;
    const taxAmount = sellingPrice * (taxSale / 100);
    const salePrice = sellingPrice - taxAmount;
    const purchasedWithQty = (row.purchasedPrice || 0) * qty;

    rows[index] = {
      ...row,
      productId: rows[index].productId || generateProductId(),
      sellingPrice,
      taxAmount,
      salePrice,
      discountAmount,
      purchasedWithQty,
    };

    return rows;
  };

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
      purchasedWithQty,
    };
    setRows([...rows, newRow]);

    setTimeout(() => {
      if (lastInputRef.current) {
        lastInputRef.current.focus();
      }
    }, 0);
  };

  const deleteRow = (index) => {
    if (rows.length > 1 && index !== 0) {
      const newRows = rows
        .filter((_, i) => i !== index)
        .map((r, i) => ({ ...r, items: i + 1 }));
      setRows(newRows);
    }
  };

  return (
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
                <td className="px-4 py-3 text-center border">{row.items}</td>
                <td className="px-4 py-3 border">
                  <input
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={row.itemCode}
                    onChange={(e) =>
                      handleInputChange(index, "itemCode", e.target.value)
                    }
                    ref={lastInputRef}
                  />
                </td>
                <td className="px-4 py-3 border">
                  <input
                    className="w-full p-2 border rounded-lg"
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
                    value={row.mrp}
                    onChange={(e) =>
                      handleInputChange(index, "mrp", e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-3 border w-24">
                  <input
                    className="w-full p-2 border rounded-lg text-center"
                    type="number"
                    value={row.qty}
                    onChange={(e) =>
                      handleInputChange(index, "qty", e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-3 border">
                  <input
                    className="w-full p-2 border rounded-lg"
                    placeholder="0"
                    value={row.discountSale}
                    onChange={(e) =>
                      handleInputChange(index, "discountSale", e.target.value)
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
                <td className="px-4 py-3 border w-32 text-center">
                  {row.show ? (
                    <div className="flex flex-col space-y-2">
                      <input
                        className="w-full p-2 border rounded-lg"
                        type="number"
                        value={row.purchasedPrice}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "purchasedPrice",
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() => toggleShow(index)}
                        className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"
                      >
                        Hide
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleShow(index)}
                      className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                    >
                      <Eye size={16} />
                    </button>
                  )}
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
              <td colSpan="4" className="px-4 py-4 border text-left">
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
                {rows.reduce((sum, row) => sum + Number(row.taxAmount || 0), 0)}
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Row
        </button>
      </div>
    </div>
  );
}

export default ProductTable;
