import { pgTable, text, integer, serial, timestamp, boolean, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Households Table - Groups family members together
export const households = pgTable('households', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "The Smith Family"
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Members Table - Individual patients with Pike Medical DPC membership
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  dateOfBirth: text('date_of_birth').notNull(), // ISO date string for age calculation
  householdId: integer('household_id').references(() => households.id),
  status: text('status').notNull().default('active'), // 'active', 'inactive', 'pending'
});

// Inventory Table - Consolidated medications and labs with wholesale pricing
// Stores prices in CENTS to avoid floating-point precision issues
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "Amoxicillin" or "Lipid Panel"
  category: text('category').notNull(), // 'medication' or 'lab'
  wholesalePrice: integer('wholesale_price').notNull(), // Price in cents (e.g., 300 for $3.00)
  stockLevel: integer('stock_level').notNull().default(0),
  description: text('description'),
  dosage: text('dosage'), // For medications: e.g., "500mg"
  // FIFO & Inventory Management Fields
  lotNumber: text('lot_number'), // Lot number for batch tracking
  expirationDate: text('expiration_date'), // ISO date string for expiration tracking
  parLevel: integer('par_level'), // Minimum stock level (PAR = Periodic Automatic Replenishment)
});

// Services Table - Define which services are covered (90%) vs insurance-only (10%)
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'included' or 'insurance_only'
  description: text('description'),
});

// HIPAA-Compliant Audit Logs Table
// Tracks "who, what, and when" for all PHI access and modifications
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Provider/admin user ID (from auth system)
  action: text('action').notNull(), // 'READ', 'UPDATE', 'DELETE', 'CREATE'
  resourceType: text('resource_type').notNull(), // 'Member', 'Medication', 'Lab', 'Household', etc.
  resourceId: integer('resource_id').notNull(), // ID of the resource accessed/modified
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: text('ip_address'), // Optional: IP address for additional security tracking
  userAgent: text('user_agent'), // Optional: User agent for additional context
  details: text('details'), // Optional: JSON string with additional context about the action
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
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const selectAuditLogSchema = createSelectSchema(auditLogs);

// Types
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Household = typeof households.$inferSelect;
export type NewHousehold = typeof households.$inferInsert;
export type InventoryItem = typeof inventory.$inferSelect;
export type NewInventoryItem = typeof inventory.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
