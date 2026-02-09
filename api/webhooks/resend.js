import prisma from '../../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;

  if (!event?.type || !event?.data) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { type, data } = event;

  try {
    // Find subscriber by the "to" email address
    const toEmail = Array.isArray(data.to) ? data.to[0] : data.to;
    const subscriber = toEmail
      ? await prisma.subscriber.findUnique({ where: { email: toEmail } })
      : null;

    // Record event
    await prisma.emailEvent.create({
      data: {
        subscriberId: subscriber?.id || null,
        emailId: data.email_id || null,
        type,
        metadata: JSON.stringify(data),
      },
    });

    // Update subscriber engagement
    if (subscriber) {
      switch (type) {
        case 'email.delivered':
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { emailsSent: { increment: 1 } },
          });
          break;

        case 'email.opened':
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
              emailsOpened: { increment: 1 },
              engagementScore: { increment: 1 },
            },
          });
          break;

        case 'email.clicked':
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
              emailsClicked: { increment: 1 },
              engagementScore: { increment: 3 },
            },
          });
          break;

        case 'email.bounced':
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: { status: 'bounced' },
          });
          break;

        case 'email.complained':
          await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
              status: 'unsubscribed',
              unsubscribedAt: new Date(),
            },
          });
          break;
      }
    }

    // Update campaign metrics if we can match by email_id
    if (data.email_id) {
      const campaignEvent = await prisma.emailEvent.findFirst({
        where: {
          emailId: data.email_id,
          type: 'email.delivered',
          campaignId: { not: null },
        },
        select: { campaignId: true },
      });

      if (campaignEvent?.campaignId) {
        const updateField = {
          'email.delivered': 'deliveredCount',
          'email.opened': 'openedCount',
          'email.clicked': 'clickedCount',
          'email.bounced': 'bouncedCount',
          'email.complained': 'complainedCount',
        }[type];

        if (updateField) {
          await prisma.emailCampaign.update({
            where: { id: campaignEvent.campaignId },
            data: { [updateField]: { increment: 1 } },
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ received: true }); // Always 200 to avoid retries
  }
}
