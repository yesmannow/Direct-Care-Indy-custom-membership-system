import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

/**
 * Database instance using Vercel Postgres
 * This is a singleton instance that connects to Vercel Postgres
 * using the POSTGRES_URL environment variable.
 */
export const db = drizzle(sql, { schema });

/**
 * Get database instance - maintained for backward compatibility
 * with existing code that uses `await getDb()`
 *
 * @returns Drizzle database instance
 */
export const getDb = async () => db;
