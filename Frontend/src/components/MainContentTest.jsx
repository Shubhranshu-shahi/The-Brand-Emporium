// components/MainContent.jsx
import { motion } from "framer-motion";

export default function MainContentTest({ collapsed }) {
  return (
    <motion.main
      animate={{ marginLeft: collapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3 }}
      className="mt-16 p-4"
    >
      <h1 className="text-2xl font-bold">Main Content Goes Here</h1>
    </motion.main>
  );
}
