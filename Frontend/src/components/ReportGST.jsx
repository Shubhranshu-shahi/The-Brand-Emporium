import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import React from "react";
import { dateToString } from "../assets/helper/Helpers";

function ReportGST({ invoices, title, flag }) {
  console.log("Invoices:", invoices);

  const exportGSTItemsToExcel = (invoices = []) => {
    if (!Array.isArray(invoices)) {
      console.error("Expected an array of invoices but got:", invoices);
      return;
    }
    const gstItems = [];
    invoices.forEach((invoice) => {
      invoice.rows?.forEach((item) => {
        if (flag == 1) {
          if (invoice.GSTType == "GST" && parseFloat(item.taxSale) > 0) {
            gstItems.push({
              InvoiceNumber: invoice.invoiceNumber,
              InvoiceDate: dateToString(invoice.invoiceDate),
              CustomerName: invoice.customerName,
              Phone: invoice.phone,
              ItemCode: item.itemCode,
              HSN: item.HSN || "",
              ItemName: item.itemName,
              Quantity: item.qty,
              MRP: item.mrp,
              SalePrice: item.salePrice,
              TaxableAmount: item.taxAmount,
              TaxPercent: item.taxSale,
              DiscountAmount: item.discountAmount,
              DiscountPercentage: item.discountSale,
              CGST: parseFloat(item.taxAmount / 2).toFixed(2) || 0,
              SGST: parseFloat(item.taxAmount / 2).toFixed(2) || 0,
              IGST: item.IGST || 0,
              Total: item.sellingPrice,
            });
          }
        } else {
          console.log("NON-GST");
          gstItems.push({
            InvoiceNumber: invoice.invoiceNumber,
            InvoiceDate: dateToString(invoice.invoiceDate),
            CustomerName: invoice.customerName,
            Phone: invoice.phone,
            ItemCode: item.itemCode,
            HSN: item.HSN || "",
            ItemName: item.itemName,
            Quantity: item.qty,
            MRP: item.mrp,
            SalePrice: item.salePrice,
            TaxableAmount: item.taxAmount,
            TaxPercent: item.taxSale,
            DiscountAmount: item.discountAmount,
            DiscountPercentage: item.discountSale,
            CGST: parseFloat(item.taxAmount / 2).toFixed(2) || 0,
            SGST: parseFloat(item.taxAmount / 2).toFixed(2) || 0,
            IGST: item.IGST || 0,
            Total: item.sellingPrice,
          });
        }
      });
    });
    console.log(gstItems, " get items ");
    return;
    // Export to Excel
    const worksheet = XLSX.utils.json_to_sheet(gstItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

    XLSX.writeFile(workbook, "GST_Report.xlsx");
  };

  return (
    <div>
      <button
        onClick={() => exportGSTItemsToExcel(invoices)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
      >
        {title}
      </button>
    </div>
  );
}

export default ReportGST;

// Flatten & filter GST items
