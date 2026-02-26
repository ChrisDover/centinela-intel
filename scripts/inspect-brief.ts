import prisma from "../lib/prisma";

async function main() {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: "cmlzpkvr60000jurevjbig2v3" },
  });
  if (!campaign) { console.log("Not found"); process.exit(1); }

  const data = JSON.parse(campaign.htmlContent || "{}");
  console.log("Threat Level:", data.threatLevel);
  console.log("BLUF:", data.bluf);
  console.log("\nDevelopments:", data.developments?.length);
  for (const d of data.developments || []) {
    console.log(`  ${d.country}: ${d.paragraphs?.length || 0} paragraphs`);
    for (const p of d.paragraphs || []) {
      console.log(`    - ${p.substring(0, 120)}...`);
    }
  }
  console.log("\nCountries:", data.countries?.length);
  console.log("Analyst note length:", data.analystNote?.length);
  console.log("Total htmlContent length:", campaign.htmlContent?.length);

  await prisma.$disconnect();
}

main().catch(console.error);
