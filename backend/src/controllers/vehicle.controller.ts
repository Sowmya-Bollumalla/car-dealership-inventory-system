import { Response } from 'express'
import { VehicleRepository } from '../repositories/vehicleRepository'
import { AuthRequest } from '../middleware/auth'

function validateVehicleBody(body: Record<string, unknown>): string | null {
  const { make, model, category, price, quantity } = body
  if (!make || !model || !category) return 'make, model and category are required'
  if (typeof price !== 'number' || price <= 0) return 'price must be a positive number'
  if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity))
    return 'quantity must be a non-negative integer'
  return null
}

export function createVehicleController(vehicleRepo: VehicleRepository) {
  return {
    async getAll(_req: AuthRequest, res: Response): Promise<void> {
      res.status(200).json(await vehicleRepo.findAll())
    },

    async create(req: AuthRequest, res: Response): Promise<void> {
      const error = validateVehicleBody(req.body)
      if (error) {
        res.status(400).json({ message: error })
        return
      }
      const vehicle = await vehicleRepo.create({
        ...req.body,
        image_url: typeof req.body.image_url === 'string' ? req.body.image_url : '',
      })
      res.status(201).json(vehicle)
    },

    async update(req: AuthRequest, res: Response): Promise<void> {
      const vehicle = await vehicleRepo.update(req.params.id, req.body)
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' })
        return
      }
      res.status(200).json(vehicle)
    },

    async remove(req: AuthRequest, res: Response): Promise<void> {
      const deleted = await vehicleRepo.delete(req.params.id)
      if (!deleted) {
        res.status(404).json({ message: 'Vehicle not found' })
        return
      }
      res.status(200).json({ message: 'Vehicle deleted' })
    },

    async search(req: AuthRequest, res: Response): Promise<void> {
      const { make, model, category, minPrice, maxPrice } = req.query
      const vehicles = await vehicleRepo.search({
        make: make as string | undefined,
        model: model as string | undefined,
        category: category as string | undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      })
      res.status(200).json(vehicles)
    },

    async purchase(req: AuthRequest, res: Response): Promise<void> {
      const amount = Number(req.body.quantity) || 1
      const result = await vehicleRepo.purchase(req.params.id, amount)

      if (result === 'not_found') {
        res.status(404).json({ message: 'Vehicle not found' })
        return
      }
      if (result === 'out_of_stock') {
        res.status(409).json({ message: 'Vehicle is out of stock' })
        return
      }
      res.status(200).json({ message: 'Purchase successful' })
    },

    async restock(req: AuthRequest, res: Response): Promise<void> {
      const amount = Number(req.body.quantity)

      if (!amount || amount <= 0 || !Number.isInteger(amount)) {
        res.status(400).json({ message: 'quantity must be a positive integer' })
        return
      }

      const vehicle = await vehicleRepo.restock(req.params.id, amount)
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' })
        return
      }
      res.status(200).json(vehicle)
    },
  }
}
