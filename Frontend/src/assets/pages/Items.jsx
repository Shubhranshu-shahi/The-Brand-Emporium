import React, { useContext } from "react";
import "./sales.css";

import AsideTable from "../../components/AsideTable";
import Navs from "./Navs";
// import {shieldNSlideContext} from '..//../App'

function Items() {
  // const [collapsed, setCollapsed, contentHidden, setContentHidden] =
  //   useContext(shieldNSlideContext);
  // shieldNSlideContext;

  return (
    // <div
    //     className={`flex-1 p-6 bg-gray-100 mt-20 transition-all duration-300 ml-64` }
    //   >
    // <AsideTable />
    //   </div>
    <>
      <Navs />
      <div className="p-4 mt-16 sm:ml-64 overflow-hidden">
        <AsideTable />
      </div>
    </>
  );
}

export default Items;
