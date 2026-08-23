require('dotenv/config')
const Database = require('better-sqlite3')

const db = new Database(process.env.DATABASE_PATH || './data/dealership.db')

const modelImages = {
  'toyota camry':   'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  'toyato camry':   'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  'toyota rav4':    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
  'bmw x5':         'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
  'honda civic':    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
  'ford mustang':   'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  'ford explorer':  'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80',
  'tesla model 3':  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  'audi a4':        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',
  'audi r8':        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
}

const brandImages = {
  toyota:  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  toyato:  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
  bmw:     'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
  honda:   'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
  ford:    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
  tesla:   'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
  audi:    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=900&q=80',
  mercedes:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  porsche: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  ferrari: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=900&q=80',
}

const fallback = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'

const vehicles = db.prepare('SELECT id, make, model FROM vehicles').all()
const stmt = db.prepare('UPDATE vehicles SET image_url = ? WHERE id = ?')

vehicles.forEach(v => {
  const makeKey = v.make.trim().toLowerCase()
  const fullKey = (v.make + ' ' + v.model).trim().toLowerCase().replace(/\s+/g, ' ')
  const url = modelImages[fullKey] || brandImages[makeKey] || fallback
  stmt.run(url, v.id)
  console.log(`${v.make} ${v.model} -> ${url.slice(0, 55)}...`)
})

db.close()
console.log('\nBackfill complete.')
