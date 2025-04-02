import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { LogOut, Shield, User } from "lucide-react";
import { handleSuccess } from "../assets/helper/utils";
import { useNavigate } from "react-router-dom";
import s from "../img/logo-transp.png";
function TopNav() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const signOutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Sign out Sucessfull");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-800 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <a href="#" className="flex ms-2 md:me-24">
                <img
                  src="../img/logo-transp.png"
                  className="h-8 me-3"
                  alt="Brand Emporium Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Brand Emporium
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <img
                    src="../img/logo-transp.png"
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
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="relative">
                    <img
                      src="src/assets/img/logo-transp.png"
                      alt="User"
                      className="rounded-full w-10 h-10 cursor-pointer"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default TopNav;
