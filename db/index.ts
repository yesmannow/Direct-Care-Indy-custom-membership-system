import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

// Global declaration for Cloudflare Pages D1 binding
// Cloudflare Pages automatically injects the DB binding as a global variable
// Binding name must be exactly "DB" as configured in wrangler.toml
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

// Get database instance - automatically detects Cloudflare D1 or uses local SQLite
// CRITICAL: In production (Cloudflare), this ONLY uses D1 via globalThis.DB
// better-sqlite3 is NEVER imported or executed in Cloudflare environment
async function getDbInstance() {
  // Check for Cloudflare DB binding (available as global variable in Cloudflare Pages)
  // This is the ONLY way to access D1 in production
  if (typeof globalThis.DB !== 'undefined' && globalThis.DB) {
    // Cloudflare Pages environment - use D1 database
    // Use dynamic import for D1 drizzle (ES modules compatible, no require())
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');
    return drizzleD1(globalThis.DB, { schema });
  }

  // Local development ONLY - dynamically import better-sqlite3
  // This code path NEVER executes in Cloudflare Pages (globalThis.DB is always present there)
  // Only import better-sqlite3 when NOT in Cloudflare environment
  try {
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;
    const sqlite = new Database('./local.db');
    return drizzle(sqlite, { schema });
  } catch (error) {
    // If better-sqlite3 is not available (e.g., in Cloudflare), throw clear error
    throw new Error(
      'Database not available. In Cloudflare Pages, ensure DB binding is configured. ' +
      'In local development, ensure better-sqlite3 is installed.'
    );
  }
}

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

// CRITICAL: Do NOT export `db` directly - it would import better-sqlite3 at module load
// All server code MUST use `await getDb()` to ensure Cloudflare compatibility
// The `db` export is removed to prevent accidental usage in production code

// Export schema for type definitions
export { schema, getDbInstance };
