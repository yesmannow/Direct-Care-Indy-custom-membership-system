import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Households Table - Groups family members together
export const households = sqliteTable('households', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // e.g., "The Smith Family"
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Members Table - Individual patients with Pike Medical DPC membership
export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  dateOfBirth: text('date_of_birth').notNull(), // ISO date string for age calculation
  householdId: integer('household_id').references(() => households.id),
  status: text('status').notNull().default('active'), // 'active', 'inactive', 'pending'
});

// Inventory Table - Consolidated medications and labs with wholesale pricing
// Stores prices in CENTS to avoid floating-point precision issues
export const inventory = sqliteTable('inventory', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // e.g., "Amoxicillin" or "Lipid Panel"
  category: text('category').notNull(), // 'medication' or 'lab'
  wholesalePrice: integer('wholesale_price').notNull(), // Price in cents (e.g., 300 for $3.00)
  stockLevel: integer('stock_level').notNull().default(0),
  description: text('description'),
  dosage: text('dosage'), // For medications: e.g., "500mg"
});

// Services Table - Define which services are covered (90%) vs insurance-only (10%)
export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'included' or 'insurance_only'
  description: text('description'),
});

// Relations
export const householdsRelations = relations(households, ({ many }) => ({
  members: many(members),
}));

export const membersRelations = relations(members, ({ one }) => ({
  household: one(households, {
    fields: [members.householdId],
    references: [households.id],
  }),
}));

// Zod Schemas for validation
export const insertMemberSchema = createInsertSchema(members);
export const selectMemberSchema = createSelectSchema(members);
export const insertHouseholdSchema = createInsertSchema(households);
export const selectHouseholdSchema = createSelectSchema(households);
export const insertInventorySchema = createInsertSchema(inventory);
export const selectInventorySchema = createSelectSchema(inventory);
export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);

// Types
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Household = typeof households.$inferSelect;
export type NewHousehold = typeof households.$inferInsert;
export type InventoryItem = typeof inventory.$inferSelect;
export type NewInventoryItem = typeof inventory.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
