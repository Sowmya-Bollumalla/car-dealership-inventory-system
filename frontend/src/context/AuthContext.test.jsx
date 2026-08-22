import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function TestComponent() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div>
      <p data-testid="user">
        {user ? user.username : 'No user'}
      </p>

      <p data-testid="authenticated">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </p>
    </div>
  )
}

describe('AuthContext', () => {
  it('starts with no authenticated user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent(
      'No user'
    )

    expect(
      screen.getByTestId('authenticated')
    ).toHaveTextContent('Not authenticated')
  })
})