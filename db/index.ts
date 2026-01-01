import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { D1Database } from '@cloudflare/workers-types';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Type-safe interface for Cloudflare environment
export interface Env {
  DB: D1Database;
}

// Type guard to check if we're in Cloudflare environment
function isCloudflareEnv(env: unknown): env is Env {
  return (
    typeof env === 'object' &&
    env !== null &&
    'DB' in env &&
    typeof (env as Env).DB === 'object' &&
    (env as Env).DB !== null
  );
}

// Type-safe global context interface (no 'any')
interface CloudflareGlobal {
  env?: Env;
  DB?: D1Database;
}

// For local development, we use better-sqlite3
// For production on Cloudflare Pages, use D1 client via getDb()
const sqlite = new Database('./local.db');
const db = drizzle(sqlite, { schema });

// Export function to get DB with environment context (for Cloudflare Pages Functions)
// This is the type-safe way to get the database in Cloudflare environment
// Returns D1 database in Cloudflare, SQLite in local development
export const getDb = async (runtimeEnv?: Env) => {
  // If runtime environment is provided and valid, use D1
  if (runtimeEnv && isCloudflareEnv(runtimeEnv) && runtimeEnv.DB) {
    // Use dynamic import for D1 drizzle (ES modules compatible, no require())
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');

    // Validate that we have a database connection
    if (!runtimeEnv.DB) {
      throw new Error('D1 database binding not found. Ensure DB binding is configured in Cloudflare Pages settings.');
    }

    return drizzleD1(runtimeEnv.DB, { schema });
  }

  // Check global context as fallback (for Cloudflare Workers compatibility)
  const globalContext = globalThis as CloudflareGlobal;

  if (globalContext.env && isCloudflareEnv(globalContext.env) && globalContext.env.DB) {
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');
    return drizzleD1(globalContext.env.DB, { schema });
  }

  if (globalContext.DB) {
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');
    return drizzleD1(globalContext.DB, { schema });
  }

  // Fallback to local SQLite for development
  return db;
};

// Default export for local development and backward compatibility
// In Cloudflare Pages Functions, use getDb(env) instead
export { db, schema };
