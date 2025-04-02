import React from "react";

import InvoiceBill from "../../components/InvoiceBill";
import { useLocation } from "react-router-dom";

const Invoice = () => {
  const location = useLocation();
  console.log(location);
  const id = location.pathname.split("/").pop();
  console.log();

  console.log(id);
  return (
    <>
      <InvoiceBill id={id} />
    </>
  );
};

export default Invoice;
