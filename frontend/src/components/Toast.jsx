import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ notice, onDismiss }) {
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [notice, onDismiss])

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed right-5 top-20 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl"
          style={{
            background: notice.type === 'success' ? '#14532d' : '#450a0a',
            borderColor: notice.type === 'success' ? '#16a34a' : '#b91c1c',
            color: '#fafaf9',
          }}
        >
          {notice.type === 'success'
            ? <CheckCircle size={18} className="text-green-400 shrink-0" />
            : <XCircle size={18} className="text-red-400 shrink-0" />}
          <span className="text-sm font-medium">{notice.message}</span>
          <button
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="ml-2 text-stone-400 hover:text-white transition"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
