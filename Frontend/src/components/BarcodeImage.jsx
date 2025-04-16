import React from "react";
import Barcode from "react-barcode";
function BarcodeImage({ itemCode }) {
  console.log(itemCode);

  return (
    <div>
      <div className="p-4  flex items-center">
        <Barcode value={itemCode} />
      </div>
    </div>
  );
}

export default BarcodeImage;
