import { useState } from 'react'

const vehicles = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 28000,
    quantity: 5,
  },
  {
    id: 2,
    make: 'BMW',
    model: 'X5',
    category: 'SUV',
    price: 65000,
    quantity: 0,
  },
  {
    id: 3,
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 24000,
    quantity: 3,
  },
]

function Dashboard() {
  const [search, setSearch] = useState('')

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.toLowerCase()

    return (
      vehicle.make.toLowerCase().includes(searchText) ||
      vehicle.model.toLowerCase().includes(searchText) ||
      vehicle.category.toLowerCase().includes(searchText)
    )
  })

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Available Vehicles
        </h1>

        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full md:w-96 border rounded-lg px-4 py-3 mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold">
                {vehicle.make} {vehicle.model}
              </h2>

              <p className="text-gray-500 mt-2">
                Category: {vehicle.category}
              </p>

              <p className="text-2xl font-bold mt-4">
                ${vehicle.price.toLocaleString()}
              </p>

              <p className="mt-2">
                Stock: {vehicle.quantity}
              </p>

              <button
                disabled={vehicle.quantity === 0}
                className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {vehicle.quantity === 0 ? 'Sold Out' : 'Purchase'}
              </button>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Dashboard