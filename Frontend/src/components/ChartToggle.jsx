import React from "react";

const ChartToggle = ({ selected, setSelected }) => {
  const options = ["day", "month", "year"];

  return (
    <div className="flex justify-center gap-2 my-4">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setSelected(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            selected === opt
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ChartToggle;
