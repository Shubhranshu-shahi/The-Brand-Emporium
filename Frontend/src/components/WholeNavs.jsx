import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Box,
  ShoppingCart,
  BarChart,
  LogOut,
  Shield,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function WholeNavs() {
  // const [ collapsed, setCollapsed, contentHidden, setContentHidden ] =
  //         useContext(shieldNSlideContext);

  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Navigation Wrapper */}
      <div className="flex flex-col w-full h-full fixed">
        {/* Top Menu */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
          <div className="flex items-center space-x-2">
            <img
              src="src/assets/img/logo-transp.png"
              alt="Logo"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold">Brand Emporium</span>
          </div>
          <div className="relative">
            <img
              src="src/assets/img/logo-transp.png"
              alt="User"
              className="rounded-full w-10 h-10 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded text-black"
              >
                <button
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
                  onClick={() => setContentHidden(true)}
                >
                  <Shield className="w-5 h-5 mr-2" /> Privacy
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
                  onClick={() => alert("Sign Out Clicked")}
                >
                  <LogOut className="w-5 h-5 mr-2" /> Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </header>

        {/* Sidebar */}
        <motion.aside
          initial={{ width: "16rem" }}
          animate={{ width: collapsed ? "4rem" : "16rem" }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 text-white p-4 h-full fixed top-16 left-0"
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-3 mb-4 text-xl"
          >
            {collapsed ? <ArrowRight /> : <ArrowLeft />}
          </button>
          <nav className="flex flex-col space-y-2">
            {[
              { icon: <Home />, label: "Dashboard" },
              { icon: <Users />, label: "Parties" },
              { icon: <Box />, label: "Items" },
              { icon: <ShoppingCart />, label: "Sales" },
              { icon: <BarChart />, label: "Reports" },
            ].map(({ icon, label }, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded"
              >
                <div className="text-xl w-6 flex justify-center">{icon}</div>
                {!collapsed && <span>{label}</span>}
              </motion.div>
            ))}
          </nav>
        </motion.aside>
      </div>

      {/* Privacy Shield */}
      {contentHidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
        >
          <button
            onClick={() => setContentHidden(false)}
            className="bg-white text-black px-4 py-2 rounded shadow-md"
          >
            Show Content
          </button>
        </motion.div>
      )}

      {/* Content Area */}
    </div>
  );
}
