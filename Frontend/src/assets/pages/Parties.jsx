import React from "react";
import AsideTable from "../../components/AsideTable";

import Layout from "../../components/Layout";

import PartiesNameTable from "../../components/PartiesNameTable";
function Parties() {
  return (
    <Layout>
      <div className="overflow-hidden">
        <PartiesNameTable />
      </div>
    </Layout>
  );
}

export default Parties;
