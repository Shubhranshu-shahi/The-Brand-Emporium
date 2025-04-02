import React from 'react'
import { useForm } from 'react-hook-form';


function FormTest() {
     const {
       register,
       handleSubmit,
       watch,
       formState: { errors },
     } = useForm();
  return (
    <form action="">
      <div>
        <label htmlFor="">First Name</label>
        <input type="text" name="" id="" />
      </div>
      <div>
        <label htmlFor="">Middle Name</label>
        <input type="text" name="" id="" />
      </div>
      <div>
        <label htmlFor="">last Name</label>
        <input type="text" name="" id="" />
      </div>
      
    </form>
  );
}

export default FormTest