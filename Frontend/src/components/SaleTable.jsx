import React from "react";

import DataTable from "datatables.net-dt";
import "../assets/css/salesTables.css";

function SaleTable(sales) {
  {
    let table = new DataTable("#myTable");
  }

  return (
    <div>
      <table className="responsive-table">
        <caption>Transcations</caption>
        <thead>
          <tr>
            {console.log(sales)}
            {/* <th scope="col">Film Title{salesData.map((key,vak)=>key)}</th> */}
            <th scope="col">Id</th>
            <th scope="col">Date</th>
            <th scope="col">Invoice No</th>
            <th scope="col">Party Name</th>
            <th scope="col">Transaction Id</th>
            <th scope="col">Amount</th>
            <th scope="col">Balance Due</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((item, index) => (
            <tr key={index}>
              <td data-title="Released">{item.id}</td>
              <td data-title="Released">{item.date}</td>
              <td data-title="Studio">{item.party_Name}</td>
              <td data-title="Studio">{item.invoice_No}</td>
              <td data-title="Worldwide Gross" data-type="currency">
                {item.transaction_id}
              </td>
              <td data-title="Domestic Gross" data-type="currency">
                {item.amount}
              </td>
              <td data-title="Domestic Gross" data-type="currency">
                {item.balance_Due}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SaleTable;
