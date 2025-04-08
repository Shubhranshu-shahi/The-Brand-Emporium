import React, { useState, useEffect, useRef } from "react";
import "../assets/css/test.css";
import { downloadExcel, DownloadTableExcel } from "react-export-table-to-excel";

import DatePicker from "react-datepicker";
import ReactToPrint from "react-to-print";

import "react-datepicker/dist/react-datepicker.css";
// import salesData from "../data/salestableData.json";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import { getAllInvoice, invoiceGenrate } from "../assets/helper/InvoiceApi";

const columnHelper = createColumnHelper();

function ReportComponent() {
  const [data, setData] = useState([]);

  const allInvoice = async () => {
    try {
      const salesData = await getAllInvoice();
      // console.log(salesData, "-----")

      const formattedData = salesData.map((entry, index) => ({
        "#": index + 1,
        customerName: entry.customerAndInvoice.customerName,
        phone: entry.customerAndInvoice.phone,
        invoiceNumber: entry.customerAndInvoice.invoiceNumber,
        invoiceDate: new Date(
          entry.customerAndInvoice.invoiceDate
        ).toLocaleDateString(),
        total: entry.totalDetails.total,
        roundOff: entry.totalDetails.roundOff,
        receive: entry.totalDetails.receive,
        remaining: entry.totalDetails.remaining,
        _id: entry._id,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };
  useEffect(() => {
    allInvoice();
  }, []);
  const columns = [
    { accessorKey: "#", header: "#" },
    { accessorKey: "customerName", header: "Customer Name" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "invoiceNumber", header: "Invoice No." },
    { accessorKey: "invoiceDate", header: "Invoice Date" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "roundOff", header: "Round Off" },
    { accessorKey: "receive", header: "Received" },
    {
      accessorKey: "remaining",
      header: "Remaining",
      cell: ({ row }) => {
        const value = row.original.remaining;
        return (
          <span
            className={
              value > 0 ? "text-red-500 font-semibold" : "text-green-600"
            }
          >
            {value}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleView(rowData)}
              className="text-blue-600 hover:underline"
            >
              View
            </button>

            <button
              onClick={() => handleDelete(rowData._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  //   const [salesDatas, setSalesDatas] = useState(salesDatass);
  // const [data] = useState([...salesDatass]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState([]);
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

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const handleView = (data) => {
    console.log("Viewing invoice:", data);
    const url = `/invoice/${data.invoiceNumber}`;
    window.open(url, "_blank");
  };

  const handleDelete = (id) => {
    console.log("Deleting invoice with id:", id);
  };

  return (
    <div>
      <div className="">
        <form className="w-full">
          <div className="flex flex-wrap gap-4 items-end mb-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center gap-2">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <span className="text-gray-500">to</span>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Export Button */}
            <DownloadTableExcel
              filename="users table"
              sheet="users"
              currentTableRef={tableRef.current}
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Export Excel
              </button>
            </DownloadTableExcel>
          </div>
        </form>

        <table ref={tableRef} className="responsive-table">
          <caption>Transcations</caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <ArrowUpDown className="ml-2" size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-400">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Items per page</span>
            <select
              className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="flex  items-center">
              <input
                min={1}
                max={table.getPageCount()}
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 p-2 rounded-md border border-gray-300 text-center"
              />
              <span className="ml-1">of {table.getPageCount()}</span>
            </span>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={20} />
            </button>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportComponent;
