import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from './Dashboard'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../services/api', () => ({
  vehiclesApi: {
    getAll: vi.fn().mockResolvedValue({ data: [
      { id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
      { id: '2', make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 42000, quantity: 0 },
    ] }),
    search: vi.fn().mockResolvedValue({ data: [] }),
    purchase: vi.fn(),
    remove: vi.fn(),
    restock: vi.fn(),
  },
}))

function renderPage() {
  localStorage.setItem('token', 'header.eyJpZCI6IjEiLCJyb2xlIjoidXNlciJ9.signature')
  return render(
    <MemoryRouter>
      <AuthProvider><Dashboard /></AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => localStorage.clear())

describe('Dashboard Page', () => {
  it('renders the dashboard heading', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: /available vehicles/i })
    ).toBeInTheDocument()
  })

  it('renders available vehicles', async () => {
    renderPage()

    expect(await screen.findByText('Toyota Camry')).toBeInTheDocument()
  })

  it('renders a search input', async () => {
    renderPage()

    expect(
      await screen.findByPlaceholderText(/search vehicles/i)
    ).toBeInTheDocument()
  })

  it('renders purchase buttons', async () => {
    renderPage()

    expect(
      (await screen.findAllByRole('button', { name: /purchase/i })).length
    ).toBeGreaterThan(0)
  })

  it('disables purchase when vehicle quantity is zero', async () => {
    renderPage()

    const buttons = await screen.findAllByRole('button')

    const soldOutButton = buttons.find(
      (button) => button.textContent === 'Sold Out'
    )

    expect(soldOutButton).toBeDisabled()
  })
})