import React, { createContext, useState } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Sales from "./assets/pages/Sales";
import Test from "./assets/pages/test";

import Reports from "./assets/pages/Reports";
import Dashboad from "./assets/pages/Dashboad";

import Items from "./assets/pages/Items";
import Parties from "./assets/pages/Parties";

import TestForm from "./assets/pages/testForm";
import AddItem from "./assets/pages/AddItem";

import Te from "./components/Te";
import AuthPage from "./assets/pages/AuthPage";
import { ToastContainer } from "react-toastify";

import RefreshHandler from "./components/RefreshHandler";
import BarcodeImage from "./components/BarcodeImage";
import Invoice from "./assets/pages/Invoice";
import WholeNavs from "./components/WholeNavs";
// import WholeNavs from "./components/wholeNavs";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };
  return (
    <div>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboad />} />}
        />
        <Route path="/te" element={<Te />} />
        {/* <Route path="/te" element={<PrivateRoute element={<Te />} />} /> */}
        <Route
          path="/parties"
          element={<PrivateRoute element={<Parties />} />}
        />
        <Route path="/test" element={<WholeNavs />} />
        <Route path="/sales" element={<PrivateRoute element={<Sales />} />} />
        <Route path="/items" element={<PrivateRoute element={<Items />} />} />
        <Route
          path="/reports"
          element={<PrivateRoute element={<Reports />} />}
        />
        <Route path="/testform" element={<TestForm />} />
        <Route
          path="/items/add-item"
          element={<PrivateRoute element={<AddItem />} />}
        />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>

      {/* <WholeNavs /> */}
    </div>
  );
}

export default App;
