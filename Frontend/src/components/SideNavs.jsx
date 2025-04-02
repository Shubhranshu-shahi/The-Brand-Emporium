import React, { useState } from "react";
import { Link } from "react-router-dom";

import { File, Home, ShoppingBag, StoreIcon, UserCircle2 } from "lucide-react";



export const SideNavs = () => {
  return (
    <div>
      <aside
        id="logo-sidebar"
        className="fixed  bg-gray-900 top-0 left-0 z-40 w-64 min-h-full pt-20 transition-transform -translate-x-full border-r border-gray-900 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-900 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <div
                href="#"
                className="flex items-center p-2 text-gray-400 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <Home />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  <Link to="/dashboard">Dashboard</Link>
                </span>
              </div>
            </li>
            <li>
              <div
                href="#"
                className="flex items-center p-2 text-gray-400 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <UserCircle2 />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  <Link to="/parties">Parties</Link>
                </span>
              </div>
            </li>
            <li>
              <div
                href="#"
                className="flex items-center p-2 text-gray-400 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <StoreIcon />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  <Link to="/items">Items</Link>
                </span>
              </div>
            </li>
            <li>
              <div
                href="#"
                className="flex items-center p-2 text-gray-400 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <ShoppingBag />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  <Link to="/sales">Sales</Link>
                </span>
              </div>
            </li>
            <li>
              <div
                href="#"
                className="flex items-center p-2 text-gray-400 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <File />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  <Link to="/reports">Reports</Link>
                </span>
              </div>
            </li>
            <li>
              <div
                href="#"
                className="flex items-center p-2 text-gray-400 rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <File />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  <Link to="/invoice">Invoice</Link>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
