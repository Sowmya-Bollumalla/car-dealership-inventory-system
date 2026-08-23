import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/userRepository'
import { signToken } from '../middleware/jwt'

function publicUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export function createAuthController(userRepo: UserRepository) {
  return {
    async register(req: Request, res: Response): Promise<void> {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email and password are required' })
        return
      }

      if (await userRepo.findByEmail(email)) {
        res.status(409).json({ message: 'Email already registered' })
        return
      }

      const hashed = await bcrypt.hash(password, 10)
      const user = await userRepo.create({ name, email, password: hashed, role: 'user' })
      const token = signToken({ id: user.id, role: user.role })

      res.status(201).json({ token, user: publicUser(user) })
    },

    async login(req: Request, res: Response): Promise<void> {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const user = await userRepo.findByEmail(email)
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }

      const token = signToken({ id: user.id, role: user.role })
      res.status(200).json({ token, user: publicUser(user) })
    },
  }
}
