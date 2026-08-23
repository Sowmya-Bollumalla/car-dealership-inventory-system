import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const storageKey = user?.id ? `wishlist_${user.id}` : 'wishlist_guest'

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch {
      return []
    }
  })

  // Re-load when user changes (login/logout)
  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem(storageKey) || '[]'))
    } catch {
      setWishlist([])
    }
  }, [storageKey])

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlist))
  }, [wishlist, storageKey])

  const isWishlisted = (id) => wishlist.some(v => v.id === id)

  const toggle = (vehicle) => {
    setWishlist(prev =>
      prev.some(v => v.id === vehicle.id)
        ? prev.filter(v => v.id !== vehicle.id)
        : [...prev, vehicle]
    )
  }

  const remove = (id) => setWishlist(prev => prev.filter(v => v.id !== id))

  const clear = () => setWishlist([])

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggle, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
