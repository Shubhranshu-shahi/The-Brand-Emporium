import React from "react";
import "./sales.css";

import SalesForm from "../../components/SalesForm";
// import Navs from "./Navs";
import Layout from "../../components/Layout";
import SalesFormTest from "../../components/salesformtest";
function Sales() {
  return (
    <Layout>
      <div className="px-2">
        {/* <SalesForm /> */}
        <SalesFormTest />
      </div>
    </Layout>
  );
}

export default Sales;
