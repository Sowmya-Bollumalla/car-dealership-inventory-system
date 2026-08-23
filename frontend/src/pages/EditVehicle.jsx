import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Flame } from 'lucide-react'
import { useVehicles } from '../context/VehicleContext'
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

export default function EditVehicle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { vehicles, updateVehicle } = useVehicles()
  const vehicle = vehicles.find(v => v.id === id)

  const [form, setForm] = useState(vehicle ?? { make: '', model: '', category: '', price: '', quantity: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (!vehicle) return (
    <main style={{ minHeight: '100vh', background: '#0f0e0d' }} className="flex items-center justify-center">
      <p style={{ color: '#ef4444' }}>Vehicle not found.</p>
    </main>
  )

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  // Show updated preview if make/model changed, else show stored image
  const previewImage = form.make || form.model
    ? getVehicleImage(form.make, form.model)
    : vehicle.image_url || fallbackImage

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      // Re-resolve image_url based on updated make/model
      const image_url = getVehicleImage(form.make, form.model)
      await updateVehicle(id, {
        make: form.make,
        model: form.model,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        image_url,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update vehicle')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f0e0d' }} className="px-5 py-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-2xl">

        <button
          type="button" onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm font-semibold transition hover:brightness-125"
          style={{ color: '#f59e0b' }}
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <div className="mb-8 flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)' }}>
            <Flame size={22} style={{ color: '#1c1917' }} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Admin workspace</p>
            <h1 className="text-3xl font-bold" style={{ color: '#fafaf9' }}>Edit Vehicle</h1>
            <p className="text-sm" style={{ color: '#78716c' }}>{vehicle.make} {vehicle.model}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border px-4 py-3 text-sm" style={{ background: '#450a0a', borderColor: '#b91c1c', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <div className="rounded-2xl border p-7" style={{ background: '#1c1917', borderColor: '#3d3835' }}>

          {/* Live image preview */}
          <div className="mb-7 overflow-hidden rounded-xl" style={{ border: '1px solid #3d3835' }}>
            <img
              src={previewImage}
              alt="Vehicle preview"
              onError={e => { e.currentTarget.src = fallbackImage }}
              className="h-44 w-full object-cover"
            />
            <p className="px-3 py-2 text-xs" style={{ background: '#292524', color: '#78716c' }}>
              Image preview — {form.make || '?'} {form.model || ''}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Make</label>
                <input name="make" type="text" value={form.make} onChange={handleChange} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'} />
              </div>
              <div>
                <label style={labelStyle}>Model</label>
                <input name="model" type="text" value={form.model} onChange={handleChange} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#3d3835'}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Price ($)</label>
                <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'} />
              </div>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#f59e0b'}
                  onBlur={e => e.target.style.borderColor = '#3d3835'} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-xl py-3 text-sm font-semibold transition hover:brightness-110"
                style={{ background: '#292524', border: '1px solid #3d3835', color: '#a8a29e' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 rounded-xl py-3 text-sm font-bold transition hover:brightness-110 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#1c1917' }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
