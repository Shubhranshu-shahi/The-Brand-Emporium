import React from "react";
import AddItemForm from "../../components/AddItemForm";
import Navs from "./Navs";

function AddItem() {
  return (
    <>
      <Navs />
      <div className="p-4 mt-16 sm:ml-64">
        <AddItemForm />
      </div>
    </>
  );
}

export default AddItem;
