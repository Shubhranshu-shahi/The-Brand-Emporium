import { Barcode, Download, DownloadIcon, Pen, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import BarcodeImage from "./BarcodeImage";
import axios from "axios";
import { getAllProduct, productInsert } from "../assets/helper/productApi";
import { handleSuccess } from "../assets/helper/utils";
import { genrateBarcode } from "../assets/helper/Helpers";

const BarcodeModal = ({ itemCode, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Barcode Generated</h2>
        <BarcodeImage itemCode={itemCode} />
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function AddItemForm() {
  const initialFormState = {
    itemName: "",
    itemHSN: "",
    category: "",
    itemCode: "",
    mrp: "",
    salePrice: "",
    taxSale: "0",
    discountSale: "",
    purchasePrice: "",
    taxPurchase: "0",
    generalTax: "0",
    sellingPrice: "",
    purchasedPrice: "",
    discountAmount: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isGenerated, setIsGenerated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const mrp = parseFloat(formData.mrp) || 0;
    const discount = parseFloat(formData.discountSale) || 0;
    const taxSale = parseFloat(formData.taxSale) || 0;
    const taxPurchase = parseFloat(formData.taxPurchase) || 0;
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const discountAmount = mrp - mrp;
    const discountedPrice = mrp - (mrp * discount) / 100;
    const salePrc = mrp - (mrp * discount) / 100;
    const sellingPrice = discountedPrice - (discountedPrice * taxSale) / 100;
    const purchasedPrice = purchasePrice + (purchasePrice * taxPurchase) / 100;

    setFormData((prev) => ({
      ...prev,
      // salePrice: discountedPrice.toFixed(2),
      salePrice: sellingPrice,
      sellingPrice: salePrc,
      // sellingPrice: sellingPrice.toFixed(2),
      purchasedPrice: purchasedPrice.toFixed(2),
    }));
  }, [
    formData.mrp,
    formData.discountSale,
    formData.taxSale,
    formData.purchasePrice,
    formData.taxPurchase,
  ]);

  // Handle form input changes

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));
  };
  // Generate Barcode Handler
  const barCodeHandler = useCallback(() => {
    setFormData((prev) => ({ ...prev, itemCode: genrateBarcode() }));
    setIsGenerated(true);
  }, []);

  //backendCall

  //save handle

  const handleSave = async () => {
    // getAllProduct();
    await productInsert(formData);
    console.log("Saved Data:", formData);
    // alert("Item Saved Successfully!");
  };

  // Save & Reset Form
  const handleSaveNew = async () => {
    console.log("Saved Data:", formData);
    await productInsert(formData);
    // alert("Item Saved & Ready for New Entry!");
    setFormData(initialFormState); // Reset form fields
    setIsGenerated(false); // Reset barcode status
  };

  const handleNumericChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots
    if (parseFloat(value) < 0) value = "0"; // Prevent negative values
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  return (
    <div class="flex-1 p-3">
      {/* <!-- Add Item Section --> */}
      <div class="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4 text-gray-700">Add Item</h3>
        {/* <!-- Additional Forms from Second Image --> */}
        <div class="grid bg-white p-6 max-w-full rounded-2xl overflow-hidden  shadow-lg grid-cols-2 gap-4 mb-4 text-gray-600">
          <input
            type="text"
            placeholder="Item Name *"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            class="w-full p-2 border rounded"
          />
          <div class="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Item HSN"
              name="itemHSN"
              value={formData.itemHSN}
              onChange={handleChange}
              class="w-full p-2 border rounded"
            />
            <button class="bg-blue-500 text-white px-3 py-2 rounded">
              <Search />
            </button>
          </div>

          <input
            class="w-full p-2 border rounded"
            list="category-list"
            id="icategoryId"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
          />

          <datalist id="category-list">
            <option value="Chocolate"></option>
            <option value="Coconut"></option>
            <option value="Mint"></option>
            <option value="Strawberry"></option>
            <option value="Vanilla"></option>
          </datalist>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Item Code"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
              class="w-full p-2 border rounded"
            />

            <button
              class="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={barCodeHandler}
            >
              {/* <Link to="myRoute" params={myParams} target="_blank"></Link> */}
              <Barcode />
            </button>
            {isGenerated && (
              <button
                type="button"
                className="px-3 py-2 bg-blue-500 text-white rounded"
                onClick={() => setModalOpen(true)}
              >
                <Pen />
              </button>
            )}
          </div>
        </div>
        <BarcodeModal
          itemCode={formData.itemCode}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        {/* <!-- Pricing & Stock Tabs --> */}
        <div class="mb-4">
          <button class="text-red-500 border-b-2 border-red-500 px-4 py-2">
            Pricing
          </button>
        </div>
        <div></div>
        <div class="grid grid-cols-3 mb-4 gap-4 max-w-full rounded-2xl overflow-hidden shadow-lg bg-white p-6 text-gray-700">
          <div>
            <label class="block text-gray-700 mt-2 font-bold">MRP</label>
          </div>
          <div>
            <label class="block text-gray-700  mt-2 font-bold">
              Percentage
            </label>
          </div>
          <div></div>
          <div>
            <input
              type="text"
              class="w-full p-2 border rounded"
              name="mrp"
              value={formData.mrp}
              onChange={handleNumericChange}
              placeholder="MRP"
            />
          </div>
          <div>
            <input
              type="text"
              class="w-full p-2 border rounded"
              name="discountSale"
              value={formData.discountSale}
              onChange={handleNumericChange}
              placeholder="Disc. on MRP"
            />
          </div>
          <div></div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4 max-w-full rounded-2xl overflow-hidden  shadow-lg bg-white p-6 text-gray-700">
          <label class="block text-gray-700 font-bold mt-2">Sale Price</label>
          <div>
            <label class="block text-gray-700  mt-2 font-bold">
              Tax on Sale Price
            </label>
          </div>
          <div>
            <label class="block text-gray-700  mt-2 font-bold">Sell At</label>
          </div>
          <div>
            <input
              type="text"
              class="w-full p-2 border rounded"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleNumericChange}
              placeholder="Sale Price"
            />
          </div>
          <div>
            <select
              class="w-full text-gray-700 p-2 h-10 border rounded"
              name="taxSale"
              value={formData.taxSale}
              onChange={handleChange}
            >
              <option>0</option>
              <option>5</option>
              <option>12</option>
              <option>18</option>
              <option>28</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              class="w-full p-2 border rounded"
              name="sellingPrice"
              readOnly
              value={formData.sellingPrice}
              placeholder="Sale Price"
            />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4 max-w-full rounded-2xl overflow-hidden  shadow-lg bg-white p-6 text-gray-700">
          <div>
            <label class="block text-gray-700 font-bold mt-1">
              Purchase Price
            </label>
          </div>
          <div>
            <label class="block text-gray-700 font-bold mt-1">
              Tax on Purchase
            </label>
          </div>
          <div>
            <label class="block text-gray-700 font-bold mt-1">
              Purchased At
            </label>
          </div>
          <div>
            <input
              type="text"
              class="w-full p-2 border rounded"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleNumericChange}
              placeholder="Purchase Price"
            />
          </div>
          <div>
            <select
              class="w-full h-10 p-2 border rounded text-gray-600"
              name="taxPurchase"
              value={formData.taxPurchase}
              onChange={handleChange}
            >
              <option>0</option>
              <option>5</option>
              <option>12</option>
              <option>16</option>
              <option>18</option>
              <option>22</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              class="w-full p-2 border rounded"
              name="purchasedPrice"
              value={formData.purchasedPrice}
              readOnly
              placeholder="Purchased Price"
            />
          </div>
        </div>

        <div class="mt-4 text-right">
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleSaveNew}
          >
            Save & New
          </button>
          <button
            type="button"
            class="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
            disabled={!formData.itemName || !formData.mrp}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItemForm;
