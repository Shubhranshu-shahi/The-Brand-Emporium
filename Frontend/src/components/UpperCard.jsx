import React from 'react'

function UpperCard() {
  return (
      <div>
          <div>
        <div class="my-6">
          <div class="rounded-t-2xl bg-gray-900  w-full cursor-pointer select-none border-2 border-teal-600/30 px-4 py-4 text-gray-100 transition duration-300 hover:border-teal-600/80 hover:text-white">
            <h4 class="text-lg font-medium">Name</h4>
          </div>
          <div className="rounded-b-2xl border-x-2 border-b-2  border-teal-400 bg-dark px-4 py-4">
            <div class="flex justify-between text-sm ">
              <label class="flex items-center space-x-2 text-gray-200 font-medium mb-1">
                Email :<span className="ml-2 text-teal-400">abc@xyz.com</span>
              </label>
              <label class="flex items-center space-x-2 text-gray-200 font-medium mb-1">
                Phone :<span className="ml-2 text-teal-400">999999999</span>
              </label>
            </div>
            <div class="flex justify-between text-sm ">
              <label class="flex items-center space-x-2 text-gray-200 font-medium mb-1">
                GSTIN :<span className="ml-2 text-teal-400">123456</span>
              </label>
              {/* <label class="absolute inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Toggle me
                </span>
              </label> */}
              <label class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span>Party Status</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpperCard