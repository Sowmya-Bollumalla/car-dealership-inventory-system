import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddVehicle from './AddVehicle'

// Prevent axios from crashing in jsdom (no XMLHttpRequest adapter)
vi.mock('axios', () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return { default: { create: () => instance, ...instance } }
})

vi.mock('../services/api', () => ({
  vehiclesApi: {
    create: vi.fn().mockResolvedValue({ data: { id: '1' } }),
  },
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <AddVehicle />
    </MemoryRouter>
  )
}

describe('Add Vehicle Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the add vehicle heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /add vehicle/i })).toBeInTheDocument()
  })

  it('renders all vehicle form fields', () => {
    renderPage()
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()
  })

  it('renders save and cancel buttons', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /save vehicle/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('allows the user to fill in the form', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/make/i), 'Toyota')
    await user.type(screen.getByLabelText(/model/i), 'Camry')
    await user.selectOptions(screen.getByLabelText(/category/i), 'Sedan')
    await user.type(screen.getByLabelText(/price/i), '25000')
    await user.type(screen.getByLabelText(/quantity/i), '5')

    expect(screen.getByLabelText(/make/i)).toHaveValue('Toyota')
    expect(screen.getByLabelText(/model/i)).toHaveValue('Camry')
    expect(screen.getByLabelText(/category/i)).toHaveValue('Sedan')
    expect(screen.getByLabelText(/price/i)).toHaveValue(25000)
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(5)
  })

  it('calls vehiclesApi.create with correct data on submit', async () => {
    const { vehiclesApi } = await import('../services/api')
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText(/make/i), 'Toyota')
    await user.type(screen.getByLabelText(/model/i), 'Camry')
    await user.selectOptions(screen.getByLabelText(/category/i), 'Sedan')
    await user.type(screen.getByLabelText(/price/i), '25000')
    await user.type(screen.getByLabelText(/quantity/i), '5')
    await user.click(screen.getByRole('button', { name: /save vehicle/i }))

    await waitFor(() => {
      expect(vehiclesApi.create).toHaveBeenCalledWith({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 5,
      })
    })
  })
})
