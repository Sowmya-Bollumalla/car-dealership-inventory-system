import { Router } from 'express'
import { createAuthController } from '../controllers/auth.controller'
import { UserRepository } from '../repositories/userRepository'

export function createAuthRouter(userRepo: UserRepository) {
  const router = Router()
  const controller = createAuthController(userRepo)

  router.post('/register', (req, res) => controller.register(req, res))
  router.post('/login', (req, res) => controller.login(req, res))

  return router
}
