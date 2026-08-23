import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Flame, Car } from 'lucide-react'
import { vehiclesApi } from '../services/api'
import { getVehicleImage, fallbackImage } from '../services/vehicleImages'

const CATEGORIES = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck', 'Van']

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

const labelStyle = {
  display: 'block',
  marginBottom: '0.375rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#a8a29e',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

export default function AddVehicle() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ make: '', model: '', category: '', price: '', quantity: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Live preview: resolve image from current make+model
  const previewImage = formData.make || formData.model
    ? getVehicleImage(formData.make, formData.model)
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Resolve and persist the image URL at creation time
      const image_url = getVehicleImage(formData.make, formData.model)
      await vehiclesApi.create({
        make: formData.make,
        model: formData.model,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        image_url,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0e0d' }} className="px-5 py-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-2xl">

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm font-semibold transition hover:brightness-125"
          style={{ color: '#f59e0b' }}
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)' }}>
            <Flame size={22} style={{ color: '#1c1917' }} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Admin workspace</p>
            <h1 className="text-3xl font-bold" style={{ color: '#fafaf9' }}>Add Vehicle</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border px-4 py-3 text-sm" style={{ background: '#450a0a', borderColor: '#b91c1c', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <div className="rounded-2xl border p-7" style={{ background: '#1c1917', borderColor: '#3d3835' }}>

          {/* Live image preview */}
          {previewImage && (
            <div className="mb-7 overflow-hidden rounded-xl" style={{ border: '1px solid #3d3835' }}>
              <img
                src={previewImage}
                alt="Vehicle preview"
                onError={e => { e.currentTarget.src = fallbackImage }}
                className="h-44 w-full object-cover"
              />
              <p className="px-3 py-2 text-xs" style={{ background: '#292524', color: '#78716c' }}>
                Image preview — {formData.make || '?'} {formData.model || ''}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Make</label>
                <input
                  name="make" type="text" value={formData.make} onChange={handleChange}
                  placeholder="e.g. BMW" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'}
                />
              </div>
              <div>
                <label style={labelStyle}>Model</label>
                <input
                  name="model" type="text" value={formData.model} onChange={handleChange}
                  placeholder="e.g. 3 Series" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                name="category" value={formData.category} onChange={handleChange}
                required style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Price ($)</label>
                <input
                  name="price" type="number" min="1" value={formData.price} onChange={handleChange}
                  placeholder="45000" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'}
                />
              </div>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input
                  name="quantity" type="number" min="0" value={formData.quantity} onChange={handleChange}
                  placeholder="5" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button" onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-xl py-3 text-sm font-semibold transition hover:brightness-110"
                style={{ background: '#292524', border: '1px solid #3d3835', color: '#a8a29e' }}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-1 rounded-xl py-3 text-sm font-bold transition hover:brightness-110 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}
              >
                {loading ? 'Saving…' : 'Save Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
