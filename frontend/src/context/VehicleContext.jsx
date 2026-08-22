import { createContext, useContext, useState } from 'react'

const VehicleContext = createContext()

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([])

  const addVehicle = (vehicle) => {
    setVehicles((prevVehicles) => [
      ...prevVehicles,
      vehicle
    ])
  }

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle }}>
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehicleContext)

  if (!context) {
    throw new Error('useVehicles must be used inside VehicleProvider')
  }

  return context
}