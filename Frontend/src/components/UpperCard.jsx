import React from "react";

function UpperCard() {
  return (
    <div className="bg-white text-black rounded-2xl shadow-md overflow-hidden">
      <div className="bg-gray-900 px-6 py-4 border-b border-teal-500">
        <h4 className="text-xl font-semibold text-teal-400">Party Details</h4>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between text-sm">
          <label className="font-medium text-gray-300">
            Email: <span className="text-teal-400 ml-1">abc@xyz.com</span>
          </label>
          <label className="font-medium text-gray-300">
            Phone: <span className="text-teal-400 ml-1">999999999</span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row justify-between text-sm items-center">
          <label className="font-medium text-gray-300">
            GSTIN: <span className="text-teal-400 ml-1">123456</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
            />
            <span>Party Status</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default UpperCard;
