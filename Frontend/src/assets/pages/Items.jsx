import React, { useContext } from "react";
import "./sales.css";

import AsideTable from "../../components/AsideTable";

import Layout from "../../components/Layout";
// import {shieldNSlideContext} from '..//../App'

function Items() {
  // const [collapsed, setCollapsed, contentHidden, setContentHidden] =
  //   useContext(shieldNSlideContext);
  // shieldNSlideContext;

  return (
    <Layout>
      <div className="p-4 overflow-hidden">
        <AsideTable />
      </div>
    </Layout>
  );
}

export default Items;
