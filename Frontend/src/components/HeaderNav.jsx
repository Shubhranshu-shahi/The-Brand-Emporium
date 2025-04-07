// components/HeaderNav.jsx
import { motion } from "framer-motion";
import { LogOut, Shield, User } from "lucide-react";
import logo from "../img/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleSuccess } from "../assets/helper/utils";
export default function HeaderNav({
  setContentHidden,
  dropdownOpen,
  setDropdownOpen,
}) {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const signOutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Sign out Sucessfull");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  return (
    <header className="bg-[#0f1215] text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-18 h-10" />
        <span className="text-xl font-bold font-sans">The Brand Emporium</span>
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
            {loggedInUser ? (
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
                onClick={() => {}}
              >
                <User className="w-5 h-5 mr-2" /> {loggedInUser}
              </button>
            ) : (
              <></>
            )}
            <button
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
              onClick={() => setContentHidden(true)}
            >
              <Shield className="w-5 h-5 mr-2" /> Privacy
            </button>
            <button
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
              onClick={signOutHandler}
            >
              <LogOut className="w-5 h-5 mr-2" /> Sign Out
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
