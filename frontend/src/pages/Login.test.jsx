import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Login from './Login'
import { AuthProvider } from '../context/AuthContext'

describe('Login Page', () => {
  it('renders the login heading', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Login /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /login/i })
    ).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Login /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument()
  })

  it('renders the login button', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Login /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /login/i })
    ).toBeInTheDocument()
  })

  it('renders a register link', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Login /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /register/i })
    ).toBeInTheDocument()
  })
})