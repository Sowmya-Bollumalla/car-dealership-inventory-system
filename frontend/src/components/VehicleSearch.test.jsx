import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import VehicleSearch from './VehicleSearch'

describe('VehicleSearch', () => {
  it('renders the search input', () => {
    render(
      <VehicleSearch
        onSearch={vi.fn()}
      />
    )

    expect(
      screen.getByPlaceholderText(/search vehicles/i)
    ).toBeInTheDocument()
  })

  it('allows the user to enter a search term', () => {
    render(
      <VehicleSearch
        onSearch={vi.fn()}
      />
    )

    const input = screen.getByPlaceholderText(/search vehicles/i)

    fireEvent.change(input, {
      target: { value: 'Toyota' },
    })

    expect(input).toHaveValue('Toyota')
  })

  it('calls onSearch when the search button is clicked', () => {
    const onSearch = vi.fn()

    render(
      <VehicleSearch
        onSearch={onSearch}
      />
    )

    const input = screen.getByPlaceholderText(/search vehicles/i)

    fireEvent.change(input, {
      target: { value: 'Toyota' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /search/i })
    )

    expect(onSearch).toHaveBeenCalledWith('Toyota')
  })
})