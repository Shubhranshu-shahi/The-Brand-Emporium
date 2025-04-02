import React from "react";

function Cards() {
  return (
    <div>
      <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        {/* <div className="md:flex"> */}
        <div className="p-8">
          <div className="uppercase  text-white mb-2 md:text-2xl sm:text-xs font-semibold tracking-tight">
            Total Receivable
          </div>
          <a
            href="#"
            className="block mt-3 text-2xl leading-tight font-medium text-green-600 hover:underline"
          >
            $42291
          </a>
          <p className="mt-2 text-gray-500">
            from <span className="text-green-600 text-2xl">13</span> parties
          </p>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default Cards;
