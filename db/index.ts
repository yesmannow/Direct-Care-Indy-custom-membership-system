import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

// Define the interface for the Cloudflare environment
export interface Env {
  DB: D1Database;
}

/**
 * Detect if we're running in Edge runtime (Cloudflare Workers/Edge)
 * vs Node.js runtime
 */
function isEdgeRuntime(): boolean {
  // Check for Edge runtime indicators
  if (process.env.NEXT_RUNTIME === 'edge') {
    return true;
  }

  // Check for Cloudflare Edge runtime globals
  if (typeof globalThis !== 'undefined' && (globalThis as any).EdgeRuntime) {
    return true;
  }

  // If we don't have Node.js process.versions, we're likely in Edge
  if (typeof process === 'undefined' || !process.versions?.node) {
    return true;
  }

  return false;
}

/**
 * Detect if we're running in Node.js runtime
 */
function isNodeRuntime(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node && !isEdgeRuntime();
}

/**
 * Get database instance - automatically detects environment and uses appropriate database.
 *
 * Production (Cloudflare Pages): Uses D1 via globalThis.DB binding
 * Development (local Node): Uses SQLite via better-sqlite3
 * Development (local Edge): Requires D1 binding or shows helpful error
 *
 * @param envOrDb - Optional: Env object with DB property, or D1Database instance directly
 * @returns Drizzle database instance (never returns undefined, throws on error)
 * @throws Error if database is not available or misconfigured
 */
export const getDb = async (envOrDb?: Env | D1Database) => {
  // 1. PRODUCTION: If a D1 database instance is passed directly
  if (envOrDb && typeof envOrDb === 'object' && 'prepare' in envOrDb) {
    return drizzle(envOrDb as D1Database, { schema });
  }

  // 2. PRODUCTION: If the Env object is passed
  if (envOrDb && typeof envOrDb === 'object' && 'DB' in envOrDb) {
    const db = (envOrDb as Env).DB;
    if (!db) {
      throw new Error('D1 database binding is undefined in Env object. Check Cloudflare Pages configuration.');
    }
    return drizzle(db, { schema });
  }

  // 3. Check for global DB binding (Cloudflare Pages automatically provides this)
  // This is the primary path for production builds
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
    const db = (globalThis as any).DB;
    if (!db || typeof db.prepare !== 'function') {
      throw new Error('Invalid D1 database binding: globalThis.DB exists but is not a valid D1Database instance.');
    }
    return drizzle(db, { schema });
  }

  // 4. RUNTIME DETECTION: Never use better-sqlite3 in Edge runtime
  const isEdge = isEdgeRuntime();
  const isNode = isNodeRuntime();

  if (isEdge) {
    // Edge runtime without D1 binding - show helpful error
    throw new Error(
      'You are running in Edge runtime without D1 binding.\n' +
      'For local Edge development, run: `npx wrangler dev` (or `wrangler pages dev`) with DB binding configured in wrangler.toml.\n' +
      'Alternatively, remove `export const runtime = "edge"` from your route to use Node runtime with SQLite.'
    );
  }

  // 5. LOCAL DEVELOPMENT (Node runtime only): Fallback to better-sqlite3
  // CRITICAL: We use 'require' inside this check so Cloudflare's build tool
  // never sees 'better-sqlite3' or 'fs' when compiling for production.
  if (isNode && process.env.NODE_ENV === 'development') {
    try {
      // Use require() (not import) to prevent Webpack from analyzing/bundling this module
      // This is safe because require() is only available in Node.js, not in Edge runtime
      const Database = require('better-sqlite3');
      const { drizzle: drizzleLocal } = require('drizzle-orm/better-sqlite3');

      if (!Database) {
        throw new Error('better-sqlite3 module not found');
      }

      console.log("Initializing local SQLite database...");
      // Create/open local.db file
      const sqlite = new Database('./local.db');
      return drizzleLocal(sqlite, { schema });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Local DB Error:", error);
      throw new Error(
        `Failed to initialize local SQLite database: ${errorMessage}\n` +
        'Make sure better-sqlite3 is installed: npm install\n' +
        'If you see this in production, check that D1 binding is configured in Cloudflare Pages.'
      );
    }
  }

  // Production build without D1 binding - this should never happen if configured correctly
  throw new Error(
    "Database binding 'DB' not found.\n" +
    "Production (Cloudflare Pages): Ensure D1 database is bound in wrangler.toml and Cloudflare Pages settings.\n" +
    "Development (local): Ensure you're running in Node runtime (not Edge) and better-sqlite3 is installed."
  );
};
