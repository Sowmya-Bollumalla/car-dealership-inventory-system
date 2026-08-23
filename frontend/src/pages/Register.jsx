import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.register(form.name, form.email, form.password)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#292524',
    border: '1px solid #3d3835',
    color: '#fafaf9',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    width: '100%',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#a8a29e',
  }

  return (
    <main style={{ background: '#0f0e0d', minHeight: 'calc(100vh - 73px)' }} className="grid lg:grid-cols-[0.9fr_1.1fr]">
      {/* Left panel */}
      <section className="relative hidden overflow-hidden lg:block" style={{ background: '#1c1917' }}>
        <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=85" alt="Luxury vehicle showroom" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,14,13,0.85) 0%, transparent 60%)' }} />
        <div className="relative flex h-full flex-col justify-end p-14">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em]" style={{ color: '#f59e0b' }}>Join the fleet</p>
          <h2 className="text-6xl font-bold leading-tight" style={{ color: '#fafaf9' }}>Make every<br />mile count.</h2>
          <p className="mt-5 max-w-md text-lg" style={{ color: '#a8a29e' }}>Create your account and keep your next favorite vehicle in sight.</p>
        </div>
      </section>

      {/* Right panel */}
      <section className="flex items-center justify-center px-5 py-12 lg:px-14">
        <div className="w-full max-w-md rounded-2xl border p-8" style={{ background: '#1c1917', borderColor: '#3d3835' }}>

          {/* Mobile logo */}
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)' }}>
              <Car size={22} style={{ color: '#1c1917' }} />
            </span>
            <span className="text-xl font-bold" style={{ color: '#fafaf9' }}>Auto<span style={{ color: '#f59e0b' }}>Drive</span></span>
          </div>

          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Start your journey</p>
          <h1 className="text-3xl font-bold" style={{ color: '#fafaf9' }}>Create Account</h1>
          <p className="mt-1 mb-7 text-sm" style={{ color: '#78716c' }}>Fill in your details to get started.</p>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm" style={{ background: '#450a0a', borderColor: '#b91c1c', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" style={labelStyle}>Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}
              />
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{ ...inputStyle, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-9 transition"
                style={{ color: '#78716c' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                onMouseLeave={e => e.currentTarget.style.color = '#78716c'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirm-password" style={labelStyle}>Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                style={{ ...inputStyle, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'}
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-9 transition"
                style={{ color: '#78716c' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                onMouseLeave={e => e.currentTarget.style.color = '#78716c'}
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 font-bold transition hover:brightness-110 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#78716c' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition hover:underline" style={{ color: '#f59e0b' }}>Login</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register
