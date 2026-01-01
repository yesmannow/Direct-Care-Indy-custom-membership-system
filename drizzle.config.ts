import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql', // "postgresql" | "mysql" | "sqlite"
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
