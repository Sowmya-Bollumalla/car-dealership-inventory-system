import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Flame, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const inputStyle = {
  background: '#292524',
  border: '1px solid #3d3835',
  color: '#fafaf9',
  borderRadius: '0.625rem',
  padding: '0.75rem 1rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
}

function Field({ label, id, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={id} style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.8rem', fontWeight: 600, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {children}
    </motion.div>
  )
}

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(form.email, form.password)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid email or password')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="grid lg:grid-cols-[1.1fr_0.9fr]"
      style={{ minHeight: 'calc(100vh - 65px)', background: '#0f0e0d' }}
    >
      {/* Left — car image panel */}
      <section className="relative hidden overflow-hidden lg:block" style={{ background: '#1c1917' }}>
        <img
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=85"
          alt="Premium car on a city road"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.45 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,14,13,0.92) 0%, rgba(15,14,13,0.2) 60%, transparent 100%)' }} />
        {/* Amber vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 80%, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative flex h-full flex-col justify-end p-14"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>
            The road starts here
          </p>
          <h2 className="text-6xl font-bold leading-tight" style={{ color: '#fafaf9' }}>
            Find Your<br />Next Drive.
          </h2>
          <p className="mt-5 max-w-sm text-base" style={{ color: '#a8a29e' }}>
            Explore, manage and purchase vehicles from one intelligent dealership platform.
          </p>

          {/* Decorative stat pills */}
          <div className="mt-10 flex gap-4">
            {[['500+', 'Vehicles'], ['24/7', 'Support'], ['100%', 'Secure']].map(([val, lbl]) => (
              <div key={lbl} className="rounded-xl px-4 py-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{val}</p>
                <p className="text-xs" style={{ color: '#78716c' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Right — form panel */}
      <section className="flex items-center justify-center px-5 py-12 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)' }}>
              <Flame size={20} style={{ color: '#1c1917' }} />
            </span>
            <span className="text-xl font-bold" style={{ color: '#fafaf9' }}>Auto<span style={{ color: '#f59e0b' }}>Drive</span></span>
          </div>

          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Welcome back</p>
          <h1 className="text-4xl font-bold" style={{ color: '#fafaf9' }}>Sign In</h1>
          <p className="mt-2 mb-8 text-sm" style={{ color: '#78716c' }}>Enter your credentials to access your account.</p>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden rounded-lg border px-4 py-3 text-sm"
                style={{ background: '#450a0a', borderColor: '#b91c1c', color: '#fca5a5' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.45 }}
          >
            <Field label="Email Address" id="email">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}
              />
            </Field>

            <Field label="Password" id="password">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                  style={{ color: '#78716c' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                  onMouseLeave={e => e.currentTarget.style.color = '#78716c'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="relative w-full overflow-hidden rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: loading ? '#92400e' : 'linear-gradient(135deg,#f59e0b,#b45309)',
                color: '#1c1917',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {/* Shimmer sweep on hover */}
              <motion.span
                className="absolute inset-0 -skew-x-12"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.55 }}
              />
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                : <><span>Sign In</span><ArrowRight size={16} /></>
              }
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#292524' }} />
            <span className="text-xs" style={{ color: '#57534e' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#292524' }} />
          </div>

          <p className="text-center text-sm" style={{ color: '#78716c' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold transition hover:underline"
              style={{ color: '#f59e0b' }}
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}

export default Login
