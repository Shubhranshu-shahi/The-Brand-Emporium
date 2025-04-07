import React from "react";
import "./sales.css";

import SalesForm from "../../components/SalesForm";
// import Navs from "./Navs";
import Layout from "../../components/Layout";
// import SalesFormTest from "../../components/salesformtest";
function Sales() {
  return (
    <Layout>
      <div className="p-4 overflow-hidden">
        <SalesForm />
        {/* <SalesFormTest /> */}
      </div>
    </Layout>
  );
}

export default Sales;
