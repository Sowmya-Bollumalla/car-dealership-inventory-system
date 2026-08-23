import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Car, TrendingUp, AlertTriangle, XCircle, Plus, Search, X, SlidersHorizontal } from 'lucide-react'
import { vehiclesApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import VehicleCard, { VehicleCardSkeleton } from '../components/VehicleCard'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

/* ── Animated count-up number ── */
function CountUp({ target }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(target / 30)
    const t = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(t) }
      else setVal(start)
    }, 30)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{val}</span>
}

const CATEGORIES = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck', 'Van']

export default function Dashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [stock, setStock] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)
  const [confirm, setConfirm] = useState(null) // { id, label }

  const fetchVehicles = useCallback(async () => {
    try {
      const filters = {
        ...(category ? { category } : {}),
        ...(minPrice ? { minPrice: Number(minPrice) } : {}),
        ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
      }
      const res = Object.keys(filters).length
        ? await vehiclesApi.search(filters)
        : await vehiclesApi.getAll()
      const q = search.trim().toLowerCase()
      setVehicles(q
        ? res.data.filter(v => `${v.make} ${v.model}`.toLowerCase().includes(q))
        : res.data)
      setError('')
    } catch {
      setError('Failed to load vehicles.')
    } finally {
      setLoading(false)
    }
  }, [search, category, minPrice, maxPrice])

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    fetchVehicles()
  }, [isAuthenticated, navigate, fetchVehicles])

  const handlePurchase = async (id) => {
    await vehiclesApi.purchase(id)
    const res = await vehiclesApi.getAll()
    setVehicles(res.data)
    setNotice({ type: 'success', message: 'Vehicle purchased successfully!' })
  }

  const handleDeleteRequest = (id, label) => setConfirm({ id, label })

  const handleDeleteConfirm = async () => {
    try {
      await vehiclesApi.remove(confirm.id)
      setVehicles(prev => prev.filter(v => v.id !== confirm.id))
      setNotice({ type: 'success', message: 'Vehicle deleted.' })
    } catch (err) {
      setNotice({ type: 'error', message: err.response?.data?.message ?? 'Delete failed.' })
    } finally {
      setConfirm(null)
    }
  }

  const handleRestock = async (id, amount) => {
    try {
      await vehiclesApi.restock(id, amount)
      await fetchVehicles()
      setNotice({ type: 'success', message: `Restocked successfully.` })
    } catch (err) {
      setNotice({ type: 'error', message: err.response?.data?.message ?? 'Restock failed.' })
    }
  }

  const visible = vehicles.filter(v =>
    stock === 'all' ? true : stock === 'available' ? v.quantity > 0 : v.quantity === 0
  )

  const totalValue = vehicles.reduce((s, v) => s + v.price * v.quantity, 0)
  const available = vehicles.filter(v => v.quantity > 0).length
  const lowStock = vehicles.filter(v => v.quantity > 0 && v.quantity <= 2).length
  const outOfStock = vehicles.filter(v => v.quantity === 0).length

  const activeFilters = [
    category && { key: 'category', label: category, clear: () => setCategory('') },
    minPrice && { key: 'min', label: `Min $${minPrice}`, clear: () => setMinPrice('') },
    maxPrice && { key: 'max', label: `Max $${maxPrice}`, clear: () => setMaxPrice('') },
    stock !== 'all' && { key: 'stock', label: stock === 'available' ? 'In stock' : 'Out of stock', clear: () => setStock('all') },
  ].filter(Boolean)

  const stats = [
    { icon: Car, label: 'Total Fleet', value: vehicles.length, sub: 'vehicles', color: '#f59e0b' },
    { icon: TrendingUp, label: 'Total Value', value: `$${(totalValue / 1000).toFixed(0)}k`, sub: 'inventory worth', color: '#22c55e', raw: true },
    { icon: AlertTriangle, label: 'Low Stock', value: lowStock, sub: 'need restocking', color: '#f97316' },
    { icon: XCircle, label: 'Out of Stock', value: outOfStock, sub: 'unavailable', color: '#ef4444' },
  ]

  return (
    <main className="min-h-screen px-4 py-8 lg:px-10 lg:py-12" style={{ color: '#d6d3d1' }}>
      <Toast notice={notice} onDismiss={() => setNotice(null)} />
      <ConfirmModal
        open={!!confirm}
        title="Delete Vehicle"
        message={`Are you sure you want to remove "${confirm?.label}" from the fleet? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      <div className="mx-auto max-w-7xl">

        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 overflow-hidden rounded-3xl"
          style={{ background: 'linear-gradient(135deg,#1c1917 0%,#292524 100%)', border: '1px solid #3d3835' }}
        >
          {/* Animated amber orb */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -left-10 bottom-0 h-60 w-60 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(180,83,9,0.12) 0%, transparent 70%)' }}
          />

          <div className="relative px-8 py-12 lg:px-14 lg:py-16">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: '#f59e0b' }}
            >
              AutoDrive Inventory
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold lg:text-6xl"
              style={{ color: '#fafaf9' }}
            >
              Drive Your Next<br />
              <span style={{ color: '#f59e0b' }}>Adventure.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-4 mb-8 max-w-lg text-base"
              style={{ color: '#a8a29e' }}
            >
              Discover, manage, and move the vehicles your customers want — all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={() => document.getElementById('inventory-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-xl px-6 py-3 text-sm font-bold transition hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
              >
                Explore Inventory
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate('/add-vehicle')}
                  className="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition hover:brightness-125"
                  style={{ borderColor: '#3d3835', color: '#fafaf9', background: 'rgba(255,255,255,0.05)' }}
                >
                  <Plus size={15} /> Add Vehicle
                </button>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* ── Stats ── */}
        <section className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, sub, color, raw }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ y: -4, boxShadow: `0 8px 32px rgba(0,0,0,0.5)` }}
              className="rounded-2xl border p-5 text-left"
              style={{ background: '#1c1917', borderColor: '#3d3835' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#78716c' }}>{label}</p>
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${color}18` }}>
                  <Icon size={15} style={{ color }} />
                </span>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#fafaf9' }}>
                {raw ? value : <CountUp target={value} />}
              </p>
              <p className="mt-1 text-xs" style={{ color: '#57534e' }}>{sub}</p>
              <div className="mt-3 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${color}55, transparent)` }} />
            </motion.div>
          ))}
        </section>

        {/* ── Search & Filters ── */}
        <div id="inventory-grid" className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#78716c' }} />
              <input
                type="text"
                placeholder="Search make or model…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition"
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
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition"
              style={{
                background: filtersOpen ? 'rgba(245,158,11,0.15)' : '#1c1917',
                border: `1px solid ${filtersOpen ? '#f59e0b' : '#3d3835'}`,
                color: filtersOpen ? '#f59e0b' : '#a8a29e',
              }}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilters.length > 0 && (
                <span className="grid h-4 w-4 place-items-center rounded-full text-xs font-bold" style={{ background: '#f59e0b', color: '#1c1917' }}>
                  {activeFilters.length}
                </span>
              )}
            </motion.button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border p-4 mb-3 grid grid-cols-2 gap-3 md:grid-cols-4" style={{ background: '#1c1917', borderColor: '#3d3835' }}>
                  {/* Category pills */}
                  <div className="col-span-2 md:col-span-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#78716c' }}>Category</p>
                    <div className="flex flex-wrap gap-2">
                      {['', ...CATEGORIES].map(c => (
                        <button
                          key={c || 'all'}
                          type="button"
                          onClick={() => setCategory(c)}
                          className="rounded-full px-3 py-1 text-xs font-semibold transition"
                          style={
                            category === c
                              ? { background: '#f59e0b', color: '#1c1917' }
                              : { background: '#292524', color: '#a8a29e', border: '1px solid #3d3835' }
                          }
                        >
                          {c || 'All'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: '#78716c' }}>Min Price</label>
                    <input
                      type="number" min="0" placeholder="$0" value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: '#292524', border: '1px solid #3d3835', color: '#fafaf9' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#f59e0b'}
                      onBlur={e => e.currentTarget.style.borderColor = '#3d3835'}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: '#78716c' }}>Max Price</label>
                    <input
                      type="number" min="0" placeholder="∞" value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: '#292524', border: '1px solid #3d3835', color: '#fafaf9' }}
                      onFocus={e => e.currentTarget.style.borderColor = '#f59e0b'}
                      onBlur={e => e.currentTarget.style.borderColor = '#3d3835'}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: '#78716c' }}>Stock</label>
                    <div className="flex gap-2">
                      {[['all', 'All'], ['available', 'In Stock'], ['out', 'Out']].map(([v, l]) => (
                        <button key={v} type="button" onClick={() => setStock(v)}
                          className="flex-1 rounded-lg py-2 text-xs font-semibold transition"
                          style={stock === v ? { background: '#f59e0b', color: '#1c1917' } : { background: '#292524', color: '#a8a29e', border: '1px solid #3d3835' }}
                        >{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map(f => (
                  <motion.span
                    key={f.key}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                  >
                    {f.label}
                    <button onClick={f.clear} aria-label={`Remove ${f.label} filter`}><X size={11} /></button>
                  </motion.span>
                ))}
                <button
                  onClick={() => { setCategory(''); setMinPrice(''); setMaxPrice(''); setStock('all') }}
                  className="rounded-full px-3 py-1 text-xs font-semibold transition hover:brightness-125"
                  style={{ background: '#292524', color: '#78716c', border: '1px solid #3d3835' }}
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: '#78716c' }}>
              {loading ? 'Loading…' : <><span style={{ color: '#fafaf9', fontWeight: 600 }}>{visible.length}</span> vehicle{visible.length !== 1 ? 's' : ''} found</>}
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 rounded-xl px-4 py-3 text-sm" style={{ background: '#450a0a', color: '#fca5a5', border: '1px solid #b91c1c' }}>
            {error}
          </motion.p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
          </div>
        ) : visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border py-20 text-center"
            style={{ background: '#1c1917', borderColor: '#3d3835' }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Car size={52} style={{ color: '#3d3835' }} />
            </motion.div>
            <p className="mt-5 text-lg font-bold" style={{ color: '#57534e' }}>No vehicles found</p>
            <p className="mt-2 text-sm" style={{ color: '#44403c' }}>Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setStock('all') }}
              className="mt-6 rounded-xl px-5 py-2.5 text-sm font-bold transition hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onPurchase={handlePurchase}
                    isAdmin={isAdmin}
                    onEdit={id => navigate(`/edit-vehicle/${id}`)}
                    onDelete={handleDeleteRequest}
                    onRestock={handleRestock}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}
