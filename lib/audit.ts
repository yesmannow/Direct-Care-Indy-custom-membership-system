'use server';

export const runtime = 'nodejs';

import { getDb } from '@/db';
import { auditLogs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export type AuditAction = 'READ' | 'UPDATE' | 'DELETE' | 'CREATE';
export type ResourceType = 'Member' | 'Medication' | 'Lab' | 'Household' | 'Inventory' | 'Service';

export interface AuditLogParams {
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: number;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

/**
 * HIPAA-Compliant Audit Logging Utility
 * Automatically logs all access and modifications to PHI (Protected Health Information)
 *
 * This function should be called whenever a provider accesses or modifies:
 * - Member records (patient data)
 * - Medication records
 * - Lab results
 * - Any other PHI-containing resources
 */
export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  try {
    const db = await getDb();
    await db.insert(auditLogs).values({
      userId: params.userId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      timestamp: new Date(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      details: params.details ? JSON.stringify(params.details) : null,
    });
  } catch (error) {
    // Log errors but don't throw - audit logging should never break the main flow
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Get audit logs for a specific resource
 * Useful for compliance reporting and security reviews
 */
export async function getAuditLogsForResource(
  resourceType: ResourceType,
  resourceId: number
): Promise<typeof auditLogs.$inferSelect[]> {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.resourceType, resourceType),
          eq(auditLogs.resourceId, resourceId)
        )
      )
      .all();
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return [];
  }
}

/**
 * Get all audit logs for a specific user
 * Useful for tracking provider activity
 */
export async function getAuditLogsForUser(userId: string): Promise<typeof auditLogs.$inferSelect[]> {
  try {
    const db = await getDb();
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .all();
  } catch (error) {
    console.error('Failed to retrieve user audit logs:', error);
    return [];
  }
}

