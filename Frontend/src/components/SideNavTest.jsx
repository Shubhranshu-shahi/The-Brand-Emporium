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
import { Link, useLocation } from "react-router-dom";

export default function SideNavTest({ collapsed, setCollapsed }) {
  const navItems = [
    { path: "/dashboard", icon: <Home />, label: "Dashboard" },
    { path: "/parties", icon: <Users />, label: "Parties" },
    { path: "/items", icon: <Box />, label: "Items" },
    { path: "/sales", icon: <ShoppingCart />, label: "Sales" },
    { path: "/reports", icon: <BarChart />, label: "Reports" },
  ];

  const location = useLocation();
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
        {navItems.map(({ icon, label, path }, index) => {
          const isActive = location.pathname.startsWith(path);

          return (
            <Link to={path} key={index} title={collapsed ? label : ""}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center space-x-4 p-2 rounded transition-all ${
                  isActive
                    ? "bg-gray-700 text-blue-300 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                <div className="text-xl w-6 flex justify-center">{icon}</div>
                {!collapsed && <span>{label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
