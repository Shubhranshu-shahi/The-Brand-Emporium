import React from "react";

import InvoiceBill from "../../components/InvoiceBill";
import { useLocation } from "react-router-dom";

import { usePDF, Margin } from "react-to-pdf";

const Invoice = () => {
  const location = useLocation();

  const id = location.pathname.split("/").pop();

  const { toPDF, targetRef } = usePDF({
    filename: "use-pdf-example.pdf",
    page: { margin: Margin.MEDIUM, orientation: "landscape" },
  });

  console.log(toPDF);
  console.log(targetRef);
  return (
    <>
      <div ref={targetRef}>
        <InvoiceBill id={id} pdf={toPDF} />
      </div>
      
    </>
  );
};

export default Invoice;
