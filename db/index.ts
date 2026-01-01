import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

// Define the interface for the Cloudflare environment
export interface Env {
  DB: D1Database;
}

// Helper to get the database instance
export const getDb = (envOrDb: Env | D1Database | undefined) => {
  // 1. PRODUCTION: If a D1 database instance is passed directly
  if (envOrDb && 'prepare' in envOrDb) {
    return drizzle(envOrDb as D1Database, { schema });
  }

  // 2. PRODUCTION: If the Env object is passed
  if (envOrDb && 'DB' in (envOrDb as Env)) {
    return drizzle((envOrDb as Env).DB, { schema });
  }

  // 3. Check for global DB binding (Cloudflare Pages automatically provides this)
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
    const db = (globalThis as any).DB;
    if (!db || typeof db.prepare !== 'function') {
      throw new Error('Invalid D1 database binding: globalThis.DB exists but is not a valid D1Database instance.');
    }
    return drizzle(db, { schema });
  }

  // 4. LOCAL DEVELOPMENT: Fallback to better-sqlite3
  // CRITICAL: We use 'require' inside this check so Cloudflare's build tool
  // never sees 'better-sqlite3' or 'fs' when compiling for production.
  if (process.env.NODE_ENV === 'development') {
    try {
      const Database = require('better-sqlite3');
      const { drizzle: drizzleLocal } = require('drizzle-orm/better-sqlite3');

      // Check if we are incorrectly running in a production-like environment without D1
      console.log("Initializing local SQLite database...");
      const sqlite = new Database('local.db');
      return drizzleLocal(sqlite, { schema });
    } catch (error) {
      console.error("Local DB Error:", error);
      throw new Error("Failed to load better-sqlite3. Ensure you are in 'development' mode.");
    }
  }

  throw new Error("Database binding 'DB' not found. Ensure you have bound your D1 database in Cloudflare or wrangler.toml");
};
