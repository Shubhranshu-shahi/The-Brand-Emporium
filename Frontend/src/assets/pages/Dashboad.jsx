import React from "react";
import Cards from "../../components/Cards";
import Graph from "../../components/graph";
import LinkCards from "../../components/LinkCards";
import Navs from "./Navs";
function Dashboad() {
  return (
    <div>
      <Navs />
      <div className="p-4 mt-16 sm:ml-64">
        <div className="p-4  rounded-lg dark:border-gray-700">
          <div className="grid grid-cols-2 gap-1 mb-4">
            <Cards />
            <Cards />
          </div>
        </div>
        <div className="p-4">
          <Graph />
        </div>

        <div className="w-full p-4 gap-2 grid md:grid-flow-col ">
          <LinkCards />
          <LinkCards />
          <LinkCards />
          <LinkCards />
        </div>
      </div>
    </div>
  );
}

export default Dashboad;
