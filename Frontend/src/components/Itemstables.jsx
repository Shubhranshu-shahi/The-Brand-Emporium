import React from "react";
import partiesData from "../data/patiesData.json";
import UpperCard from "./UpperCard";
import Tables from "./Tables";
import { Link } from "react-router-dom";

function ItemsTables() {
  return (
    <div className="w-full max-w-12xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="flex justify-end mb-4">
        <Link
          to="/items/add-item"
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300 shadow"
        >
          Add Item
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Card - Transactions */}
        <div className="col-span-12 lg:col-span-3 mt-[201px]">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-balck text-lg font-semibold mb-4">
              Transactions
            </h2>
            <table className="w-full text-sm text-left text-black">
              <thead className="text-xs bg-gray-700 text-gray-400 uppercase border-b border-gray-600">
                <tr className="border-2 ">
                  <th className="py-2 px-2">Party</th>
                  <th className="py-2 px-2">Amount</th>
                </tr>
              </thead>
              <tbody className="border-2">
                {partiesData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-teal-700/10 transition border-2"
                  >
                    <td className="py-2 px-2 border-2">{item.name}</td>
                    <td className="py-2 px-2 border-2 ">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          {/* UpperCard in its own card */}
          <div className="bg-white rounded-2xl p-4">
            <UpperCard />
          </div>

          {/* Main Table in its own card */}
          <div className="bg-white rounded-2xl p-4 ">
            <Tables datas={partiesData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemsTables;
