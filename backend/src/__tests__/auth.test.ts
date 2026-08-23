import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createDb } from '../db/database'
import { createApp } from '../app'

async function buildApp() {
  const db = await createDb(':memory:')
  return createApp(db)
}

// ─── Register ────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('returns 201 and a JWT on valid registration', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com', role: 'user' })
    expect(res.body.user.password).toBeUndefined()
  })

  it('returns 409 when email is already registered', async () => {
    const app = await buildApp()
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice2', email: 'alice@example.com', password: 'other' })

    expect(res.status).toBe(409)
  })

  it('returns 400 when name is missing', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@example.com', password: 'password123' })

    expect(res.status).toBe(400)
  })

  it('returns 400 when email is missing', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', password: 'password123' })

    expect(res.status).toBe(400)
  })

  it('returns 400 when password is missing', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com' })

    expect(res.status).toBe(400)
  })
})

// ─── Login ───────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('returns 200 and a JWT with correct credentials', async () => {
    const app = await buildApp()
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'secret' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'secret' })

    expect(res.status).toBe(200)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user).toMatchObject({ name: 'Bob', email: 'bob@example.com', role: 'user' })
    expect(res.body.user.password).toBeUndefined()
  })

  it('returns 401 for wrong password — same message as unknown email', async () => {
    const app = await buildApp()
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'secret' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('returns 401 for non-existent email — does not leak which field was wrong', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'secret' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('returns 400 when email is missing', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'secret' })

    expect(res.status).toBe(400)
  })

  it('returns 400 when password is missing', async () => {
    const app = await buildApp()
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com' })

    expect(res.status).toBe(400)
  })
})

// ─── Auth Middleware ──────────────────────────────────────────────────────────

describe('JWT auth middleware', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const app = await buildApp()
    const res = await request(app).get('/api/vehicles')
    expect(res.status).toBe(401)
  })

  it('returns 401 for a malformed token', async () => {
    const app = await buildApp()
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', 'Bearer not.a.real.token')

    expect(res.status).toBe(401)
  })

  it('returns 401 for a tampered token', async () => {
    const app = await buildApp()
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEifQ.invalidsig')

    expect(res.status).toBe(401)
  })

  it('allows access with a valid token', async () => {
    const app = await buildApp()
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Carol', email: 'carol@example.com', password: 'pass' })

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${reg.body.token}`)

    expect(res.status).toBe(200)
  })
})
