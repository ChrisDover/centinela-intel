/**
 * EMERGENCY ALERT: CJNG Leader "El Mencho" Killed
 * Sends to all active subscribers immediately.
 * Usage: npx tsx scripts/send-alert-el-mencho.ts [--preview]
 */

import { sendCampaign } from "../lib/campaigns/send-brief";
import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { alertTemplate } from "../lib/emails/alert-template";

const SUBJECT =
  "CRITICAL ALERT — CJNG Leader El Mencho Killed in Federal Operation";

const SEVERITY = "CRITICAL";

const BODY = `
<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a; font-weight: bold;">CJNG Leader "El Mencho" Killed in Federal Operation in Jalisco</p>

<p style="margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: #999999; font-family: monospace;">22 February 2026 | Initial Report | 1316 hrs CST | Tapalpa, Jalisco, Mexico</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Mexican federal forces killed CJNG founder Nemesio Oseguera Cervantes ("El Mencho") in a military operation in Tapalpa, Jalisco on 22 February 2026. Confirmed by Reuters, AP, Bloomberg, and Mexican government sources. Retaliatory violence including 21+ road blockades, vehicle burnings, arson, and armed confrontations is now active across six or more Mexican states. <strong>ALL non-essential travel to affected regions should be suspended immediately.</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 13px; font-family: monospace;">
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 0; color: #999999;">EVENT</td>
    <td style="padding: 8px 0; color: #1a1a1a;">Leadership Elimination</td>
    <td style="padding: 8px 0; color: #999999;">TARGET</td>
    <td style="padding: 8px 0; color: #1a1a1a;">Nemesio Oseguera Cervantes</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 0; color: #999999;">ALIAS</td>
    <td style="padding: 8px 0; color: #1a1a1a;">"El Mencho"</td>
    <td style="padding: 8px 0; color: #999999;">ORG</td>
    <td style="padding: 8px 0; color: #1a1a1a;">CJNG</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 0; color: #999999;">LOCATION</td>
    <td style="padding: 8px 0; color: #1a1a1a;">Tapalpa, Jalisco</td>
    <td style="padding: 8px 0; color: #999999;">DATE/TIME</td>
    <td style="padding: 8px 0; color: #1a1a1a;">22 Feb 2026 / ~1100 CST</td>
  </tr>
  <tr>
    <td style="padding: 8px 0; color: #999999;">CONFIRMED</td>
    <td style="padding: 8px 0; color: #1a1a1a;">AP, Reuters, Bloomberg</td>
    <td style="padding: 8px 0; color: #ff4757; font-weight: bold;">THREAT LEVEL</td>
    <td style="padding: 8px 0; color: #ff4757; font-weight: bold;">CRITICAL</td>
  </tr>
</table>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">SITUATION OVERVIEW</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Mexican Army forces conducted a targeted operation against Nemesio Oseguera Cervantes in the mountainous municipality of Tapalpa, approximately 200 kilometers from Guadalajara. Federal officials confirmed to multiple international outlets that Oseguera Cervantes was killed during the confrontation. He had been the subject of a $15 million DEA bounty and was designated as the world's most wanted drug trafficker following the captures of Joaquin "El Chapo" Guzman and Ismael "El Mayo" Zambada.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The Trump administration designated CJNG as a foreign terrorist organization earlier this month, escalating legal authorities available for action against the cartel's leadership and financial networks. Today's operation represents the most significant cartel leadership elimination in Mexico in recent years.</p>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">ACTIVE RETALIATORY VIOLENCE</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Within hours of the Tapalpa operation, CJNG activated pre-planned contingency protocols across at least six Mexican states. This is not spontaneous violence. It represents a coordinated organizational response designed to overwhelm security forces, disrupt follow-on operations, and project continued operational capability.</p>

<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Road Blockades:</strong> Over 21 narcobloqueos across Jalisco, Michoacan, Guanajuato, Colima, Nayarit, Tamaulipas, and Aguascalientes. Operatives hijacking cargo trucks and buses, setting them ablaze on major highways.</p>

<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Affected Routes:</strong> Guadalajara-Mexico City highway, Tepic-Mazatlan corridor, routes surrounding Puerto Vallarta and Guadalajara International Airport (GDL). Jalisco Governor has activated "Codigo Rojo" emergency protocols.</p>

<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Urban Violence (Puerto Vallarta):</strong> Armed men on motorcycles, audible gunfire in multiple neighborhoods. Arson attacks on convenience stores, pharmacies, and public buses. Civilians stripped of vehicles at gunpoint.</p>

<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Armed Confrontations:</strong> Active gunfights in the Tapalpa area between Mexican Army/National Guard and CJNG gunmen, extending into Michoacan.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Arson and Intimidation:</strong> Convenience stores, pharmacies, and public transportation targeted in Guanajuato and Jalisco. Reports of threats against non-compliant civilians.</p>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">THREAT ASSESSMENT</p>

<table style="width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 13px;">
  <tr style="border-bottom: 2px solid #1a1a1a;">
    <td style="padding: 8px 4px; font-family: monospace; color: #999999; font-weight: bold;">DOMAIN</td>
    <td style="padding: 8px 4px; font-family: monospace; color: #999999; font-weight: bold;">LEVEL</td>
    <td style="padding: 8px 4px; font-family: monospace; color: #999999; font-weight: bold;">WINDOW</td>
    <td style="padding: 8px 4px; font-family: monospace; color: #999999; font-weight: bold;">ASSESSMENT</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 4px; color: #1a1a1a;">Ground Transport</td>
    <td style="padding: 8px 4px; color: #ff4757; font-weight: bold;">CRITICAL</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">0-72 hrs</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">Highways paralyzed across 6+ states. Avoid all road movement.</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 4px; color: #1a1a1a;">Air Travel (GDL/PVR)</td>
    <td style="padding: 8px 4px; color: #ff4757; font-weight: bold;">HIGH</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">0-48 hrs</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">Potential disruption to airport access roads.</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 4px; color: #1a1a1a;">Tourist Corridors</td>
    <td style="padding: 8px 4px; color: #ff4757; font-weight: bold;">HIGH</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">0-72 hrs</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">Puerto Vallarta under active threat. Armed groups and arson reported.</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 4px; color: #1a1a1a;">Supply Chain</td>
    <td style="padding: 8px 4px; color: #ff4757; font-weight: bold;">HIGH</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">1-4 wks</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">Blockades disrupting freight corridors. Expect cascading delays.</td>
  </tr>
  <tr style="border-bottom: 1px solid #e5e5e5;">
    <td style="padding: 8px 4px; color: #1a1a1a;">Personnel Security</td>
    <td style="padding: 8px 4px; color: #ffb347; font-weight: bold;">ELEVATED</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">1-6 mos</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">Succession violence and extortion likely to increase.</td>
  </tr>
  <tr>
    <td style="padding: 8px 4px; color: #1a1a1a;">Business Continuity</td>
    <td style="padding: 8px 4px; color: #ffb347; font-weight: bold;">ELEVATED</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">1-6 mos</td>
    <td style="padding: 8px 4px; color: #1a1a1a;">Fragmentation creates less predictable threat environment.</td>
  </tr>
</table>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">IMMEDIATE RECOMMENDATIONS</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>1. Travel:</strong> Suspend all non-essential ground and air travel to Jalisco, Michoacan, Guanajuato, Colima, Nayarit, and Tamaulipas. Personnel currently in-country should shelter in place and avoid all road movement until blockades are cleared.</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>2. Personnel Accountability:</strong> Conduct immediate check-ins with all staff, contractors, and dependents in affected regions. Activate emergency communication trees.</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>3. Supply Chain:</strong> Notify logistics partners of highway blockade conditions. Begin identifying alternate routing through unaffected states.</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>4. Facility Security:</strong> Elevate physical security posture at all facilities in affected states. Brief local security teams on potential for spillover violence and extortion escalation.</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>5. Executive Protection:</strong> Increase protective measures for senior personnel with exposure to affected regions. Avoid predictable patterns of movement.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>6. Communications:</strong> Monitor Centinela Intel for follow-up reporting. Do not rely on social media for operational decisions. Unverified claims, including reports of airport seizures, are circulating and should be treated with caution.</p>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">FORWARD-LOOKING ASSESSMENT</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Short-Term (1-4 Weeks):</strong> El Mencho's death will trigger an internal succession contest among regional lieutenants, family members, and operational commanders. Historical precedent indicates these transitions produce increased violence as factions compete for territorial and revenue control. Rival organizations, particularly Sinaloa Cartel factions, will probe CJNG-held territory.</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Medium-Term (1-6 Months):</strong> A unified CJNG under centralized leadership was paradoxically more predictable than multiple splinter groups competing for dominance. Expect turf wars to intensify across contested zones in Michoacan, Guanajuato, and Colima. Extortion networks may become more erratic as local cells operate with greater autonomy.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Strategic:</strong> Since Mexico adopted the "kingpin strategy" in 2006, every major cartel leadership removal has followed a consistent pattern: initial disruption, organizational fragmentation, and escalated violence during succession. Whether El Mencho's death becomes a lasting strategic victory depends on how effectively Mexican and U.S. authorities exploit the organizational disruption in the critical weeks ahead.</p>

<p style="margin: 0 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">KEY INDICATORS TO MONITOR</p>

<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Succession Signals:</strong> Watch for public statements, narcomantas, or operational patterns indicating whether a single figure consolidates CJNG leadership or fragmentation begins.</p>

<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Violence Patterns:</strong> Coordinated retaliatory violence in traditional CJNG strongholds suggests surviving command structure. Scattered, unpredictable violence across new areas indicates fragmentation.</p>

<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Rival Exploitation:</strong> Sinaloa Cartel factions and regional groups may test CJNG boundaries. Increased inter-cartel confrontations in border zones would signal an accelerating power vacuum.</p>

<p style="margin: 0 0 8px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Fentanyl/Meth Supply Disruption:</strong> Short-term supply disruption is possible, but competing organizations will move to fill gaps. Monitor for pricing shifts and route changes.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>U.S.-Mexico Coordination:</strong> The FTO designation provides enhanced legal authorities. The degree of operational cooperation between Washington and Mexico City will shape whether this tactical success translates into strategic outcomes.</p>

<p style="margin: 24px 0 0; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; line-height: 1.6; color: #999999; font-style: italic;">This alert will be updated as the situation develops. Next scheduled update: 22 Feb 2026, 2000 hrs CST or sooner if conditions materially change.</p>
`.trim();

async function main() {
  const isPreview = process.argv.includes("--preview");

  // 1. Create campaign record
  const campaign = await prisma.emailCampaign.create({
    data: {
      type: "alert",
      subject: SUBJECT,
      htmlContent: JSON.stringify({ severity: SEVERITY, body: BODY }),
      status: "draft",
      tags: "premium", // CTA type
      notes: "EMERGENCY: El Mencho killed in federal operation. CRITICAL threat level.",
    },
  });

  console.log(`Campaign created: ${campaign.id}`);
  console.log(`Subject: ${SUBJECT}`);

  if (isPreview) {
    // Send preview to chris@ only
    const previewHtml = alertTemplate({
      subject: SUBJECT,
      severity: SEVERITY,
      body: BODY,
      unsubscribeUrl: "#",
      ctaType: "premium",
      campaignId: campaign.id,
    });

    const preview = await resend.emails.send({
      from: "Centinela Intel <intel@centinelaintel.com>",
      to: "chris@centinelaintel.com",
      subject: `[PREVIEW] ${SUBJECT}`,
      html: previewHtml,
    });

    console.log(`Preview sent to chris@centinelaintel.com (${preview.data?.id})`);
    console.log(`\nTo send to full list, run:\nnpx tsx scripts/send-campaign.ts ${campaign.id}`);
  } else {
    // Send to full list immediately
    console.log("Sending to full subscriber list...");
    const result = await sendCampaign(campaign.id);
    console.log(`\nDone. Sent: ${result.scheduled}, Failed: ${result.failed}`);
    if (result.errors.length > 0) {
      console.log("Errors:", result.errors);
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
