import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './jwt'

export interface AuthRequest extends Request {
  user?: { id: string; role: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' })
    return
  }

  try {
    req.user = verifyToken(header.slice(7))
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' })
    return
  }
  next()
}
