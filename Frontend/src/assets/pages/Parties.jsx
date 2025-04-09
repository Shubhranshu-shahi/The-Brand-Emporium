import React from "react";
import AsideTable from "../../components/AsideTable";

import Layout from "../../components/Layout";

import PartiesList from "../../components/PartiesList";
function Parties() {
  return (
    <Layout>
      <div className="overflow-hidden">
        <PartiesList />
      </div>
    </Layout>
  );
}

export default Parties;
