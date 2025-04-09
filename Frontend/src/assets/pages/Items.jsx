import React, { useContext } from "react";
import "./sales.css";

import AsideTable from "../../components/AsideTable";

import Layout from "../../components/Layout";

function Items() {
  return (
    <Layout>
      <div className="overflow-hidden">
        <AsideTable />
      </div>
    </Layout>
  );
}

export default Items;
