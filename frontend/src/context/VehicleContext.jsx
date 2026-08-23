import { createContext, useContext, useState } from 'react'
import {
  getVehicles,
  searchVehicles,
  addVehicle as createVehicleRequest,
  updateVehicle as updateVehicleRequest,
  deleteVehicle as deleteVehicleRequest,
  purchaseVehicle,
  restockVehicle,
} from '../services/vehicleService'

const VehicleContext = createContext()

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([])

  const loadVehicles = async () => {
    const response = await getVehicles()
    setVehicles(response.data)
    return response.data
  }

  const fetchVehicles = loadVehicles

  const search = async (filters) => {
    const response = await searchVehicles(filters)
    setVehicles(response.data)
    return response.data
  }

  const addVehicle = (vehicle) => {
    setVehicles((prevVehicles) => [
      ...prevVehicles,
      vehicle
    ])
  }

  const createVehicle = async (vehicle) => {
    const response = await createVehicleRequest(vehicle)
    setVehicles((current) => [...current, response.data])
    return response.data
  }

  const updateVehicle = async (id, vehicle) => {
    const response = await updateVehicleRequest(id, vehicle)
    setVehicles((current) => current.map((item) => item.id === id ? response.data : item))
    return response.data
  }

  const deleteVehicle = async (id) => {
    await deleteVehicleRequest(id)
    setVehicles((current) => current.filter((item) => item.id !== id))
  }

  const purchase = async (id, quantity = 1) => {
    const response = await purchaseVehicle(id, quantity)
    await fetchVehicles()
    return response.data
  }

  const restock = async (id, quantity) => {
    const vehicle = await restockVehicle(id, quantity)
    setVehicles((current) => current.map((item) => item.id === id ? vehicle.data : item))
    return vehicle.data
  }

  return (
    <VehicleContext.Provider value={{
      vehicles,
      addVehicle,
      fetchVehicles,
      search,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      purchase,
      restock,
    }}>
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