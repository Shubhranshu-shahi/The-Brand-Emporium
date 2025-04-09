import React, { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";

import { fetchInvoicesByInvoiceNumbers } from "../assets/helper/InvoiceApi";

const columnHelper = createColumnHelper();

function PartiesInfoTable({ selectedCustomer }) {
  const [fetchedInvoices, setFetchedInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoicesByNumbers = async (invoiceNumbers) => {
    try {
      setLoading(true);
      const res = await fetchInvoicesByInvoiceNumbers(invoiceNumbers);
      setFetchedInvoices(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setFetchedInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedCustomer &&
      Array.isArray(selectedCustomer.invoiceNumbers) &&
      selectedCustomer.invoiceNumbers.length > 0
    ) {
      fetchInvoicesByNumbers(selectedCustomer.invoiceNumbers);
    } else {
      setFetchedInvoices([]);
    }
  }, [selectedCustomer]);

  const invoiceData = useMemo(() => {
    if (!Array.isArray(fetchedInvoices)) return [];
    console.log(fetchedInvoices);
    return fetchedInvoices.map((inv, idx) => ({
      id: idx + 1,
      invoiceNumber: inv.customerAndInvoice?.invoiceNumber || "N/A",
      type: "Retail",
      date: new Date(inv.customerAndInvoice?.invoiceDate).toLocaleDateString(),
      total: inv.totalDetails?.roundOff || 0,
      balance: inv.totalDetails?.remaining || 0,
    }));
  }, [fetchedInvoices]);

  const columns = [
    columnHelper.accessor("invoiceNumber", {
      header: () => (
        <span className="flex items-center">
          <FileText className="mr-2" size={16} /> Invoice No.
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("type", {
      header: () => (
        <span className="flex items-center">
          <FileText className="mr-2" size={16} /> Type
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: () => (
        <span className="flex items-center">
          <Calendar className="mr-2" size={16} /> Date
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("total", {
      header: () => (
        <span className="flex items-center">
          <DollarSign className="mr-2" size={16} /> Total
        </span>
      ),
      cell: (info) => `₹${info.getValue()}`,
    }),
    columnHelper.accessor("balance", {
      header: () => (
        <span className="flex items-center">
          <DollarSign className="mr-2" size={16} /> Balance
        </span>
      ),
      cell: (info) => `₹${info.getValue()}`,
    }),
  ];

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: invoiceData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="mb-4 relative">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search invoices..."
          className="w-3xs pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Fetching invoices...</div>
      ) : invoiceData.length > 0 ? (
        <>
          <table className="min-w-full text-sm text-left text-black">
            <caption className="text-left px-4 py-2 font-semibold text-gray-700">
              Invoices
            </caption>
            <thead className="text-xs text-gray-400 uppercase border-b border-gray-600 bg-gray-800 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
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
                      className="text-center  px-0 py-3 border-b border-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">Items per page</span>
              <select
                className="border border-gray-300 rounded-md shadow-sm p-2"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft size={20} />
              </button>
              <button
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
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="w-16 p-2 rounded-md border text-center"
                />
                <span className="ml-1">of {table.getPageCount()}</span>
              </span>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-sm">
          No invoices found for this customer.
        </div>
      )}
    </div>
  );
}

export default PartiesInfoTable;
