import React from "react";

import ReportComponent from "../../components/ReportComponent";

import Layout from "../../components/Layout";
import InvoiceReport from "../../components/InvoiceReport";

function Reports() {
  return (
    <Layout>
      <div className="p-4">
        <InvoiceReport />
      </div>
    </Layout>
  );
}

export default Reports;
