import { VehicleProvider } from '../context/VehicleContext'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Inventory from './Inventory'

describe('Inventory Page', () => {
  it('renders the inventory heading', () => {
    render(
      <MemoryRouter>
        <VehicleProvider>
          <Inventory />
        </VehicleProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /vehicle inventory/i })
    ).toBeInTheDocument()
  })

  it('renders the add vehicle button', () => {
    render(
      <MemoryRouter>
        <VehicleProvider>
          <Inventory />
        </VehicleProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /add vehicle/i })
    ).toBeInTheDocument()
  })

  it('renders the search vehicles input', () => {
    render(
      <MemoryRouter>
        <VehicleProvider>
          <Inventory />
        </VehicleProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByPlaceholderText(/search vehicles/i)
    ).toBeInTheDocument()
  })
})