import React, { useState, useEffect, useRef } from "react";
import "../assets/css/test.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import DatePicker from "react-datepicker";
import {
  flexRender,
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("itemName", {
    header: () => "Item Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("itemCode", {
    header: () => "Item Code",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("mrp", {
    header: () => "MRP",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("discountSale", {
    header: () => "Discount Sale",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("salePrice", {
    header: () => "Sale Price",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("taxSale", {
    header: () => "Tax Sale",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("sellingPrice", {
    header: () => "Selling Price",
    cell: (info) => info.getValue(),
  }),
];

const salesData = {
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
  _id: "67e9cd233e5ec2d36aa34ecf",
  rows: [
    {
      itemName: "testItem",
      itemCode: "374477683653074",
      mrp: "1000",
      discountSale: "50",
      salePrice: "440",
      taxSale: "12",
      sellingPrice: "500",
      _id: "67e9cd233e5ec2d36aa34ed0",
    },
  ],
  createdAt: "2025-03-30T23:00:51.449Z",
  updatedAt: "2025-03-30T23:00:51.449Z",
  __v: 0,
};

function ReportComponent() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(salesData.rows || []);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const tableRef = useRef(null);

  useEffect(() => {
    // If salesData.rows is empty or undefined, we can log an error or set an empty array
    if (!salesData.rows || salesData.rows.length === 0) {
      console.error("No data available for the table.");
      setData([]); // Ensure that an empty array is set
    } else {
      setData(salesData.rows);
    }
  }, []);

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
  });

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
                className="w-3xs pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="mr-4"
              />
              <span className="mx-4 text-gray-500">to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
              />
            </div>
            <DownloadTableExcel
              filename="invoice_table"
              sheet="invoice"
              currentTableRef={tableRef.current}
            >
              <button className="flex mt-5 items-center">Export Excel</button>
            </DownloadTableExcel>
          </div>
        </form>

        <table ref={tableRef} className="responsive-table">
          <caption>Transactions</caption>
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-4 text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
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

            <span className="flex items-center">
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
