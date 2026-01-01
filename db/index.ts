import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { D1Database } from '@cloudflare/workers-types';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Global declaration for Cloudflare Pages D1 binding
// Cloudflare Pages automatically injects the DB binding as a global variable
declare global {
  var DB: D1Database | undefined;
}

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

// Initialize database for local development (synchronous)
// This works for local development where we use better-sqlite3
const sqlite = new Database('./local.db');
const localDb = drizzle(sqlite, { schema });

// Get database instance - automatically detects Cloudflare D1 or uses local SQLite
async function getDbInstance() {
  // Check for Cloudflare DB binding (available as global variable in Cloudflare Pages)
  if (typeof globalThis.DB !== 'undefined' && globalThis.DB) {
    // Cloudflare Pages environment - use D1 database
    // Use dynamic import for D1 drizzle (ES modules compatible, no require())
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');
    return drizzleD1(globalThis.DB, { schema });
  }

  // Local development - use SQLite
  return localDb;
}

// Default export for backward compatibility (local development)
// In Cloudflare Pages, use getDb() or getDbInstance() to access the D1 database
const db = localDb;

// Export function to get DB - automatically uses D1 in Cloudflare, SQLite locally
// This is the recommended way to access the database in both environments
// It checks for the global DB binding that Cloudflare Pages provides
export const getDb = async (runtimeEnv?: Env) => {
  // If runtime environment is provided (from PagesFunction context), use it
  if (runtimeEnv && isCloudflareEnv(runtimeEnv) && runtimeEnv.DB) {
    // Use dynamic import for D1 drizzle (ES modules compatible, no require())
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');

    // Validate that we have a database connection
    if (!runtimeEnv.DB) {
      throw new Error('D1 database binding not found. Ensure DB binding is configured in Cloudflare Pages settings.');
    }

    return drizzleD1(runtimeEnv.DB, { schema });
  }

  // Check for global DB binding (Cloudflare Pages automatically provides this)
  // This is the standard way to access D1 in Next.js App Router with OpenNext
  return getDbInstance();
};

// Default export - for local development (synchronous SQLite access)
// For Cloudflare Pages: Use getDb() instead, which automatically detects the global DB binding
//
// Migration note: In server components/actions, you can:
// - Keep using `db` for local development (works as-is)
// - Use `await getDb()` for Cloudflare Pages (automatically uses global DB binding)
export { db, schema, getDbInstance };
