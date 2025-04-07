import React, { useState, useEffect, useRef } from "react";
import "../assets/css/test.css";
import { downloadExcel, DownloadTableExcel } from "react-export-table-to-excel";

import DatePicker from "react-datepicker";
import ReactToPrint from "react-to-print";

import "react-datepicker/dist/react-datepicker.css";
import salesData from "../data/salestableData.json";

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

const columnHelper = createColumnHelper();

const salesDatass = salesData;

function ReportComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
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
      _id: entry._id, // Keep for update/delete/view actions
    }));

    setData(formattedData);
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
    { accessorKey: "remaining", header: "Remaining" },
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
              onClick={() => handleUpdate(rowData)}
              className="text-green-600 hover:underline"
            >
              Update
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
    // Navigate or open modal
  };

  const handleUpdate = (data) => {
    console.log("Updating invoice:", data);
    // Pre-fill form or navigate to update screen
  };

  const handleDelete = (id) => {
    console.log("Deleting invoice with id:", id);
    // Confirm + trigger deletion logic
  };

  return (
    <div>
      <div className="container">
        <form className="w-full">
          <div className="flex">
            <div className="items-center max-w-3xs py-2">
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-3xs pl-10 pr-4 py-2  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                // className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
              <Search
                className="relative left-3 bottom-3 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div
              id="date-range-picker"
              date-rangepicker
              className="flex items-center"
            >
              <div className="relative items-center ml-6">
                <DatePicker
                  selectStart
                  showIcon
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className=""
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                    >
                      <mask id="ipSApplication0">
                        <g
                          fill="none"
                          stroke="#fff"
                          strokeLinejoin="round"
                          strokeWidth="4"
                        >
                          <path
                            strokeLinecap="round"
                            d="M40.04 22v20h-32V22"
                          ></path>
                          <path
                            fill="#fff"
                            d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                          ></path>
                        </g>
                      </mask>
                      <path
                        fill="currentColor"
                        d="M0 0h48v48H0z"
                        mask="url(#ipSApplication0)"
                      ></path>
                    </svg>
                  }
                />
              </div>
              <span className="mx-4 text-gray-500">to</span>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <DatePicker
                  showIcon
                  dateFormat="dd/MM/yyyy"
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                    >
                      <mask id="ipSApplication0">
                        <g
                          fill="none"
                          stroke="#fff"
                          strokeLinejoin="round"
                          strokeWidth="4"
                        >
                          <path
                            strokeLinecap="round"
                            d="M40.04 22v20h-32V22"
                          ></path>
                          <path
                            fill="#fff"
                            d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                          ></path>
                        </g>
                      </mask>
                      <path
                        fill="currentColor"
                        d="M0 0h48v48H0z"
                        mask="url(#ipSApplication0)"
                      ></path>
                    </svg>
                  }
                />
                {/* <input id="datepicker-range-end" name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/> */}
              </div>
            </div>
            <DownloadTableExcel
              filename="users table"
              sheet="users"
              currentTableRef={tableRef.current}
            >
              <button> Export excel </button>
            </DownloadTableExcel>

            {/* <button className="flex items-center" onClick={handleDownloadExcel}>
              Export Excel
            </button> */}
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
