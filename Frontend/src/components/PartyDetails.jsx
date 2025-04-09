import React from "react";

function PartyDetails({ selectedCustomer }) {
  return (
    <div className="bg-white text-black rounded-2xl shadow-md overflow-hidden">
      <div className="bg-gray-900 px-6 py-4 border-b border-teal-500">
        <h4 className="text-xl font-semibold text-teal-400">Party Details</h4>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between text-sm">
          <label className="font-medium text-gray-300">
            Email:{" "}
            <span className="text-teal-400 ml-1">
              {selectedCustomer.email && selectedCustomer.email}
            </span>
          </label>
          <label className="font-medium text-gray-300">
            Phone:{" "}
            <span className="text-teal-400 ml-1">
              {selectedCustomer.phone && selectedCustomer.phone}
            </span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row justify-between text-sm items-center">
          <label className="font-medium text-gray-300">
            GSTIN:{" "}
            <span className="text-teal-400 ml-1">
              {selectedCustomer.gstin && selectedCustomer.gstin}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default PartyDetails;
