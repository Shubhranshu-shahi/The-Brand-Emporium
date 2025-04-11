function CustomerDetails({ customer, setCustomer, getCustomerByPhone }) {
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setCustomer({ ...customer, phone });

    if (phone.trim() !== "" && phone.length > 9 && phone.length < 11) {
      getCustomerByPhone(phone);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="font-semibold text-gray-700 mb-2">Customer Details</h2>

      <label className="block font-semibold text-gray-400 mt-2">
        Phone No.
      </label>
      <input
        type="text"
        name="phone"
        className="w-full p-2 text-black border rounded"
        placeholder="Phone No."
        value={customer.phone}
        onChange={handlePhoneChange}
      />

      <label className="block font-semibold text-gray-400">Customer</label>
      <input
        name="customerName"
        className="w-full p-2 border text-black rounded border-amber-600"
        value={customer.customerName}
        onChange={(e) =>
          setCustomer({ ...customer, customerName: e.target.value })
        }
      />

      <label className="block font-semibold text-gray-400 mt-2">
        Customer GSTIN
      </label>
      <input
        name="CustomerGstin"
        className="w-full p-2 border text-black rounded border-amber-600"
        value={customer.CustomerGstin}
        onChange={(e) =>
          setCustomer({ ...customer, CustomerGstin: e.target.value })
        }
      />

      <label className="block font-semibold text-gray-400 mt-2">
        Customer Email
      </label>
      <input
        name="customerEmail"
        className="w-full p-2 border text-black rounded border-amber-600"
        value={customer.customerEmail}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
      />
    </div>
  );
}

export default CustomerDetails;
