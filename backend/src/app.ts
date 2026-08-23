import express from 'express'
import cors from 'cors'
import { Db } from './db/database'
import { createUserRepository } from './repositories/userRepository'
import { createVehicleRepository } from './repositories/vehicleRepository'
import { createAuthRouter } from './routes/auth.routes'
import { createVehicleRouter } from './routes/vehicle.routes'

export function createApp(db: Db) {
  const app = express()

  app.use(cors({ origin: 'http://localhost:5173' }))
  app.use(express.json())

  const userRepo = createUserRepository(db)
  const vehicleRepo = createVehicleRepository(db)

  app.get('/', (_req, res) => res.json({ status: 'ok', message: 'AutoDrive API running' }))

  app.use('/api/auth', createAuthRouter(userRepo))
  app.use('/api/vehicles', createVehicleRouter(vehicleRepo))

  return app
}
