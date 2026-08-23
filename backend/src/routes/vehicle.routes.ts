import { Router } from 'express'
import { createVehicleController } from '../controllers/vehicle.controller'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { VehicleRepository } from '../repositories/vehicleRepository'

export function createVehicleRouter(vehicleRepo: VehicleRepository) {
  const router = Router()
  const controller = createVehicleController(vehicleRepo)

  router.use(requireAuth)

  router.get('/', (req, res) => controller.getAll(req, res))
  router.get('/search', (req, res) => controller.search(req, res))
  router.post('/', requireAdmin, (req, res) => controller.create(req, res))
  router.put('/:id', requireAdmin, (req, res) => controller.update(req, res))
  router.delete('/:id', requireAdmin, (req, res) => controller.remove(req, res))
  router.post('/:id/purchase', (req, res) => controller.purchase(req, res))
  router.post('/:id/restock', requireAdmin, (req, res) => controller.restock(req, res))

  return router
}
