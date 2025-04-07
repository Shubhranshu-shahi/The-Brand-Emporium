import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeaderNav from "./HeaderNav";
import SideNavTest from "./SideNavTest";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);

  // Collapse sidebar on mobile screen
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = (e) => setCollapsed(e.matches);

    handleResize(mediaQuery); // Initial check
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen relative">
      <HeaderNav
        setContentHidden={setContentHidden}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />
      <SideNavTest collapsed={collapsed} setCollapsed={setCollapsed} />

      {contentHidden && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center"
        >
          <button
            onClick={() => setContentHidden(false)}
            className="bg-white text-black px-4 py-2 rounded shadow-md"
          >
            Show Content
          </button>
        </motion.div>
      )}

      <motion.main
        animate={{ marginLeft: collapsed ? "4rem" : "16rem" }}
        transition={{ duration: 0.3 }}
        className="mt-16 p-4 w-full"
      >
        {children}
      </motion.main>
    </div>
  );
}
