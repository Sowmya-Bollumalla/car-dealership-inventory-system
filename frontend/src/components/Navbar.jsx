import { Link } from 'react-router-dom'
import { Car } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Car size={28} />
          <span className="text-xl font-bold">
            AutoDrive
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/inventory"
            className="hover:text-blue-400 transition"
          >
            Inventory
          </Link>

          <Link
            to="/about"
            className="hover:text-blue-400 transition"
          >
            About
          </Link>

          <Link
            to="/login"
            className="hover:text-blue-400 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            Register
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar