import prisma from "../lib/prisma";

async function main() {
  const campaigns = await prisma.emailCampaign.findMany({
    where: { sentAt: { gte: new Date("2026-02-23T00:00:00Z") } },
    orderBy: { sentAt: "desc" },
    select: { id: true, type: true, subject: true, status: true, sentAt: true, recipientCount: true },
  });
  console.log("Campaigns sent today (Feb 23):");
  for (const c of campaigns) {
    console.log(`  [${c.status}] ${c.type} | ${c.subject} | ${c.recipientCount} recipients | ${c.sentAt}`);
  }
  if (campaigns.length === 0) console.log("  None found.");
  await prisma.$disconnect();
}

main().catch(console.error);
