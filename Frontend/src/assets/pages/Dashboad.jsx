import React from "react";
import Cards from "../../components/Cards";
import Graph from "../../components/graph";
import LinkCards from "../../components/LinkCards";
import Layout from "../../components/Layout";

function Dashboard() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Cards />
        <Cards />
      </div>

      <div className="mb-4 ml-4">
        <Graph />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <LinkCards />
        <LinkCards />
        <LinkCards />
        <LinkCards />
      </div>
    </Layout>
  );
}

export default Dashboard;
