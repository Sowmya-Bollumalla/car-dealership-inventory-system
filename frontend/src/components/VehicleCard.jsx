import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Heart, Tag, Pencil, Trash2, PackagePlus } from 'lucide-react'
import { fallbackImage, getVehicleImage } from '../services/vehicleImages'
import { useWishlist } from '../context/WishlistContext'

// Resolve image: use stored image_url if available, else derive from make/model
function resolveImage(vehicle) {
  return vehicle.image_url || getVehicleImage(vehicle.make, vehicle.model)
}

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-2xl border overflow-hidden animate-pulse" style={{ background: '#1c1917', borderColor: '#3d3835' }}>
      <div className="h-48 w-full" style={{ background: '#292524' }} />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 rounded" style={{ background: '#292524' }} />
        <div className="h-3 w-1/3 rounded" style={{ background: '#292524' }} />
        <div className="h-6 w-1/2 rounded" style={{ background: '#292524' }} />
        <div className="h-10 w-full rounded-lg mt-4" style={{ background: '#292524' }} />
      </div>
    </div>
  )
}

export default function VehicleCard({ vehicle, onPurchase, isAdmin, onEdit, onDelete, onRestock }) {
  const { id, make, model, category, price, quantity, image_url } = vehicle
  const isOutOfStock = quantity === 0
  const isLowStock = quantity > 0 && quantity <= 2

  const { isWishlisted, toggle } = useWishlist()
  const favorited = isWishlisted(id)
  const [status, setStatus] = useState('idle')
  const [adminOpen, setAdminOpen] = useState(false)
  const [restockQty, setRestockQty] = useState('')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, visible: false })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    setTilt({ x, y })
    const sx = ((e.clientX - rect.left) / rect.width) * 100
    const sy = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x: sx, y: sy, visible: true })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setSpotlight(s => ({ ...s, visible: false }))
  }

  const handlePurchase = async () => {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      await onPurchase(id)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 1800)
    } catch {
      setStatus('idle')
    }
  }

  const handleRestock = () => {
    const n = Number(restockQty)
    if (!Number.isInteger(n) || n <= 0) return
    onRestock?.(id, n)
    setRestockQty('')
    setAdminOpen(false)
  }

  const stockColor = isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#22c55e'
  const stockLabel = isOutOfStock ? 'Out of stock' : isLowStock ? `Only ${quantity} left` : `${quantity} available`

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#1c1917',
        borderColor: '#3d3835',
        boxShadow: '0 4px 28px rgba(0,0,0,0.45)',
        transformStyle: 'preserve-3d',
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.12s ease, border-color 0.3s',
      }}
      className="group relative overflow-hidden rounded-2xl border flex flex-col cursor-default"
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.45)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#3d3835'}
    >
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(180px circle at ${spotlight.x}% ${spotlight.y}%, rgba(245,158,11,0.09), transparent 70%)`,
        }}
      />

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image_url || getVehicleImage(make, model)}
          alt={`${make} ${model}`}
          onError={e => { e.currentTarget.src = fallbackImage }}
          className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,23,0.75) 0%, transparent 55%)' }} />

        <motion.button
          type="button"
          aria-label={`${favorited ? 'Remove from' : 'Add to'} wishlist`}
          onClick={() => toggle(vehicle)}
          whileTap={{ scale: 1.35 }}
          className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full"
          style={{ background: 'rgba(15,14,13,0.78)' }}
        >
          <Heart size={15} fill={favorited ? '#ef4444' : 'none'} color={favorited ? '#ef4444' : '#a8a29e'} />
        </motion.button>

        <span
          className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
          style={{ background: 'rgba(15,14,13,0.82)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <Tag size={10} />{category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold leading-tight" style={{ color: '#fafaf9' }}>
          {make} <span style={{ color: '#a8a29e', fontWeight: 400 }}>{model}</span>
        </h2>

        <div className="mt-3 flex items-end justify-between">
          <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            ${price.toLocaleString()}
          </p>
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: stockColor }}>
            <motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full inline-block"
              style={{ background: stockColor }}
            />
            {stockLabel}
          </span>
        </div>

        {/* Purchase */}
        <motion.button
          type="button"
          disabled={isOutOfStock || status === 'loading'}
          onClick={handlePurchase}
          whileTap={!isOutOfStock ? { scale: 0.96 } : {}}
          className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300"
          style={
            isOutOfStock
              ? { background: '#292524', color: '#57534e', cursor: 'not-allowed' }
              : status === 'success'
              ? { background: 'linear-gradient(135deg,#14532d,#166534)', color: '#4ade80' }
              : { background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }
          }
          aria-label={isOutOfStock ? `${make} ${model} is out of stock` : `Purchase ${make} ${model}`}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Processing…
              </motion.span>
            )}
            {status === 'success' && (
              <motion.span key="success" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Check size={15} /> Purchased!
              </motion.span>
            )}
            {status === 'idle' && (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {isOutOfStock ? 'Sold Out' : 'Purchase'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Admin panel toggle */}
        {isAdmin && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setAdminOpen(o => !o)}
              className="w-full rounded-lg py-1.5 text-xs font-semibold transition"
              style={{ background: '#292524', color: adminOpen ? '#f59e0b' : '#78716c', border: '1px solid #3d3835' }}
            >
              {adminOpen ? '▲ Close Admin' : '▼ Admin Actions'}
            </button>

            <AnimatePresence>
              {adminOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition hover:brightness-125"
                      style={{ background: '#1e3a5f', color: '#93c5fd', border: '1px solid #1d4ed8' }}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(id, `${make} ${model}`)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition hover:brightness-125"
                      style={{ background: '#450a0a', color: '#fca5a5', border: '1px solid #b91c1c' }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={restockQty}
                      onChange={e => setRestockQty(e.target.value)}
                      placeholder="Qty"
                      aria-label={`Restock quantity for ${make} ${model}`}
                      className="w-16 rounded-lg px-2 py-2 text-xs text-center"
                      style={{ background: '#292524', border: '1px solid #3d3835', color: '#fafaf9' }}
                    />
                    <button
                      type="button"
                      onClick={handleRestock}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition hover:brightness-125"
                      style={{ background: '#14532d', color: '#86efac', border: '1px solid #16a34a' }}
                    >
                      <PackagePlus size={12} /> Restock
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.article>
  )
}
