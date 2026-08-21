import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Register from './Register'

describe('Register Page', () => {
  it('renders the register heading', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /register/i })
    ).toBeInTheDocument()
  })

  it('renders name, email, password and confirm password inputs', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByLabelText(/name/i)
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/^password$/i)
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/confirm password/i)
    ).toBeInTheDocument()
  })

  it('renders the register button', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument()
  })

  it('renders a login link', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /login/i })
    ).toBeInTheDocument()
  })
})