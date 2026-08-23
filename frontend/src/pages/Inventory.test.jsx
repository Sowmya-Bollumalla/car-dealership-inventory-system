import { VehicleProvider } from '../context/VehicleContext'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Inventory from './Inventory'
import { AuthProvider } from '../context/AuthContext'

describe('Inventory Page', () => {
  it('renders the inventory heading', () => {
    render(
      <MemoryRouter>
        <AuthProvider><VehicleProvider><Inventory /></VehicleProvider></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /vehicle inventory/i })
    ).toBeInTheDocument()
  })

  it('hides the add vehicle button for unauthenticated users', () => {
    render(
      <MemoryRouter>
        <AuthProvider><VehicleProvider><Inventory /></VehicleProvider></AuthProvider>
      </MemoryRouter>
    )

    expect(screen.queryByRole('button', { name: /add vehicle/i })).not.toBeInTheDocument()
  })

  it('renders the search vehicles input', () => {
    render(
      <MemoryRouter>
        <AuthProvider><VehicleProvider><Inventory /></VehicleProvider></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByPlaceholderText(/search vehicles/i)
    ).toBeInTheDocument()
  })
})