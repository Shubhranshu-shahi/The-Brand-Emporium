import React from "react";
import "./sales.css";

import SalesForm from "../../components/SalesForm";
import Navs from "./Navs";
// import SalesFormTest from "../../components/salesformtest";
function Sales() {
  return (
    <>
      <Navs />
      <div className="p-4 mt-16 sm:ml-64 overflow-hidden">
        <SalesForm />
        {/* <SalesFormTest /> */}
      </div>
    </>
  );
}

export default Sales;
