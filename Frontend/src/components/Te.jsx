import { Barcode, Pen, Search } from "lucide-react";
import React, { useState, useCallback } from "react";
import { genrateBarcode } from "../assets/helper/Helpers";
import BarcodeImage from "./BarcodeImage";

// Barcode Modal Component
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

function Te() {
  const [formData, setFormData] = useState({
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
  });

  const [isGenerated, setIsGenerated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate Barcode Handler
  const barCodeHandler = useCallback(() => {
    setFormData((prev) => ({ ...prev, itemCode: genrateBarcode() }));
    setIsGenerated(true);
  }, []);

  return (
    <div className="flex-1 p-3">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add Item</h3>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-gray-600">
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Item Name *"
            className="w-full p-2 border rounded"
          />
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="itemHSN"
              value={formData.itemHSN}
              onChange={handleChange}
              placeholder="Item HSN"
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              <Search />
            </button>
          </div>

          <input
            className="w-full p-2 border rounded"
            list="category-list"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <datalist id="category-list">
            <option value="Chocolate" />
            <option value="Coconut" />
            <option value="Mint" />
            <option value="Strawberry" />
            <option value="Vanilla" />
          </datalist>

          {/* Barcode Section */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="itemCode"
              value={formData.itemCode}
              readOnly
              placeholder="Item Code"
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={barCodeHandler}
            >
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

        {/* Barcode Modal */}
        <BarcodeModal
          itemCode={formData.itemCode}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Pricing & Stock Section */}
        <div className="border-b mb-4">
          <button
            type="button"
            className="text-red-500 border-b-2 border-red-500 px-4 py-2"
          >
            Pricing
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-gray-700">
          <input
            type="text"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="MRP"
          />
          <label className="block text-gray-700 mt-2 font-bold">
            Tax on Sale Price
          </label>
          <label className="block text-gray-700 mt-2 font-bold">
            Percentage
          </label>

          <input
            type="text"
            name="salePrice"
            value={formData.salePrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Sale Price"
          />
          <select
            name="taxSale"
            value={formData.taxSale}
            onChange={handleChange}
            className="w-full text-gray-700 p-2 h-10 border rounded"
          >
            <option>0</option>
            <option>12</option>
            <option>16</option>
            <option>18</option>
            <option>22</option>
          </select>
          <input
            type="text"
            name="discountSale"
            value={formData.discountSale}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Disc. on Sale Price"
          />

          <label className="block text-gray-700 font-bold mt-1">
            Purchase Price
          </label>
          <label className="block text-gray-700 font-bold mt-1">
            Tax on Purchase
          </label>
          <input
            type="text"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Purchase Price"
          />
          <select
            name="taxPurchase"
            value={formData.taxPurchase}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-600"
          >
            <option>0</option>
            <option>5</option>
            <option>12</option>
            <option>16</option>
            <option>18</option>
            <option>22</option>
          </select>

          <label className="block text-gray-700 font-bold mt-1">Taxes</label>
          <select
            name="generalTax"
            value={formData.generalTax}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-600"
          >
            <option>0</option>
            <option>5</option>
            <option>12</option>
            <option>16</option>
            <option>18</option>
            <option>22</option>
          </select>
        </div>

        {/* Save Buttons */}
        <div className="mt-4 text-right">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Save & New
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Te;
