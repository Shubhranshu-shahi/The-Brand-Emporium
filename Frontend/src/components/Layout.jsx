import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeaderNav from "./HeaderNav";
import SideNavTest from "./SideNavTest";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(null); // null initially
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);

  // Detect screen size and sync with localStorage
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const storedValue = localStorage.getItem("SideNavCollapsed");

    const isMobile = mediaQuery.matches;

    // on mobile, force collapsed
    if (isMobile) {
      setCollapsed(true);
    } else {
      //use localStorage or default to false
      setCollapsed(storedValue === "true");
    }

    // auto-collapse on resize to mobile
    const handleResize = (e) => {
      if (e.matches) {
        setCollapsed(true);
      }
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // Prevent rendering until we know `collapsed`
  if (collapsed === null) return null;

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
          className="fixed inset-0 z-50 bg-black bg-opacity-100 flex justify-center items-center"
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
        animate={{ marginLeft: collapsed ? "4.5rem" : "16rem" }}
        transition={{ duration: 0.3 }}
        className="mt-16 w-full"
      >
        {children}
      </motion.main>
    </div>
  );
}
