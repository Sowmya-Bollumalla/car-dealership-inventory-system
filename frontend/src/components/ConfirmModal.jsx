import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative w-full max-w-sm rounded-2xl border p-7 shadow-2xl"
            style={{ background: '#1c1917', borderColor: '#3d3835' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                style={{ background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)' }}
              >
                <AlertTriangle size={20} style={{ color: danger ? '#ef4444' : '#f59e0b' }} />
              </span>
              <h2 className="text-lg" style={{ color: '#fafaf9' }}>{title}</h2>
            </div>
            <p className="mb-7 text-sm" style={{ color: '#a8a29e' }}>{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:brightness-110"
                style={{ borderColor: '#3d3835', color: '#d6d3d1', background: '#292524' }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition hover:brightness-110"
                style={{ background: danger ? '#b91c1c' : '#b45309', color: '#fff' }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
