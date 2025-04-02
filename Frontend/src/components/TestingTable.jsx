import React, { useState, useEffect } from "react";
import "../assets/css/test.css";
import { downloadExcel } from "react-export-table-to-excel";

import DatePicker from "react-datepicker";
import ReactToPrint from "react-to-print";

import "react-datepicker/dist/react-datepicker.css";
import salesData from "../data/salestableData.json";
import removeLastChar from "../assets/helper/removeLastChar";

const salesDatass = salesData;
let storeSearch = "";
function TestingTable() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [salesDatas, setSalesDatas] = useState(salesDatass);

  const header = [
    "id",
    "date",
    "invoice_No",
    "party_Name",
    "transaction_id",
    "amount",
    "balance_Due",
  ];
  const searchFunction = (e) => {
    e.PreventDefault();
    if (e.keyCode == 8 || e.keyCode == 46) {
      console.log("h");
      storeSearch = removeLastChar(storeSearch);
    } else {
      console.log(storeSearch);
      storeSearch = storeSearch + e.key;
    }

    // console.log(storeSearch.length);
    console.log(storeSearch);
    //setSalesDatas = salesDatas.filter(storeSearch);
  };
  //       const [salesDatas, setSalesDatas] = useState([]);
  // const fetchSalesData = () => {
  //   // fetch()
  //   salesData.forEach((request) => {
  //     setSalesDatas(request)
  //   });
  // }
  // useEffect(() => {
  //   fetchSalesData();
  // }, []);

  function handleDownloadExcel() {
    const opt = "Sales Report";

    downloadExcel({
      fileName: `${new Date().toLocaleString()} - ${opt}`,
      sheet: `${new Date().toLocaleString()} - ${opt}`,
      tablePayload: {
        header,
        // accept two different data structures
        body: salesData,
      },
    });
  }

  return (
    <div>
      <div className="container">
        <form className="w-full transaction-table">
          <div className="flex">
            <div className="items-center max-w-3xs border-b py-2">
              <input
                // tabIndex="0"
                
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Search"
                aria-label="Search-Tranction"
              />
            </div>
            <div
              id="date-range-picker"
              date-rangepicker
              className="flex items-center"
            >
              <div className="relative items-center ml-6">
                <DatePicker
                  selectStart
                  showIcon
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className=""
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                    >
                      <mask id="ipSApplication0">
                        <g
                          fill="none"
                          stroke="#fff"
                          strokeLinejoin="round"
                          strokeWidth="4"
                        >
                          <path
                            strokeLinecap="round"
                            d="M40.04 22v20h-32V22"
                          ></path>
                          <path
                            fill="#fff"
                            d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                          ></path>
                        </g>
                      </mask>
                      <path
                        fill="currentColor"
                        d="M0 0h48v48H0z"
                        mask="url(#ipSApplication0)"
                      ></path>
                    </svg>
                  }
                />
              </div>
              <span className="mx-4 text-gray-500">to</span>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <DatePicker
                  showIcon
                  dateFormat="dd/MM/yyyy"
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 48 48"
                    >
                      <mask id="ipSApplication0">
                        <g
                          fill="none"
                          stroke="#fff"
                          strokeLinejoin="round"
                          strokeWidth="4"
                        >
                          <path
                            strokeLinecap="round"
                            d="M40.04 22v20h-32V22"
                          ></path>
                          <path
                            fill="#fff"
                            d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                          ></path>
                        </g>
                      </mask>
                      <path
                        fill="currentColor"
                        d="M0 0h48v48H0z"
                        mask="url(#ipSApplication0)"
                      ></path>
                    </svg>
                  }
                />
                {/* <input id="datepicker-range-end" name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end"/> */}
              </div>
            </div>
            <button className="flex items-center mt-10" onClick={handleDownloadExcel}>
              Export Excel
            </button>
          </div>
        </form>

        <table className="responsive-table">
          <caption>Transcations</caption>
          <thead>
            <tr>
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
            {salesData.map((item, index) => (
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
    </div>
  );
}

export default TestingTable;
