import 'dotenv/config'
import { createDb } from './db/database'
import { createApp } from './app'

const PORT = process.env.PORT ?? 5000
const DATABASE_PATH = process.env.DATABASE_PATH ?? './data/dealership.db'

createDb(DATABASE_PATH).then((db) => {
  const app = createApp(db)
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
