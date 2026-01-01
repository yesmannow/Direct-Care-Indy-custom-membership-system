import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// For local development, we use better-sqlite3
// For production on Cloudflare Pages, this will be replaced with D1 client
const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });

export { schema };
