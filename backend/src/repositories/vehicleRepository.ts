import { v4 as uuidv4 } from 'uuid'
import type { Db } from '../db/database'

export interface Vehicle {
  id: string
  make: string
  model: string
  category: string
  price: number
  quantity: number
  image_url: string
}

export interface SearchFilters {
  make?: string
  model?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export function createVehicleRepository(db: Db) {
  return {
    async findAll(): Promise<Vehicle[]> {
      return db.all<Vehicle>('SELECT * FROM vehicles')
    },

    async findById(id: string): Promise<Vehicle | undefined> {
      return db.get<Vehicle>('SELECT * FROM vehicles WHERE id = ?', [id])
    },

    async create(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
      const id = uuidv4()
      await db.run(
        'INSERT INTO vehicles (id, make, model, category, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, data.make, data.model, data.category, data.price, data.quantity, data.image_url ?? '']
      )
      return { id, ...data }
    },

    async update(id: string, data: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle | undefined> {
      const existing = await this.findById(id)
      if (!existing) return undefined

      const updated = { ...existing, ...data }
      await db.run(
        'UPDATE vehicles SET make = ?, model = ?, category = ?, price = ?, quantity = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [updated.make, updated.model, updated.category, updated.price, updated.quantity, updated.image_url ?? '', id]
      )
      return updated
    },

    async delete(id: string): Promise<boolean> {
      const result = await db.run('DELETE FROM vehicles WHERE id = ?', [id])
      return result.changes > 0
    },

    async search(filters: SearchFilters): Promise<Vehicle[]> {
      const conditions: string[] = []
      const params: (string | number)[] = []

      if (filters.make) {
        conditions.push('make LIKE ?')
        params.push(`%${filters.make}%`)
      }
      if (filters.model) {
        conditions.push('model LIKE ?')
        params.push(`%${filters.model}%`)
      }
      if (filters.category) {
        conditions.push('category LIKE ?')
        params.push(`%${filters.category}%`)
      }
      if (filters.minPrice !== undefined) {
        conditions.push('price >= ?')
        params.push(filters.minPrice)
      }
      if (filters.maxPrice !== undefined) {
        conditions.push('price <= ?')
        params.push(filters.maxPrice)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      return db.all<Vehicle>(`SELECT * FROM vehicles ${where}`, params)
    },

    async purchase(id: string, amount: number): Promise<'ok' | 'not_found' | 'out_of_stock'> {
      const vehicle = await this.findById(id)
      if (!vehicle) return 'not_found'
      if (vehicle.quantity < amount) return 'out_of_stock'

      // Atomic: only decrements if quantity is still sufficient at write time
      const result = await db.run(
        'UPDATE vehicles SET quantity = quantity - ? WHERE id = ? AND quantity >= ?',
        [amount, id, amount]
      )
      return result.changes > 0 ? 'ok' : 'out_of_stock'
    },

    async restock(id: string, amount: number): Promise<Vehicle | undefined> {
      const vehicle = await this.findById(id)
      if (!vehicle) return undefined

      await db.run('UPDATE vehicles SET quantity = quantity + ? WHERE id = ?', [amount, id])
      return this.findById(id)
    },
  }
}

export type VehicleRepository = ReturnType<typeof createVehicleRepository>
