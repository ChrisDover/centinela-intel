import prisma from '../lib/prisma.js';
import resend from '../lib/resend.js';
import { welcomeEmail } from '../lib/emails/welcome.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = req.body?.email?.trim()?.toLowerCase();
  if (!email) {
    return res.redirect(302, '/');
  }

  try {
    // Check for existing subscriber
    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-subscribe
        await prisma.subscriber.update({
          where: { email },
          data: {
            status: 'active',
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });

        // Send welcome email again
        const emailData = welcomeEmail(email, existing.unsubscribeToken);
        await resend.emails.send(emailData);
      }
      // Already active — still redirect to welcome
      return res.redirect(302, '/welcome');
    }

    // Determine source from referer
    const referer = req.headers?.referer || '';
    let source = 'direct';
    if (referer.includes('/subscribe')) source = 'subscribe-page';
    else if (referer.includes('/briefs/')) source = 'brief';
    else if (referer.includes('centinelaintel.com')) source = 'homepage';

    // Create subscriber
    const subscriber = await prisma.subscriber.create({
      data: { email, source },
    });

    // Send welcome email
    const emailData = welcomeEmail(email, subscriber.unsubscribeToken);
    const sent = await resend.emails.send(emailData);

    // Track the welcome email as a campaign
    await prisma.emailCampaign.create({
      data: {
        type: 'welcome',
        subject: emailData.subject,
        fromEmail: emailData.from,
        recipientCount: 1,
      },
    });

  } catch (error) {
    console.error('Subscribe error:', error);
  }

  return res.redirect(302, '/welcome');
}
