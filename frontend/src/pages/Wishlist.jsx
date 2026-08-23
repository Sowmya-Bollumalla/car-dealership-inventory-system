import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trash2, ShoppingBag, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { vehiclesApi } from '../services/api'
import { fallbackImage, getVehicleImage } from '../services/vehicleImages'
import Toast from '../components/Toast'

export default function Wishlist() {
  const { wishlist, remove, clear } = useWishlist()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [purchasing, setPurchasing] = useState(null) // id
  const [purchased, setPurchased] = useState(null)   // id
  const [notice, setNotice] = useState(null)

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handlePurchase = async (vehicle) => {
    if (vehicle.quantity === 0) return
    setPurchasing(vehicle.id)
    try {
      await vehiclesApi.purchase(vehicle.id)
      setPurchased(vehicle.id)
      setNotice({ type: 'success', message: `${vehicle.make} ${vehicle.model} purchased!` })
      setTimeout(() => {
        setPurchased(null)
        remove(vehicle.id)
      }, 1600)
    } catch (err) {
      setNotice({ type: 'error', message: err.response?.data?.message ?? 'Purchase failed.' })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0e0d', color: '#d6d3d1' }} className="px-5 py-8 lg:px-10 lg:py-12">
      <Toast notice={notice} onDismiss={() => setNotice(null)} />

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Your collection</p>
            <h1 className="text-4xl font-bold flex items-center gap-3" style={{ color: '#fafaf9' }}>
              <Heart size={32} fill="#ef4444" color="#ef4444" />
              Wishlist
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#78716c' }}>
              {wishlist.length} vehicle{wishlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:brightness-110"
              style={{ background: '#450a0a', border: '1px solid #b91c1c', color: '#fca5a5' }}
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border py-24 text-center"
            style={{ background: '#1c1917', borderColor: '#3d3835' }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={56} style={{ color: '#3d3835' }} />
            </motion.div>
            <p className="mt-5 text-xl font-bold" style={{ color: '#57534e' }}>Your wishlist is empty</p>
            <p className="mt-2 text-sm" style={{ color: '#44403c' }}>Tap the heart on any vehicle to save it here</p>
            <button
              onClick={() => navigate('/')}
              className="mt-7 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
            >
              Browse Vehicles <ArrowRight size={15} />
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {wishlist.map((vehicle, i) => {
                const isOut = vehicle.quantity === 0
                const isLow = vehicle.quantity > 0 && vehicle.quantity <= 2
                const stockColor = isOut ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e'
                const stockLabel = isOut ? 'Out of stock' : isLow ? `Only ${vehicle.quantity} left` : `${vehicle.quantity} available`
                const isBuying = purchasing === vehicle.id
                const isDone = purchased === vehicle.id

                return (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.25 } }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-2xl border flex flex-col"
                    style={{ background: '#1c1917', borderColor: '#3d3835', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#3d3835'}
                  >
                    {/* Remove button */}
                    <motion.button
                      type="button"
                      aria-label={`Remove ${vehicle.make} ${vehicle.model} from wishlist`}
                      onClick={() => remove(vehicle.id)}
                      whileTap={{ scale: 1.3 }}
                      className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full"
                      style={{ background: 'rgba(15,14,13,0.82)' }}
                    >
                      <Heart size={15} fill="#ef4444" color="#ef4444" />
                    </motion.button>

                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={vehicle.image_url || getVehicleImage(vehicle.make, vehicle.model)}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        onError={e => { e.currentTarget.src = fallbackImage }}
                        className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,23,0.75) 0%, transparent 55%)' }} />
                      <span
                        className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                        style={{ background: 'rgba(15,14,13,0.82)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                      >
                        {vehicle.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-lg font-bold" style={{ color: '#fafaf9' }}>
                        {vehicle.make} <span style={{ color: '#a8a29e', fontWeight: 400 }}>{vehicle.model}</span>
                      </h2>

                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                          ${vehicle.price.toLocaleString()}
                        </p>
                        <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: stockColor }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: stockColor }} />
                          {stockLabel}
                        </span>
                      </div>

                      {/* Purchase button */}
                      <motion.button
                        type="button"
                        disabled={isOut || isBuying}
                        onClick={() => handlePurchase(vehicle)}
                        whileTap={!isOut ? { scale: 0.96 } : {}}
                        className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300"
                        style={
                          isOut
                            ? { background: '#292524', color: '#57534e', cursor: 'not-allowed' }
                            : isDone
                            ? { background: 'linear-gradient(135deg,#14532d,#166534)', color: '#4ade80' }
                            : { background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }
                        }
                      >
                        <AnimatePresence mode="wait">
                          {isBuying && (
                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                              <Loader2 size={15} className="animate-spin" /> Processing…
                            </motion.span>
                          )}
                          {isDone && (
                            <motion.span key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                              <Check size={15} /> Purchased!
                            </motion.span>
                          )}
                          {!isBuying && !isDone && (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                              <ShoppingBag size={14} />
                              {isOut ? 'Sold Out' : 'Purchase'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}
