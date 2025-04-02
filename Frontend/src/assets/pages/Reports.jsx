import React from "react";
import "./sales.css";
import SaleTable from "../../components/SaleTable";
import TestingTable from "../../components/testingTable";
import ReportComponent from "../../components/ReportComponent";
import Navs from "./Navs";
function Reports() {
  console.log("hello");
  return (
    <>
      <Navs />
      <div className="p-4 mt-16 sm:ml-64">
        {/* <SaleTable /> */}

        <ReportComponent />
      </div>
    </>
  );
}

export default Reports;
