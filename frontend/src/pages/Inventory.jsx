import { useState } from 'react'

function Inventory() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Vehicle Inventory
          </h1>

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Vehicle
          </button>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search vehicles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            No vehicles available.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Inventory