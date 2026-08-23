import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'
import { AuthProvider } from '../context/AuthContext'

describe('Navbar', () => {
  it('renders the dealership brand name', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Navbar /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByText('AutoDrive')
    ).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Navbar /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /home/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /inventory/i })
    ).toBeInTheDocument()

  })

  it('renders login and register links', () => {
    render(
      <MemoryRouter>
        <AuthProvider><Navbar /></AuthProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /login/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /register/i })
    ).toBeInTheDocument()
  })
})