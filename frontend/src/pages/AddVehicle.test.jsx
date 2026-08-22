import { VehicleProvider } from '../context/VehicleContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AddVehicle from './AddVehicle'

describe('Add Vehicle Page', () => {
  it('renders the add vehicle heading', () => {
    render(
      <MemoryRouter>
        <VehicleProvider>
          <AddVehicle />
        </VehicleProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /add vehicle/i })
    ).toBeInTheDocument()
  })

  it('renders vehicle form fields', () => {
    render(
      <MemoryRouter>
        <VehicleProvider>
          <AddVehicle />
        </VehicleProvider>
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/make/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
  })

  it('renders the save vehicle button', () => {
    render(
      <MemoryRouter>
        <VehicleProvider>
          <AddVehicle />
        </VehicleProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /save vehicle/i })
    ).toBeInTheDocument()
  })

  it('allows the user to enter vehicle details and submit the form', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <VehicleProvider>
          <AddVehicle />
        </VehicleProvider>
      </MemoryRouter>
    )

    const makeInput = screen.getByLabelText(/make/i)
    const modelInput = screen.getByLabelText(/model/i)
    const yearInput = screen.getByLabelText(/year/i)
    const priceInput = screen.getByLabelText(/price/i)

    await user.type(makeInput, 'Toyota')
    await user.type(modelInput, 'Camry')
    await user.type(yearInput, '2026')
    await user.type(priceInput, '25000')

    expect(makeInput).toHaveValue('Toyota')
    expect(modelInput).toHaveValue('Camry')
    expect(yearInput).toHaveValue(2026)
    expect(priceInput).toHaveValue(25000)

    await user.click(
      screen.getByRole('button', { name: /save vehicle/i })
    )
  })
})