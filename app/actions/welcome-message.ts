'use server';

export const runtime = 'edge';

import { getDb } from '@/db';
import { members } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Background job to send welcome orientation message 24 hours after enrollment
 * This should be triggered by a scheduled job (e.g., Cloudflare Cron Triggers)
 *
 * In production, set up a Cloudflare Cron Trigger that runs daily:
 * - wrangler.toml: [[triggers.crons]] schedule = "0 0 * * *"
 * - This will call a route that executes sendWelcomeMessages()
 */
export async function sendWelcomeMessages(): Promise<{ sent: number; errors: number }> {
  let sent = 0;
  let errors = 0;

  try {
    // Find members who enrolled exactly 24 hours ago (within a 1-hour window for cron flexibility)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const twentyThreeHoursAgo = new Date();
    twentyThreeHoursAgo.setHours(twentyThreeHoursAgo.getHours() - 23);

    const db = await getDb();

    // Get all pending/active members
    // In a real implementation, you'd filter by enrollment date
    const newMembers = await db
      .select()
      .from(members)
      .where(eq(members.status, 'active'))
      .all();

    for (const member of newMembers) {
      try {
        // In production, this would:
        // 1. Check if member enrolled ~24 hours ago
        // 2. Check if welcome message already sent (add a 'welcomeMessageSent' flag)
        // 3. Send email via your email service (e.g., Resend, SendGrid)
        // 4. Update member record to mark message as sent

        // Example email content:
        const emailContent = {
          to: member.email,
          subject: 'Welcome to Direct Care Indy - Your Orientation Guide',
          html: `
            <h1>Welcome to Direct Care Indy, ${member.firstName}!</h1>
            <p>Thank you for joining our Direct Primary Care family. We're excited to have you as a member.</p>

            <h2>What's Next?</h2>
            <ul>
              <li><strong>Access Your Portal:</strong> Visit your member dashboard to view your membership details</li>
              <li><strong>Schedule Your Welcome Visit:</strong> Book your first appointment to meet your provider</li>
              <li><strong>Set Up Secure Messaging:</strong> Use our HIPAA-compliant portal to communicate with your provider</li>
              <li><strong>Explore Pricing:</strong> Check out our transparent medication and lab pricing</li>
            </ul>

            <p>If you have any questions, don't hesitate to reach out through our secure messaging portal.</p>

            <p>Welcome to the family!</p>
            <p>The Direct Care Indy Team</p>
          `,
        };

        // TODO: Integrate with email service
        // await sendEmail(emailContent);

        // TODO: Mark as sent in database
        // await db.update(members).set({ welcomeMessageSent: true }).where(eq(members.id, member.id));

        sent++;
      } catch (error) {
        console.error(`Failed to send welcome message to ${member.email}:`, error);
        errors++;
      }
    }

    return { sent, errors };
  } catch (error) {
    console.error('Error in sendWelcomeMessages:', error);
    return { sent, errors };
  }
}

/**
 * Manual trigger for testing (can be called from an admin route)
 */
export async function triggerWelcomeMessageForMember(memberId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();

    if (!member) {
      return { success: false, error: 'Member not found' };
    }

    // Send welcome message immediately (for testing)
    // In production, integrate with your email service
    console.log(`Would send welcome message to ${member.email}`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

