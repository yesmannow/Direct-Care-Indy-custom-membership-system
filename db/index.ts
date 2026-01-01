import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// For local development, we use better-sqlite3
// For production on Cloudflare Pages, use D1 client
let db: ReturnType<typeof drizzle>;

// Check if we're in Cloudflare Workers/Pages environment
if (typeof (globalThis as any).DB !== 'undefined') {
  // Cloudflare D1 in production
  // IMPORTANT: In production, ensure all D1 database bindings use encrypted environment variables
  // The DB binding is automatically provided by Cloudflare Pages/Workers and is secure
  // Additional sensitive config should use encrypted secrets via Wrangler
  try {
    const { drizzle: drizzleD1 } = require('drizzle-orm/d1');

    // Get the D1 database binding from the global context
    // This is provided by Cloudflare and is already secure
    const d1Database = (globalThis as any).DB;

    // Validate that we have a database connection
    if (!d1Database) {
      throw new Error('D1 database binding not found. Ensure DB binding is configured in wrangler.toml');
    }

    db = drizzleD1(d1Database, { schema });
  } catch (e) {
    console.error('Failed to initialize D1 database:', e);
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
