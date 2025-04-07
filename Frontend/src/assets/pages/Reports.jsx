import React from "react";
import "./sales.css";
import SaleTable from "../../components/SaleTable";
import TestingTable from "../../components/testingTable";
import ReportComponent from "../../components/ReportComponent";

import Layout from "../../components/Layout";
function Reports() {
  console.log("hello");
  return (
    <Layout>
      <div className="p-4">
        <ReportComponent />
      </div>
    </Layout>
  );
}

export default Reports;
