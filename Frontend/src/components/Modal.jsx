import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 sm:w-3/4 lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Invoice</h2>
          <button onClick={onClose} className="text-gray-500">
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-25"
      ></div>
    </div>
  );
};

export default Modal;
