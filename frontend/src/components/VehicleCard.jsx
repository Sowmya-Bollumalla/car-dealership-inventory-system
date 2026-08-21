function VehicleCard({ vehicle, onPurchase }) {
  const {
    make,
    model,
    category,
    price,
    quantity,
  } = vehicle

  const isSoldOut = quantity === 0

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold">
        {make} {model}
      </h2>

      <p className="text-gray-500 mt-2">
        Category: {category}
      </p>

      <p className="text-2xl font-bold mt-4">
        ${price.toLocaleString()}
      </p>

      <p className="mt-2">
        Stock: {quantity}
      </p>

      <button
        disabled={isSoldOut}
        onClick={() => onPurchase?.(vehicle)}
        className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSoldOut ? 'Sold Out' : 'Purchase'}
      </button>

    </div>
  )
}

export default VehicleCard