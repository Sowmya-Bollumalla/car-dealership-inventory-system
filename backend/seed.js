require('dotenv/config')
const sqlite3 = require('sqlite3')
const { v4: uuidv4 } = require('uuid')

const db = new sqlite3.Database(process.env.DATABASE_PATH || './data/dealership.db')

const vehicles = [
  { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 28000, quantity: 5 },
  { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 35000, quantity: 3 },
  { make: 'BMW', model: 'X5', category: 'SUV', price: 65000, quantity: 2 },
  { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 4 },
  { make: 'Ford', model: 'Mustang', category: 'Coupe', price: 45000, quantity: 1 },
  { make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 42000, quantity: 0 },
]

const stmt = db.prepare(
  'INSERT OR IGNORE INTO vehicles (id, make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?, ?)'
)

vehicles.forEach((v) => {
  stmt.run(uuidv4(), v.make, v.model, v.category, v.price, v.quantity)
})

stmt.finalize(() => {
  console.log(`Seeded ${vehicles.length} vehicles.`)
  db.close()
})
