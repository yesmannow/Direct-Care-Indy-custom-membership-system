import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// For local development, we use better-sqlite3
// For production on Cloudflare Pages, use D1 client
let db: ReturnType<typeof drizzle>;

// Check if we're in Cloudflare Workers/Pages environment
if (typeof (globalThis as any).DB !== 'undefined') {
  // Cloudflare D1 in production
  try {
    const { drizzle: drizzleD1 } = require('drizzle-orm/d1');
    db = drizzleD1((globalThis as any).DB, { schema });
  } catch (e) {
    // Fallback to local if D1 drizzle not available
    const sqlite = new Database('./local.db');
    db = drizzle(sqlite, { schema });
  }
} else {
  // Local development with better-sqlite3
  const sqlite = new Database('./local.db');
  db = drizzle(sqlite, { schema });
}

export { db, schema };
