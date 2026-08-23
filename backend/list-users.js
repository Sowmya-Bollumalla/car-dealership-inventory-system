require('dotenv/config')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database(process.env.DATABASE_PATH || './data/dealership.db')

db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error:', err.message)
  } else if (rows.length === 0) {
    console.log('No users found. Go to http://localhost:5173/register and create an account first.')
  } else {
    console.log('Registered users:')
    rows.forEach((row) => {
      console.log(`  ${row.role.padEnd(6)} | ${row.email} | ${row.name}`)
    })
  }
  db.close()
})
