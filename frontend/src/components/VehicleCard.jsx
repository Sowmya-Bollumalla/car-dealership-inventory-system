import React from 'react'

function VehicleCard({ vehicle, onPurchase }) {
  const {
    id,
    make,
    model,
    category,
    price,
    quantity,
  } = vehicle

  const isOutOfStock = quantity === 0

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-900">
        {make}
      </h2>

      <h3 className="text-lg text-gray-700">
        {model}
      </h3>

      <p className="mt-2 text-gray-500">
        {category}
      </p>

      <p className="mt-3 text-2xl font-bold text-blue-600">
        ${price.toLocaleString()}
      </p>

      <p className="mt-2 text-sm text-gray-600">
        {quantity} available
      </p>

      <button
        type="button"
        disabled={isOutOfStock}
        onClick={() => onPurchase(id)}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isOutOfStock ? 'Out of Stock' : 'Purchase'}
      </button>
    </div>
  )
}

export default VehicleCard