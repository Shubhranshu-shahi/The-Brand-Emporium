import React from "react";

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
