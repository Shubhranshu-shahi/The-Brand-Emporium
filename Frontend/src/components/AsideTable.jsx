import React from "react";
import partiesData from "../data/patiesData.json";
import "../assets/css/testAside.css";
import UpperCard from "./UpperCard";
import Tables from "./Tables";

import { Link } from "react-router-dom";

function AsideTable() {
  return (
    <div>
      <UpperCard />

      <div className="flex items-center justify-center">
        <section class="w-full  dark:bg-[#0A2025] py-9 px-8">
                  <Link to='/items/add-item'>Add Item</Link>
                  
          <div class="flex items-start mt-8 gap-6">
            <div class="w-full  py-6">
              <table className="responsive-table">
                <caption>Transcations</caption>
                <thead>
                  <tr>
                    <th scope="col">Party</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {partiesData.map((item, index) => (
                    <tr key={index}>
                      <td data-title="Released">{item.name}</td>
                      <td data-title="Released">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div class=" py-6 w-full ">
              <Tables datas={partiesData} />
            </div>
          </div>
        </section>
        {/* <Invoice/> */}
      </div>
    </div>
  );
}

export default AsideTable;
