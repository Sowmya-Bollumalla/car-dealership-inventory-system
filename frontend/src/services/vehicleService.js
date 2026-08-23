import { vehiclesApi } from './api'

export const getVehicles = () => vehiclesApi.getAll()
export const searchVehicles = (filters) => vehiclesApi.search(filters)
export const addVehicle = (vehicle) => vehiclesApi.create(vehicle)
export const updateVehicle = (id, vehicle) => vehiclesApi.update(id, vehicle)
export const deleteVehicle = (id) => vehiclesApi.remove(id)
export const purchaseVehicle = (id, quantity = 1) => vehiclesApi.purchase(id, quantity)
export const restockVehicle = (id, quantity) => vehiclesApi.restock(id, quantity)
