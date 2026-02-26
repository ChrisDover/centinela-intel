import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { baseTemplate } from "../lib/emails/base-template";
import { renderCTA } from "../lib/emails/cta-blocks";

const SUBJECT = "CRITICAL ALERT — CJNG Leader El Mencho Killed in Federal Operation";
const CAMPAIGN_ID = "cmly3uy5b0000juysogec14st";

const p = (text: string) =>
  `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${text}</p>`;

const label = (text: string) =>
  `<p style="margin: 24px 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">${text}</p>`;

const body = `
${label("CENTINELA ALERT — CRITICAL")}

${p(`We have resources available in the region. If you or your organization need immediate support, reply directly to this email.`)}

${p(`<strong>CJNG Leader "El Mencho" Killed in Federal Operation in Jalisco</strong>`)}

${p(`22 February 2026 | Initial Report | 1316 hrs CST | Tapalpa, Jalisco, Mexico`)}

${label("EXECUTIVE SUMMARY")}

${p(`Mexican federal forces killed CJNG founder Nemesio Oseguera Cervantes ("El Mencho") in a military operation in Tapalpa, Jalisco on 22 February 2026. Confirmed by Reuters, AP, Bloomberg, and Mexican government sources. Retaliatory violence including 21+ road blockades, vehicle burnings, arson, and armed confrontations is now active across six or more Mexican states. ALL non-essential travel to affected regions should be suspended immediately.`)}

${p(`Event: Leadership Elimination<br>Target: Nemesio Oseguera Cervantes ("El Mencho")<br>Organization: CJNG<br>Location: Tapalpa, Jalisco, Mexico<br>Date/Time: 22 Feb 2026 / ~1100 CST<br>Confirmation: AP, Reuters, Bloomberg<br>Threat Level: CRITICAL`)}

${label("SITUATION OVERVIEW")}

${p(`Mexican Army forces conducted a targeted operation against Nemesio Oseguera Cervantes in the mountainous municipality of Tapalpa, approximately 200 kilometers from Guadalajara. Federal officials confirmed to multiple international outlets that Oseguera Cervantes was killed during the confrontation. He had been the subject of a $15 million DEA bounty and was designated as the world's most wanted drug trafficker following the captures of Joaquin "El Chapo" Guzman and Ismael "El Mayo" Zambada.`)}

${p(`The Trump administration designated CJNG as a foreign terrorist organization earlier this month, escalating legal authorities available for action against the cartel's leadership and financial networks. Today's operation represents the most significant cartel leadership elimination in Mexico in recent years.`)}

${label("ACTIVE RETALIATORY VIOLENCE")}

${p(`Within hours of the Tapalpa operation, CJNG activated pre-planned contingency protocols across at least six Mexican states. This is not spontaneous violence. It represents a coordinated organizational response designed to overwhelm security forces, disrupt follow-on operations, and project continued operational capability.`)}

${p(`Road Blockades: Over 21 narcobloqueos across Jalisco, Michoacan, Guanajuato, Colima, Nayarit, Tamaulipas, and Aguascalientes. Operatives hijacking cargo trucks and buses, setting them ablaze on major highways.`)}

${p(`Affected Routes: Guadalajara-Mexico City highway, Tepic-Mazatlan corridor, routes surrounding Puerto Vallarta and Guadalajara International Airport (GDL). Jalisco Governor has activated "Codigo Rojo" emergency protocols.`)}

${p(`Urban Violence (Puerto Vallarta): Armed men on motorcycles, audible gunfire in multiple neighborhoods. Arson attacks on convenience stores, pharmacies, and public buses. Civilians stripped of vehicles at gunpoint.`)}

${p(`Armed Confrontations: Active gunfights in the Tapalpa area between Mexican Army/National Guard and CJNG gunmen, extending into Michoacan.`)}

${p(`Arson and Intimidation: Convenience stores, pharmacies, and public transportation targeted in Guanajuato and Jalisco. Reports of threats against non-compliant civilians.`)}

${label("THREAT ASSESSMENT")}

${p(`Ground Transport — CRITICAL — 0-72 hrs: Highways paralyzed across 6+ states. Avoid all road movement.`)}

${p(`Air Travel (GDL/PVR) — HIGH — 0-48 hrs: Potential disruption to airport access roads.`)}

${p(`Tourist Corridors — HIGH — 0-72 hrs: Puerto Vallarta under active threat. Armed groups and arson reported.`)}

${p(`Supply Chain — HIGH — 1-4 weeks: Blockades disrupting freight corridors. Expect cascading delays.`)}

${p(`Personnel Security — ELEVATED — 1-6 months: Succession violence and extortion likely to increase.`)}

${p(`Business Continuity — ELEVATED — 1-6 months: Fragmentation creates less predictable threat environment.`)}

${label("IMMEDIATE RECOMMENDATIONS")}

${p(`1. Travel: Suspend all non-essential ground and air travel to Jalisco, Michoacan, Guanajuato, Colima, Nayarit, and Tamaulipas. Personnel currently in-country should shelter in place and avoid all road movement until blockades are cleared.`)}

${p(`2. Personnel Accountability: Conduct immediate check-ins with all staff, contractors, and dependents in affected regions. Activate emergency communication trees.`)}

${p(`3. Supply Chain: Notify logistics partners of highway blockade conditions. Begin identifying alternate routing through unaffected states.`)}

${p(`4. Facility Security: Elevate physical security posture at all facilities in affected states. Brief local security teams on potential for spillover violence and extortion escalation.`)}

${p(`5. Executive Protection: Increase protective measures for senior personnel with exposure to affected regions. Avoid predictable patterns of movement.`)}

${p(`6. Communications: Monitor Centinela Intel for follow-up reporting. Do not rely on social media for operational decisions. Unverified claims, including reports of airport seizures, are circulating and should be treated with caution.`)}

${label("FORWARD-LOOKING ASSESSMENT")}

${p(`Short-Term (1-4 Weeks): El Mencho's death will trigger an internal succession contest among regional lieutenants, family members, and operational commanders. Historical precedent indicates these transitions produce increased violence as factions compete for territorial and revenue control. Rival organizations, particularly Sinaloa Cartel factions, will probe CJNG-held territory.`)}

${p(`Medium-Term (1-6 Months): A unified CJNG under centralized leadership was paradoxically more predictable than multiple splinter groups competing for dominance. Expect turf wars to intensify across contested zones in Michoacan, Guanajuato, and Colima. Extortion networks may become more erratic as local cells operate with greater autonomy.`)}

${p(`Strategic: Since Mexico adopted the "kingpin strategy" in 2006, every major cartel leadership removal has followed a consistent pattern: initial disruption, organizational fragmentation, and escalated violence during succession. Whether El Mencho's death becomes a lasting strategic victory depends on how effectively Mexican and U.S. authorities exploit the organizational disruption in the critical weeks ahead.`)}

${label("KEY INDICATORS TO MONITOR")}

${p(`Succession Signals: Watch for public statements, narcomantas, or operational patterns indicating whether a single figure consolidates CJNG leadership or fragmentation begins.`)}

${p(`Violence Patterns: Coordinated retaliatory violence in traditional CJNG strongholds suggests surviving command structure. Scattered, unpredictable violence across new areas indicates fragmentation.`)}

${p(`Rival Exploitation: Sinaloa Cartel factions and regional groups may test CJNG boundaries. Increased inter-cartel confrontations in border zones would signal an accelerating power vacuum.`)}

${p(`Fentanyl/Meth Supply Disruption: Short-term supply disruption is possible, but competing organizations will move to fill gaps. Monitor for pricing shifts and route changes.`)}

${p(`U.S.-Mexico Coordination: The FTO designation provides enhanced legal authorities. The degree of operational cooperation between Washington and Mexico City will shape whether this tactical success translates into strategic outcomes.`)}

${p(`<em>This alert will be updated as the situation develops. Next scheduled update: 22 Feb 2026, 2000 hrs CST or sooner if conditions materially change.</em>`)}

<p style="margin: 24px 0 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Centinela Intel</p>
`.trim();

const ctaBlock = renderCTA("premium", { campaignId: CAMPAIGN_ID, position: "footer" });

const html = baseTemplate({
  content: body,
  unsubscribeUrl: "#",
  ctaBlock,
  isAlert: true,
  preheader: "CRITICAL ALERT — CJNG Leader El Mencho killed in federal operation in Jalisco. Retaliatory violence active across 6+ states.",
});

async function main() {
  const isPreview = !process.argv.includes("--send");

  if (isPreview) {
    console.log("HTML length:", html.length);

    const result = await resend.emails.send({
      from: "Centinela Intel <intel@centinelaintel.com>",
      to: "chris@centinelaintel.com",
      subject: `[PREVIEW] ${SUBJECT}`,
      html,
    });

    console.log("Preview sent:", result.data?.id || result.error);
  } else {
    // Update campaign with new plain-text HTML content
    await prisma.emailCampaign.update({
      where: { id: CAMPAIGN_ID },
      data: {
        htmlContent: body,
        type: "broadcast", // use broadcast type so variant-renderer passes body as raw HTML
      },
    });

    // Send via standard pipeline
    const { sendCampaign } = await import("../lib/campaigns/send-brief");
    console.log("Sending to full subscriber list...");
    const result = await sendCampaign(CAMPAIGN_ID);
    console.log(`Done. Sent: ${result.scheduled}, Failed: ${result.failed}`);
    if (result.errors.length > 0) console.log("Errors:", result.errors);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
