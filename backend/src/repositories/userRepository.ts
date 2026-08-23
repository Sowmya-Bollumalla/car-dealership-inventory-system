import { v4 as uuidv4 } from 'uuid'
import type { Db } from '../db/database'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
}

export function createUserRepository(db: Db) {
  return {
    async findByEmail(email: string): Promise<User | undefined> {
      return db.get<User>('SELECT * FROM users WHERE email = ?', [email])
    },

    async findById(id: string): Promise<User | undefined> {
      return db.get<User>('SELECT * FROM users WHERE id = ?', [id])
    },

    async create(data: Omit<User, 'id'>): Promise<User> {
      const id = uuidv4()
      await db.run(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [id, data.name, data.email, data.password, data.role]
      )
      return { id, ...data }
    },

    async setRole(email: string, role: 'user' | 'admin'): Promise<void> {
      await db.run('UPDATE users SET role = ? WHERE email = ?', [role, email])
    },
  }
}

export type UserRepository = ReturnType<typeof createUserRepository>
