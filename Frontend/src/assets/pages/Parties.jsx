import React from "react";
import AsideTable from "../../components/AsideTable";
import Navs from "./Navs";
function Parties() {
  return (
    <div>
      <Navs />
      <div className="p-4 mt-16 sm:ml-64">
        <AsideTable />
      </div>
    </div>
  );
}

export default Parties;
