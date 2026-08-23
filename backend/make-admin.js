require('dotenv/config')
const sqlite3 = require('sqlite3')

const email = process.argv[2]

if (!email) {
  console.error('Usage: node make-admin.js your@email.com')
  process.exit(1)
}

const db = new sqlite3.Database(process.env.DATABASE_PATH || './data/dealership.db')

db.run("UPDATE users SET role = 'admin' WHERE email = ?", [email], function (err) {
  if (err) {
    console.error('Error:', err.message)
  } else if (this.changes === 0) {
    console.log('No user found with that email. Register first, then run this script.')
  } else {
    console.log(`Done — ${email} is now an admin. Log out and back in.`)
  }
  db.close()
})
