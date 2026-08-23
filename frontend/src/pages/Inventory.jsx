import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus, Car } from 'lucide-react'
import { useVehicles } from '../context/VehicleContext'
import { useAuth } from '../context/AuthContext'
import { fallbackImage, getVehicleImage } from '../services/vehicleImages'

export default function Inventory() {
  const [search, setSearch] = useState('')
  const { vehicles, fetchVehicles } = useVehicles()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchVehicles().catch(() => {}) }, [])

  const filtered = vehicles.filter(v =>
    `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main style={{ minHeight: '100vh', background: '#0f0e0d', color: '#d6d3d1' }} className="px-5 py-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Fleet operations</p>
            <h1 className="text-4xl font-bold" style={{ color: '#fafaf9' }}>Vehicle Inventory</h1>
            <p className="mt-1 text-sm" style={{ color: '#78716c' }}>
              {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} in fleet
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/add-vehicle')}
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
            >
              <Plus size={15} /> Add Vehicle
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#78716c' }} />
          <input
            type="text"
            placeholder="Search by make or model…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl py-3 pl-11 pr-10 text-sm outline-none"
            style={{ background: '#1c1917', border: '1px solid #3d3835', color: '#fafaf9' }}
            onFocus={e => e.currentTarget.style.borderColor = '#f59e0b'}
            onBlur={e => e.currentTarget.style.borderColor = '#3d3835'}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#78716c' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border py-20 text-center"
            style={{ background: '#1c1917', borderColor: '#3d3835' }}
          >
            <Car size={48} style={{ color: '#3d3835' }} />
            <p className="mt-4 text-lg font-bold" style={{ color: '#57534e' }}>No vehicles found</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 rounded-xl px-5 py-2 text-sm font-bold transition hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id || i}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
                  whileHover={{ y: -5 }}
                  className="group overflow-hidden rounded-2xl border"
                  style={{ background: '#1c1917', borderColor: '#3d3835', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#3d3835'}
                >
                  {/* Image — use stored image_url, fall back to getVehicleImage */}
                  <div className="relative overflow-hidden">
                    <img
                      src={vehicle.image_url || getVehicleImage(vehicle.make, vehicle.model)}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      onError={e => { e.currentTarget.src = fallbackImage }}
                      className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,23,0.7) 0%, transparent 55%)' }} />
                    <span
                      className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                      style={{ background: 'rgba(15,14,13,0.82)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      {vehicle.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold" style={{ color: '#fafaf9' }}>
                      {vehicle.make} <span style={{ color: '#a8a29e', fontWeight: 400 }}>{vehicle.model}</span>
                    </h2>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                        ${vehicle.price.toLocaleString()}
                      </p>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: vehicle.quantity === 0 ? '#ef4444' : vehicle.quantity <= 2 ? '#f59e0b' : '#22c55e' }}
                      >
                        {vehicle.quantity === 0 ? 'Out of stock' : `${vehicle.quantity} available`}
                      </span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
                        className="mt-4 w-full rounded-xl py-2 text-xs font-bold transition hover:brightness-110"
                        style={{ background: '#292524', border: '1px solid #3d3835', color: '#a8a29e' }}
                      >
                        Edit Vehicle
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}
