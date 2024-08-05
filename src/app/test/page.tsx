import React from 'react'

const TestPage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-yellow-600">
      <div className="w-[10000px] h-1/2 bg-red-600 overflow-x-auto ">
        <div className="w-[1600px] bg-blue-700">
          Test GET / 500 in 134ms
 ⨯ src/app/page.tsx (24:27) @ localStorage
 ⨯ ReferenceError: localStorage is not defined
    at Home (./src/app/page.tsx:24:29)
digest: "3895432383"
     |                           ^
  25 |   const [showOthers, setShowOthers] = useState(false);
  27 |   const [isUpdating, setIsUpdating] = useState(false);
 GET / 500 in 71ms
 GET /test 200 in 82ms

        </div>
      </div>
    </div>
  )
}

export default TestPage