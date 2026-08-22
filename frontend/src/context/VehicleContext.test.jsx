import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  VehicleProvider,
  useVehicles,
} from './VehicleContext'

describe('VehicleContext', () => {
  it('adds a vehicle to the inventory', () => {
    const { result } = renderHook(() => useVehicles(), {
      wrapper: VehicleProvider,
    })

    act(() => {
      result.current.addVehicle({
        make: 'Toyota',
        model: 'Camry',
        year: 2026,
        price: 25000,
      })
    })

    expect(result.current.vehicles).toHaveLength(1)
    expect(result.current.vehicles[0]).toMatchObject({
      make: 'Toyota',
      model: 'Camry',
      year: 2026,
      price: 25000,
    })
  })
})