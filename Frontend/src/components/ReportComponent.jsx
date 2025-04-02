import React, { useState, useEffect, useRef } from "react";
import "../assets/css/test.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Sample Data

const salesData = [
  {
    customerAndInvoice: {
      customerName: "Chocolate",
      phone: "1111111111",
      invoiceNumber: "31032025042027",
      invoiceDate: "2025-03-31T00:00:00.000Z",
    },
    totalDetails: {
      total: 500,
      roundOff: 500,
      receive: 0,
      remaining: 500,
    },
    rows: [
      {
        itemName: "testItem",
        itemCode: "374477683653074",
        mrp: "1000",
        discountSale: "50",
        salePrice: "440",
        taxSale: "12",
        sellingPrice: "500",
      },
    ],
  },
  {
    customerAndInvoice: {
      customerName: "Chocolate",
      phone: "1111111111",
      invoiceNumber: "31032025045518",
      invoiceDate: "2025-03-31T00:00:00.000Z",
    },
    totalDetails: {
      total: 500,
      roundOff: 500,
      receive: 0,
      remaining: 500,
    },
    rows: [
      {
        itemName: "testItem",
        itemCode: "374477683653074",
        mrp: "1000",
        discountSale: "50",
        salePrice: "440",
        taxSale: "12",
        sellingPrice: "500",
      },
    ],
  },
];

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("customerAndInvoice.customerName", {
    header: "Customer Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customerAndInvoice.phone", {
    header: "Phone",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customerAndInvoice.invoiceNumber", {
    header: "Invoice No",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customerAndInvoice.invoiceDate", {
    header: "Invoice Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("totalDetails.total", {
    header: "Total Amount",
    cell: (info) => `$${info.getValue()}`,
  }),
  columnHelper.accessor("rows", {
    header: "Items",
    cell: (info) => (
      <ul>
        {info.getValue().map((item, index) => (
          <li key={index}>
            {item.itemName} - ${item.sellingPrice}
          </li>
        ))}
      </ul>
    ),
  }),
];

function ReportComponent() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([...salesData]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const tableRef = useRef(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="container p-4">
      <form className="w-full mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2 text-gray-400" size={20} />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex items-center">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <span className="mx-2 text-gray-500">to</span>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <DownloadTableExcel
            filename="sales_report"
            sheet="report"
            currentTableRef={tableRef.current}
          >
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Export to Excel
            </button>
          </DownloadTableExcel>
        </div>
      </form>

      <table
        ref={tableRef}
        className="w-full border border-gray-200 rounded-lg"
      >
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left">
                  <div
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer flex items-center"
                        : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Items per page:
          <select
            className="ml-2 border rounded-md p-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportComponent;
