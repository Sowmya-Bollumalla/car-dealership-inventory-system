import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import VehicleCard from './VehicleCard'

describe('VehicleCard', () => {
  const vehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  }

  it('renders vehicle details', () => {
    render(
      <VehicleCard
        vehicle={vehicle}
        onPurchase={vi.fn()}
      />
    )

    expect(screen.getByText('Toyota')).toBeInTheDocument()
    expect(screen.getByText('Camry')).toBeInTheDocument()
    expect(screen.getByText('Sedan')).toBeInTheDocument()
    expect(screen.getByText('$25,000')).toBeInTheDocument()
  })

  it('shows available stock quantity', () => {
    render(
      <VehicleCard
        vehicle={vehicle}
        onPurchase={vi.fn()}
      />
    )

    expect(screen.getByText(/5 available/i)).toBeInTheDocument()
  })

  it('calls purchase function when purchase button is clicked', () => {
    const onPurchase = vi.fn()

    render(
      <VehicleCard
        vehicle={vehicle}
        onPurchase={onPurchase}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: /purchase/i })
    )

    expect(onPurchase).toHaveBeenCalledWith(vehicle.id)
  })

  it('disables purchase button when quantity is zero', () => {
    const outOfStockVehicle = {
      ...vehicle,
      quantity: 0,
    }

    render(
      <VehicleCard
        vehicle={outOfStockVehicle}
        onPurchase={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /out of stock/i })
    ).toBeDisabled()
  })
})