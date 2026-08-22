import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../context/VehicleContext'

function AddVehicle() {
  const navigate = useNavigate()
  const { addVehicle } = useVehicles()

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    addVehicle({
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
    })

    navigate('/inventory')
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Add Vehicle
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg bg-white p-8 shadow"
        >
          <div>
            <label
              htmlFor="make"
              className="mb-2 block font-medium text-gray-700"
            >
              Make
            </label>

            <input
              id="make"
              name="make"
              type="text"
              value={formData.make}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Toyota"
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className="mb-2 block font-medium text-gray-700"
            >
              Model
            </label>

            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Camry"
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className="mb-2 block font-medium text-gray-700"
            >
              Year
            </label>

            <input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="2026"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block font-medium text-gray-700"
            >
              Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="25000"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Vehicle
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddVehicle