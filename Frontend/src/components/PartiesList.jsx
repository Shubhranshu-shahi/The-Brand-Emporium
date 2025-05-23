import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Pencil, X } from "lucide-react";

import { customerDelete, getAllCustomer } from "../assets/api/customerApi";
import { EditPartyModal } from "./EditPartyModal";
import { handleSuccess } from "../assets/api/utils";
import { AddPartyModal } from "./AddPartyModal";
import { FaWhatsapp } from "react-icons/fa";
import { AddWaStock } from "./AddWaStock";
import { sendStockUpdatesNum } from "../assets/api/WhatsAppApi";

const PartiesInvoice = lazy(() => import("./PartiesInvoice"));

function PartiesList() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCustomer, SetSelectedCustomer] = useState({});
  const [customers, setCustomers] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedRowId, setSelectedRowId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addPartyModalOpen, setAddPartyModalOpen] = useState(false);
  const [addWAModalOpen, setaddWAModalOpen] = useState(false);
  const [editPartyData, setEditPartyData] = useState(null);
  const [waBrandAndoff, setWaBrandAndoff] = useState({});
  const [waStockData, setWaStockData] = useState({});
  // const [customerInvoices, setCustomerInvoices] = useState({});

  const [addPartyData, setAddPartyData] = useState({
    customerName: "",
    phone: "",
    email: "",
    CustomerGstin: "",
    invoiceNumber: [],
    invoiceDate: [],
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Adjust this as needed
  });

  const columns = [
    {
      id: "select",
      header: ({ table }) => {
        const allVisibleRows = table
          .getFilteredRowModel()
          .rows.map((row) => row.original);
        const allSelected = allVisibleRows.every((row) =>
          selectedRows.some((selected) => selected.id === row.id)
        );

        return (
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked) {
                // Add only new visible rows (only phone and id)
                const newSelected = [
                  ...selectedRows,
                  ...allVisibleRows
                    .filter(
                      (row) =>
                        !selectedRows.some((selected) => selected.id === row.id)
                    )
                    .map((row) => ({ id: row.id, phone: row.phone })),
                ];
                setSelectedRows(newSelected);
              } else {
                // Remove all visible rows
                const newSelected = selectedRows.filter(
                  (selected) =>
                    !allVisibleRows.some((row) => row.id === selected.id)
                );
                setSelectedRows(newSelected);
              }
            }}
          />
        );
      },
      cell: ({ row }) => {
        const rowId = row.original.id;
        const isChecked = selectedRows.some((r) => r.id === rowId);

        return (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const rowData = row.original;

              setSelectedRows((prev) => {
                if (isChecked) {
                  // Add only id and phone
                  return [...prev, { id: rowData.id, phone: rowData.phone }];
                } else {
                  // Remove by id
                  return prev.filter((r) => r.id !== rowData.id);
                }
              });
            }}
            onClick={(e) => e.stopPropagation()}
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Party Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "gstin", header: "GSTIN" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdate(row.original)}
            className="p-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            title="Delete"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const allCustomers = async () => {
    try {
      const res = await getAllCustomer();
      const cleaned = res.map((cust) => ({
        id: cust._id,
        name: cust.customerName || "N/A",
        phone: cust.phone || "N/A",
        gstin: cust.CustomerGstin || "N/A",
        email: cust.email || "N/A",
        invoiceNumbers: Array.isArray(cust.invoiceNumber)
          ? cust.invoiceNumber
          : [],
        invoiceDates: Array.isArray(cust.invoiceDate) ? cust.invoiceDate : [],
      }));
      setCustomers(cleaned);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    allCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      SetSelectedCustomer(customers[0]);
      setSelectedRowId(customers[0].id);
    }
  }, [customers]);

  const handleUpdate = (row) => {
    setEditPartyData(row);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setAddPartyModalOpen(true);
  };

  const handleSaveEdit = (updatedParty) => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === updatedParty.id ? updatedParty : cust))
    );

    // Optional: update selected customer if same party is open
    if (selectedCustomer?.id === updatedParty.id) {
      SetSelectedCustomer(updatedParty);
    }
  };

  const handleSaveadd = (newCustomer) => {
    const cleanedCustomer = {
      id: newCustomer._id,
      name: newCustomer.customerName || "N/A",
      phone: newCustomer.phone || "N/A",
      gstin: newCustomer.CustomerGstin || "N/A",
      email: newCustomer.email || "N/A",
      invoiceNumbers: Array.isArray(newCustomer.invoiceNumber)
        ? newCustomer.invoiceNumber
        : [],
      invoiceDates: Array.isArray(newCustomer.invoiceDate)
        ? newCustomer.invoiceDate
        : [],
    };

    setCustomers((prev) => [...prev, cleanedCustomer]);

    // Optional: auto-select the newly added customer
    SetSelectedCustomer(cleanedCustomer);
    setSelectedRowId(cleanedCustomer.id);
  };

  const handleDelete = async (row) => {
    const res = await customerDelete(row.id);
    // --------------------------------------
    setCustomers((prev) => prev.filter((cust) => cust.id !== row.id));
    // allCustomers();
    handleSuccess(res.message);
  };

  const handleRowClick = (rowData) => {
    SetSelectedCustomer(rowData);
    setSelectedRowId(rowData.id);
  };

  const handleStockUpdate = async () => {
    console.log("Stock Update", selectedRows);
    if (selectedRows.length != 0) {
      setaddWAModalOpen(true);
    }
  };

  const handleWaStock = async (data) => {
    console.log(data);
    const stockPayload = {
      data,
      selectedRows,
    };
    setWaStockData(stockPayload);
    sendStockUpdatesNum(stockPayload);
  };

  return (
    <div className="w-full max-w-full mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Party List */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-md p-4"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Parties List
            </h2>

            <button
              className="w-full mb-4 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition duration-300 ease-in-out"
              onClick={handleAdd}
            >
              + Add Party
            </button>
            <button
              className="w-full mb-4 px-4 py-3 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-xl shadow-md transition duration-300 ease-in-out flex items-center justify-center space-x-2"
              onClick={handleStockUpdate}
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>Stock Update</span>
            </button>

            <input
              type="text"
              placeholder="Search parties..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full mb-4 px-4 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className=" overflow-y-auto max-h-auto">
              <table className="min-w-full text-sm text-left text-gray-800">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <motion.tr
                        key={row.id}
                        whileHover={{ scale: 1.01 }}
                        className={`cursor-pointer transition ${
                          selectedRowId === row.original.id
                            ? "bg-indigo-100 border-l-4 border-indigo-500"
                            : ""
                        } hover:bg-indigo-100`}
                        onClick={(e) => {
                          if (e.target.closest("button")) return;
                          handleRowClick(row.original);
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 border-t border-gray-200"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                <div>
                  Page{" "}
                  <strong>
                    {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </strong>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Party Details & Invoices */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-4"
          >
            <Suspense
              fallback={<div className="text-gray-500">Loading table...</div>}
            >
              {selectedCustomer?.invoiceNumbers?.length > 0 && (
                <PartiesInvoice
                  selectedCustomer={selectedCustomer}
                  // cachedInvoices={customerInvoices}
                  // setCachedInvoices={setCustomerInvoices}
                />
              )}
            </Suspense>
          </motion.div>
        </div>
      </div>
      <EditPartyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        party={editPartyData}
      />
      <AddPartyModal
        isOpen={addPartyModalOpen}
        onClose={() => setAddPartyModalOpen(false)}
        onSave={handleSaveadd}
        party={addPartyData}
      />
      <AddWaStock
        isOpen={addWAModalOpen}
        onClose={() => setaddWAModalOpen(false)}
        onSave={handleWaStock}
        waBrandAndoff={waBrandAndoff}
        setWaBrandAndoff={setWaBrandAndoff}
      />
    </div>
  );
}

export default PartiesList;
