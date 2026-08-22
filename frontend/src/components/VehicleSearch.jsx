import React, { useState } from 'react'

function VehicleSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  return (
    <div className="flex w-full gap-3">
      <input
        type="text"
        placeholder="Search vehicles"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
      />

      <button
        type="button"
        onClick={handleSearch}
        className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  )
}

export default VehicleSearch