import Database from 'better-sqlite3'
import { dirname } from 'path'
import { mkdirSync } from 'fs'

const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    image_url TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`

// Migration: add image_url to existing databases that predate this column
const MIGRATIONS = `
  ALTER TABLE vehicles ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
`

export interface Db {
  run(sql: string, params?: unknown[]): Promise<{ lastID: number; changes: number }>
  get<T>(sql: string, params?: unknown[]): Promise<T | undefined>
  all<T>(sql: string, params?: unknown[]): Promise<T[]>
  exec(sql: string): Promise<void>
  close(): Promise<void>
}

export function createDb(path: string = './dealership.db'): Promise<Db> {
  return new Promise((resolve, reject) => {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
    try {
      const raw = new Database(path)
      const db: Db = {
        run(sql, params = []) {
          const result = raw.prepare(sql).run(...params)
          return Promise.resolve({ lastID: Number(result.lastInsertRowid), changes: result.changes })
        },
        get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
          return Promise.resolve(raw.prepare(sql).get(...params) as T | undefined)
        },
        all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
          return Promise.resolve(raw.prepare(sql).all(...params) as T[])
        },
        exec(sql) {
          raw.exec(sql)
          return Promise.resolve()
        },
        close() {
          raw.close()
          return Promise.resolve()
        },
      }

      db.exec(CREATE_TABLES)
        .then(() => {
          // Run migration silently — fails harmlessly if column already exists
          return raw.prepare("SELECT COUNT(*) as c FROM pragma_table_info('vehicles') WHERE name='image_url'").get() as { c: number }
        })
        .then((row) => {
          if (row.c === 0) raw.exec(MIGRATIONS)
          resolve(db)
        })
        .catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}
