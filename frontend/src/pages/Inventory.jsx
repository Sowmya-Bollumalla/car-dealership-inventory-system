import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../context/VehicleContext'

function Inventory() {
  const [search, setSearch] = useState('')
  const { vehicles } = useVehicles()
  const navigate = useNavigate()

  const filteredVehicles = vehicles.filter((vehicle) =>
    `${vehicle.make} ${vehicle.model} ${vehicle.year}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Vehicle Inventory
          </h1>

          <button
            type="button"
            onClick={() => navigate('/add-vehicle')}
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

        {filteredVehicles.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No vehicles available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id || index}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h2>

                <p className="mt-2 text-gray-600">
                  Year: {vehicle.year}
                </p>

                <p className="mt-1 text-lg font-semibold text-blue-600">
                  ${vehicle.price}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Inventory