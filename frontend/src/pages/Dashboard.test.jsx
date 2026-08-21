import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard Page', () => {
  it('renders the dashboard heading', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /available vehicles/i })
    ).toBeInTheDocument()
  })

  it('renders available vehicles', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

   expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
  })

  it('renders a search input', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(
      screen.getByPlaceholderText(/search vehicles/i)
    ).toBeInTheDocument()
  })

  it('renders purchase buttons', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(
      screen.getAllByRole('button', { name: /purchase/i }).length
    ).toBeGreaterThan(0)
  })

  it('disables purchase when vehicle quantity is zero', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    const buttons = screen.getAllByRole('button')

    const soldOutButton = buttons.find(
      (button) => button.textContent === 'Sold Out'
    )

    expect(soldOutButton).toBeDisabled()
  })
})