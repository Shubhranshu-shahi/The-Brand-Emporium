import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs"; // Import ExcelJS
import { base_url } from "../assets/helper/BASEURL";

const InvoiceNew = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch data with pagination and filters
  const fetchData = async () => {
    setIsLoading(true);
    const apiEndpoint = "http://localhost:8080/invoice/invoices";
    try {
      const response = await axios.get(`${base_url}invoice/reports/invoices`, {
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...filters,
        },
      });

      setData(response.data.invoices);
      setPagination((prev) => ({ ...prev, total: response.data.total }));
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalInvoice = data.reduce(
      (sum, invoice) => sum + (invoice.totalDetails.roundOff || 0),
      0
    );
    const totalReceived = data.reduce(
      (sum, invoice) => sum + (invoice.totalDetails.received || 0),
      0
    );
    const totalRemaining = data.reduce(
      (sum, invoice) =>
        sum +
        (invoice.totalDetails.roundOff - invoice.totalDetails.received || 0),
      0
    );
    return {
      totalInvoice,
      totalReceived,
      totalRemaining,
    };
  };

  // Export to Excel using ExcelJS
  const handleExportExcel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${base_url}invoice/export`, {
        params: filters,
      });

      const invoicesForExport = response.data.invoices;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Invoices");

      worksheet.columns = [
        { header: "Invoice Number", key: "invoiceNumber", width: 20 },
        { header: "Customer Name", key: "customerName", width: 30 },
        { header: "Invoice Date", key: "invoiceDate", width: 20 },
        { header: "Total", key: "total", width: 15 },
      ];

      invoicesForExport.forEach((invoice) => {
        worksheet.addRow({
          invoiceNumber: invoice.customerAndInvoice?.invoiceNumber || "",
          customerName: invoice.customerAndInvoice?.customerName || "",
          invoiceDate: invoice.customerAndInvoice?.invoiceDate
            ? new Date(
                invoice.customerAndInvoice.invoiceDate
              ).toLocaleDateString()
            : "",
          total: invoice.totalDetails?.roundOff || "",
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoices.xlsx";
      link.click();

      setIsLoading(false);
    } catch (error) {
      console.error("Error exporting invoice data to Excel:", error);
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch data on filter change
  useEffect(() => {
    fetchData();
  }, [filters, pagination.page]);

  const { totalInvoice, totalReceived, totalRemaining } = calculateTotals();

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search by customer or invoice number..."
          value={filters.search}
          onChange={handleFilterChange}
          className="p-2 w-full md:w-1/3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 w-1/3 md:w-1/6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 w-1/3 md:w-1/6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleExportExcel}
          disabled={isLoading}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          {isLoading ? "Exporting..." : "Export to Excel"}
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && <div>Loading...</div>}

      {/* Table for displaying invoices */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2 text-left font-semibold">
              Invoice Number
            </th>
            <th className="px-4 py-2 text-left font-semibold">Customer Name</th>
            <th className="px-4 py-2 text-left font-semibold">Invoice Date</th>
            <th className="px-4 py-2 text-left font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((invoice) => (
            <tr
              key={invoice.customerAndInvoice.invoiceNumber}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-4 py-2 border-t text-sm text-gray-800">
                {invoice.customerAndInvoice.invoiceNumber}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-800">
                {invoice.customerAndInvoice.customerName}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-800">
                {new Date(
                  invoice.customerAndInvoice.invoiceDate
                ).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-t text-sm text-gray-800">
                {invoice.totalDetails.roundOff}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="font-semibold">Total Invoices:</span>
          <span>{totalInvoice.toFixed(2)}</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="font-semibold">Total Received:</span>
          <span>{totalReceived.toFixed(2)}</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="font-semibold">Total Remaining:</span>
          <span>{totalRemaining.toFixed(2)}</span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex space-x-4">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page * pagination.pageSize >= pagination.total}
            className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceNew;
