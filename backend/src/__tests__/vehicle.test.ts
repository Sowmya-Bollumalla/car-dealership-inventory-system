import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { Express } from 'express'
import { createDb, Db } from '../db/database'
import { createUserRepository } from '../repositories/userRepository'
import { createApp } from '../app'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function buildApp(): Promise<{ app: Express; db: Db }> {
  const db = await createDb(':memory:')
  return { app: createApp(db), db }
}

async function seedAdmin(
  app: Express,
  db: Db,
  email = 'admin@example.com',
  password = 'adminpass'
): Promise<string> {
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Admin', email, password })

  // Promote to admin via repository — no raw SQL in tests
  const userRepo = createUserRepository(db)
  await userRepo.setRole(email, 'admin')

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
  return res.body.token
}

async function seedUser(
  app: Express,
  email = 'user@example.com',
  password = 'userpass'
): Promise<string> {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'User', email, password })
  return res.body.token
}

// ─── Vehicle CRUD ─────────────────────────────────────────────────────────────

describe('Vehicle CRUD', () => {
  let app: Express
  let adminToken: string
  let userToken: string

  beforeEach(async () => {
    const built = await buildApp()
    app = built.app
    adminToken = await seedAdmin(app, built.db)
    userToken = await seedUser(app)
  })

  it('admin creates a vehicle — returns 201 with full vehicle object', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.make).toBe('Toyota')
    expect(res.body.model).toBe('Camry')
    expect(res.body.category).toBe('Sedan')
    expect(res.body.price).toBe(25000)
    expect(res.body.quantity).toBe(5)
  })

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota' })

    expect(res.status).toBe(400)
  })

  it('returns 400 for negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: -100, quantity: 5 })

    expect(res.status).toBe(400)
  })

  it('returns 400 for negative quantity', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: -1 })

    expect(res.status).toBe(400)
  })

  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    expect(res.status).toBe(401)
  })

  it('returns 403 when a non-admin tries to create a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    expect(res.status).toBe(403)
  })

  it('GET /api/vehicles returns 200 with all vehicles', async () => {
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  it('admin updates a vehicle — returns 200 with updated data', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    const res = await request(app)
      .put(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry Hybrid', category: 'Sedan', price: 28000, quantity: 7 })

    expect(res.status).toBe(200)
    expect(res.body.model).toBe('Camry Hybrid')
    expect(res.body.price).toBe(28000)
  })

  it('returns 404 when updating an unknown vehicle id', async () => {
    const res = await request(app)
      .put('/api/vehicles/nonexistent-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'X', model: 'Y', category: 'Z', price: 1000, quantity: 1 })

    expect(res.status).toBe(404)
  })

  it('admin deletes a vehicle — returns 200', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    const res = await request(app)
      .delete(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
  })

  it('returns 403 when a non-admin tries to delete', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    const res = await request(app)
      .delete(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(403)
  })

  it('returns 404 when deleting an unknown vehicle id', async () => {
    const res = await request(app)
      .delete('/api/vehicles/nonexistent-id')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(404)
  })
})

// ─── Search ───────────────────────────────────────────────────────────────────

describe('GET /api/vehicles/search', () => {
  let app: Express
  let token: string

  beforeEach(async () => {
    const built = await buildApp()
    app = built.app
    token = await seedAdmin(app, built.db)

    const vehicles = [
      { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
      { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 35000, quantity: 3 },
      { make: 'BMW', model: 'X5', category: 'SUV', price: 65000, quantity: 2 },
      { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 4 },
    ]
    for (const v of vehicles) {
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(v)
    }
  })

  it('returns all vehicles when no filters are provided', async () => {
    const res = await request(app)
      .get('/api/vehicles/search')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(4)
  })

  it('filters by make (case-insensitive partial match)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=toyota')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
    expect(res.body.every((v: { make: string }) => v.make === 'Toyota')).toBe(true)
  })

  it('filters by model', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?model=civic')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].model).toBe('Civic')
  })

  it('filters by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?category=SUV')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
  })

  it('filters by price range (inclusive bounds)', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?minPrice=22000&maxPrice=35000')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(3)
    expect(
      res.body.every((v: { price: number }) => v.price >= 22000 && v.price <= 35000)
    ).toBe(true)
  })

  it('combines multiple filters', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&category=SUV')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].model).toBe('RAV4')
  })

  it('returns 200 with empty array when no vehicles match', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?make=Ferrari')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

// ─── Purchase ─────────────────────────────────────────────────────────────────

describe('POST /api/vehicles/:id/purchase', () => {
  let app: Express
  let userToken: string
  let vehicleId: string

  beforeEach(async () => {
    const built = await buildApp()
    app = built.app
    const adminToken = await seedAdmin(app, built.db)
    userToken = await seedUser(app)

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 2 })
    vehicleId = vehicleRes.body.id
  })

  it('decrements quantity by 1 on purchase — returns 200', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)

    const list = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
    const updated = list.body.find((v: { id: string }) => v.id === vehicleId)
    expect(updated.quantity).toBe(1)
  })

  it('supports bulk purchase via quantity field in body', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 })

    expect(res.status).toBe(200)

    const list = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
    const updated = list.body.find((v: { id: string }) => v.id === vehicleId)
    expect(updated.quantity).toBe(0)
  })

  it('returns 409 when quantity would go below 0', async () => {
    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 })

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Vehicle is out of stock')
  })

  it('returns 404 for unknown vehicle id', async () => {
    const res = await request(app)
      .post('/api/vehicles/nonexistent-id/purchase')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(404)
  })

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)

    expect(res.status).toBe(401)
  })
})

// ─── Restock ──────────────────────────────────────────────────────────────────

describe('POST /api/vehicles/:id/restock', () => {
  let app: Express
  let adminToken: string
  let userToken: string
  let vehicleId: string

  beforeEach(async () => {
    const built = await buildApp()
    app = built.app
    adminToken = await seedAdmin(app, built.db)
    userToken = await seedUser(app)

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 3 })
    vehicleId = vehicleRes.body.id
  })

  it('admin restocks — quantity increases correctly', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 })

    expect(res.status).toBe(200)
    expect(res.body.quantity).toBe(8)
  })

  it('returns 403 when a non-admin tries to restock', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 })

    expect(res.status).toBe(403)
  })

  it('returns 404 for unknown vehicle id', async () => {
    const res = await request(app)
      .post('/api/vehicles/nonexistent-id/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 })

    expect(res.status).toBe(404)
  })

  it('returns 400 for zero restock amount', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 0 })

    expect(res.status).toBe(400)
  })

  it('returns 400 for negative restock amount', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -3 })

    expect(res.status).toBe(400)
  })

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .send({ quantity: 5 })

    expect(res.status).toBe(401)
  })
})
