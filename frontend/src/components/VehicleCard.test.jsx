import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import VehicleCard from './VehicleCard'

const vehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 28000,
  quantity: 5,
}

describe('VehicleCard', () => {
  it('renders vehicle details', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
    expect(screen.getByText(/sedan/i)).toBeInTheDocument()
    expect(screen.getByText(/\$28,000/)).toBeInTheDocument()
    expect(screen.getByText(/stock: 5/i)).toBeInTheDocument()
  })

  it('renders the purchase button when vehicle is available', () => {
    render(<VehicleCard vehicle={vehicle} />)

    expect(
      screen.getByRole('button', { name: /purchase/i })
    ).toBeInTheDocument()
  })

  it('calls purchase handler when purchase is clicked', async () => {
    const handlePurchase = vi.fn()

    render(
      <VehicleCard
        vehicle={vehicle}
        onPurchase={handlePurchase}
      />
    )

    screen.getByRole('button', { name: /purchase/i }).click()

    expect(handlePurchase).toHaveBeenCalledWith(vehicle)
  })

  it('disables purchase when stock is zero', () => {
    const soldOutVehicle = {
      ...vehicle,
      make: 'BMW',
      model: 'X5',
      quantity: 0,
    }

    render(<VehicleCard vehicle={soldOutVehicle} />)

    const button = screen.getByRole('button', {
      name: /sold out/i,
    })

    expect(button).toBeDisabled()
  })
})