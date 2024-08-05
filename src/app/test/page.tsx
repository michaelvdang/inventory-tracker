import React from 'react'

const TestPage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-yellow-600">
      <div className="w-[10000px] h-1/2 bg-red-600 overflow-x-auto ">
        <div className="w-[1600px] bg-blue-700">
          <h1>Test Page</h1>
        </div>
      </div>
    </div>
  )
}

export default TestPage