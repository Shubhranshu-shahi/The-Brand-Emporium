// components/SideNav.jsx
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Box,
  ShoppingCart,
  BarChart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SideNav({ collapsed, setCollapsed }) {
  const navItems = [
    { path: "/dashboard", icon: <Home />, label: "Dashboard" },
    { path: "/parties", icon: <Users />, label: "Parties" },
    { path: "/items", icon: <Box />, label: "Items" },
    { path: "/sales", icon: <ShoppingCart />, label: "Sales" },
    { path: "/reports", icon: <BarChart />, label: "Reports" },
  ];

  return (
    <motion.aside
      initial={{ width: "16rem" }}
      animate={{ width: collapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 text-white p-4 h-full fixed top-16 left-0 z-40"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="ml-3 mb-4 text-xl"
      >
        {collapsed ? <ArrowRight /> : <ArrowLeft />}
      </button>
      <nav className="flex flex-col space-y-2">
        {navItems.map(({ icon, label, path }, index) => (
          <Link to={path} key={index}>
            <motion.div
              //   key={index}
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded"
            >
              <div className="text-xl w-6 flex justify-center">{icon}</div>
              {!collapsed && <span>{label}</span>}
            </motion.div>
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
