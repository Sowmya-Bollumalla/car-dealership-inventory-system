import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Flame, LogOut, Menu, X, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { motion, AnimatePresence } from 'framer-motion'

function NavLink({ to, children, onClick }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative text-sm font-medium transition-colors"
      style={{ color: active ? '#f59e0b' : '#a8a29e' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fafaf9' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#a8a29e' }}
    >
      {children}
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
          style={{ background: '#f59e0b' }}
        />
      )}
    </Link>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const { wishlist } = useWishlist()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileOpen(false)
  }

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{ background: 'rgba(15,14,13,0.92)', borderColor: '#292524', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg transition group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)' }}
          >
            <Flame size={18} className="text-stone-900" />
          </span>
          <span className="text-lg font-bold tracking-tight" style={{ color: '#fafaf9' }}>
            Auto<span style={{ color: '#f59e0b' }}>Drive</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
          {isAdmin && <NavLink to="/add-vehicle">Add Vehicle</NavLink>}
          {isAuthenticated && (
            <NavLink to="/wishlist">
              <span className="relative inline-flex items-center gap-1">
                <Heart size={14} />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="absolute -right-4 -top-2 grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold" style={{ background: '#ef4444', color: '#fff' }}>
                    {wishlist.length}
                  </span>
                )}
              </span>
            </NavLink>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:brightness-110"
              style={{ borderColor: '#3d3835', color: '#d6d3d1', background: '#1c1917' }}
            >
              <LogOut size={15} />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium transition"
                style={{ color: '#a8a29e' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fafaf9'}
                onMouseLeave={e => e.currentTarget.style.color = '#a8a29e'}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg px-4 py-2 text-sm font-bold transition hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition"
          style={{ color: '#a8a29e' }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: '#292524', background: '#0f0e0d' }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {[['/', 'Dashboard'], ['/inventory', 'Inventory'], ...(isAdmin ? [['/add-vehicle', 'Add Vehicle']] : [])].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium transition"
                  style={{ color: '#d6d3d1' }}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 border-t pt-3" style={{ borderColor: '#292524' }}>
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold" style={{ color: '#ef4444' }}>
                    <LogOut size={15} /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm" style={{ color: '#d6d3d1' }}>Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-bold text-center" style={{ background: '#f59e0b', color: '#1c1917' }}>Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
