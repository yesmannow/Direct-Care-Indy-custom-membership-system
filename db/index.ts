import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Define the interface for the Cloudflare environment
export interface Env {
  DB: D1Database;
}

/**
 * Get database instance - automatically detects environment and uses appropriate database.
 *
 * Production (Cloudflare Pages): Uses D1 via globalThis.DB binding
 * Development (local): Uses SQLite via better-sqlite3
 *
 * @param envOrDb - Optional: Env object with DB property, or D1Database instance directly
 * @returns Drizzle database instance (never returns undefined, throws on error)
 * @throws Error if database is not available or misconfigured
 */
export const getDb = async (envOrDb?: Env | D1Database) => {
  // 1. If a D1 database instance is passed directly (Production/Preview)
  if (envOrDb && typeof envOrDb === 'object' && 'prepare' in envOrDb) {
    return drizzle(envOrDb as D1Database, { schema });
  }

  // 2. If the Env object is passed (Production/Preview)
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

  // 4. Fallback for Local Development ONLY
  // This code path is IMPOSSIBLE in production builds because:
  // - Webpack will not bundle better-sqlite3 (via serverExternalPackages)
  // - require() is only available in Node.js, not in Cloudflare Edge runtime
  // - NODE_ENV is 'production' in Cloudflare builds
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasRequire = typeof require !== 'undefined';

  if (isDevelopment && hasRequire) {
    try {
      // Use require() (not import) to prevent Webpack from analyzing/bundling this module
      // This is safe because require() is only available in Node.js (dev), not in Edge runtime
      const Database = require('better-sqlite3');
      const { drizzle: drizzleLocal } = require('drizzle-orm/better-sqlite3');

      if (!Database) {
        throw new Error('better-sqlite3 module not found');
      }

      // Create/open local.db file
      const sqlite = new Database('./local.db');
      return drizzleLocal(sqlite, { schema });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const nodeVersion = process.version;
      const requiredVersion = '>=20.19.0';

      // Provide detailed diagnostics for common Windows issues
      let remediation = '';
      if (errorMessage.includes('Cannot find module') || errorMessage.includes('not found')) {
        remediation =
          '1. Run: npm install (without --omit=dev)\n' +
          '2. If better-sqlite3 is in optionalDependencies and install skipped it, run: npm install better-sqlite3\n' +
          '3. Rebuild native module: npm run rebuild:sqlite';
      } else if (errorMessage.includes('bindings') || errorMessage.includes('.node') || errorMessage.includes('MSVC')) {
        remediation =
          'Native module compilation failed. Try:\n' +
          '1. Rebuild: npm run rebuild:sqlite\n' +
          '2. Ensure Node version matches package.json engines (' + requiredVersion + '). Current: ' + nodeVersion + '\n' +
          '3. On Windows: Install Visual Studio Build Tools (C++ workload) if compilation is required\n' +
          '4. Alternative: Use prebuilt binaries by ensuring npm can download them';
      } else {
        remediation =
          '1. Run: npm install (without --omit=dev)\n' +
          '2. Rebuild native module: npm run rebuild:sqlite\n' +
          '3. Ensure Node version matches package.json engines (' + requiredVersion + '). Current: ' + nodeVersion;
      }

      throw new Error(
        `Failed to initialize local SQLite database: ${errorMessage}\n\n` +
        `Remediation:\n${remediation}\n\n` +
        `If you see this in production, check that D1 binding is configured in Cloudflare Pages.`
      );
    }
  }

  // Production build without D1 binding - this should never happen if configured correctly
  throw new Error(
    "Database binding 'DB' not found.\n" +
    "Production (Cloudflare Pages): Ensure D1 database is bound in wrangler.toml and Cloudflare Pages settings.\n" +
    "Development (local): Ensure NODE_ENV=development and better-sqlite3 is installed."
  );
};
