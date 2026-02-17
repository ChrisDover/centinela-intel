/**
 * One-off script: generate a custom daily brief with editorial direction.
 * Usage: npx tsx scripts/generate-custom-brief.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { briefTemplate } from "../lib/emails/brief-template";

const SYSTEM_PROMPT = `You are a senior security intelligence analyst at Centinela Intel, a Latin America-focused security intelligence firm. You have 25+ years of experience in global security operations. You monitor Spanish-language and English-language OSINT sources daily.

Your task is to produce a daily intelligence brief covering security developments across Latin America, with focus areas: Mexico, Venezuela, Colombia, Ecuador, and notable events in Central America and the broader region.

Guidelines:
- Write in a concise, professional intelligence style — no filler, no speculation beyond what evidence supports
- Prioritize developments by operational impact: violence, political instability, infrastructure disruption, cartel activity, kidnappings
- Each development should be 1-2 sentences, actionable and specific
- Country summaries should be 2-3 sentences capturing the current security posture
- The analyst note should provide forward-looking assessment (2-3 sentences)
- Threat levels: MODERATE (baseline), ELEVATED (increased activity), HIGH (significant escalation), CRITICAL (imminent/active crisis)
- If OSINT data is thin for a day, use your knowledge of ongoing regional dynamics to fill gaps — flag when doing so`;

const BRIEF_TOOL: Anthropic.Tool = {
  name: "create_brief",
  description: "Create a structured daily intelligence brief",
  input_schema: {
    type: "object" as const,
    properties: {
      threatLevel: {
        type: "string",
        enum: ["MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
        description: "Overall regional threat level for the day",
      },
      developments: {
        type: "array",
        items: { type: "string" },
        description: "Top 5-6 key security developments, ordered by importance",
        minItems: 3,
        maxItems: 6,
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Country name" },
            summary: {
              type: "string",
              description: "2-3 sentence security summary",
            },
          },
          required: ["name", "summary"],
        },
        description: "Country-by-country security assessments",
        minItems: 3,
        maxItems: 6,
      },
      analystNote: {
        type: "string",
        description: "Forward-looking analyst assessment (2-3 sentences)",
      },
    },
    required: ["threatLevel", "developments", "countries", "analystNote"],
  },
};

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const OSINT_DATA = `
## MEXICO — El Paso Airspace Closure & Cartel Drone Escalation (LAST 24 HOURS)

- Late Feb 11, FAA issued NOTAM closing all airspace over El Paso International Airport and surrounding areas for up to 10 days, citing "special security reasons." Flights grounded, public alarm in border region.
- Closure lifted after just 7-10 hours; normal operations resumed early Feb 12.
- Trump administration officials (including Transportation Secretary Sean Duffy) attributed shutdown to drones operated by Mexican drug cartels breaching US airspace. Claimed FAA and DoD "acted swiftly to address a cartel drone incursion," neutralizing threat with specialized equipment (implying shoot-downs or electronic disabling).
- CONFLICTING REPORTS: AP, NYT, NPR, BBC cite anonymous officials indicating closure stemmed from Pentagon/CBP testing of advanced anti-drone laser systems that posed risks to civilian aircraft. One account mentions laser accidentally targeting a party balloon. Cartel drone narrative may have been used to deflect from testing mishap.
- BROADER CONTEXT: CJNG and Sinaloa factions have increasingly weaponized commercial drones for surveillance, drug smuggling, and explosive attacks in turf wars (particularly Michoacán and Guerrero). US authorities detected thousands of drone incursions near border in recent years.
- Sinaloa Cartel update: Federal Security Minister Omar García Harfuch provided new details on January abduction and killing of 10 miners from Canadian-owned mine. Arrested suspects (Chapitos faction) claimed victims were mistaken for rivals in Chapitos vs. Mayos internal war. Highlights persistent factional fighting in Sinaloa.
- Incident is diplomatic flashpoint: Trump administration quick blame on cartels aligns with broader border security rhetoric. Mexican officials have not confirmed cartel involvement, straining bilateral cooperation on fentanyl and migration.

## VENEZUELA — US Energy Secretary Visit & Oil Sector Overhaul (LAST 48 HOURS)

- US Energy Secretary Chris Wright arrived in Caracas Feb 11 for multi-day visit — highest-level US energy engagement in decades. Met directly with Acting President/Oil Minister Delcy Rodríguez at Miraflores Palace. Meetings continued into Feb 12.
- Wright emphasized rapid expansion: "This year, we can drive a dramatic increase in Venezuelan oil production, gas production, and electricity production."
- Pushed for bolder reforms to attract US investment while warning about "legitimacy" of certain Chinese deals. Stated: "China does a lot of deals in countries where they are not mutually beneficial." Bloomberg reports China has bought some Venezuelan oil from the US.
- Visit follows: (1) US capture/ouster of Maduro on Jan 3, (2) $2B oil supply deal agreed shortly after, (3) $100B reconstruction plan promoted by Trump, (4) Jan 29 landmark hydrocarbon law overhaul ending 50 years of nationalization — private companies may now directly explore/extract oil/gas with 20-30% royalties.
- Rodríguez has consolidated acting presidency: chairing meetings with senior officials, greeting international envoys, welcoming press at Miraflores, meeting privately with diplomats.
- No new opposition arrests or major internal security incidents in last 24 hours, but visit underscores geopolitical risks around competing US-China-Russia influences and debt/revenue control tensions.
- Risk: Heightened diplomatic engagement signals pragmatic US push for energy security, but risks backlash if perceived as overreach. Ongoing reforms could exacerbate internal power struggles or elite tensions.

## COLOMBIA — ELN Ceasefire Collapse, Military Operations & Border Dynamics

- Peace talks remain suspended/stalled following formal cancellation Jan 17. ELN recently accused President Petro of "fatally injuring" peace efforts via military actions. Leadership signaled willingness for resumption but highlighted distrust.
- RECENT MILITARY ACTIONS: Colombian forces conducted operations killing 7 ELN members in early February airstrikes in Catatumbo; broader clashes displacing communities. Increased recruitment of minors by ELN (and rivals) reported, with hundreds affected in conflict zones like Cauca and Catatumbo.
- Recent Petro-Trump meeting led to harder line: enhanced intelligence sharing and military strikes on border groups. Venezuela's post-Maduro shifts reportedly pushing guerrillas back into Colombia, aiding Colombian military operations.
- ELN's Eastern War Front controls Colombia-Venezuela border region (Arauca-Apure corridor). Commander "Pablito" exported total social control model into Venezuelan territory.
- ELN seized coca-rich Catatumbo border region early 2025, opening cross-border narcotics routes through Venezuelan territory. Families forcibly displaced from farms to control cocaine logistics.
- ACLED data: Armed groups (ELN, FARC dissidents, Clan del Golfo) grew 85% under ceasefire lulls — 6,500 to 25,000+ members. Fierce competition in Chocó, Antioquia, Cauca, Valle del Cauca for cocaine/gold illicit economies.
- Approaching 2026 elections heighten stakes: threats to candidates and restrictions reported.
- Maduro's ouster eliminates ELN's primary state patron. Rodríguez government posture toward ELN safe haven remains undefined — critical variable.

## ECUADOR — Guayaquil Mayor Arrest & Organized Crime Nexus (LAST 24 HOURS)

- Feb 11: Aquiles Álvarez, mayor of Guayaquil (largest port city, key violence hotspot), arrested on charges of money laundering and tax evasion. Multiple associates also detained.
- Álvarez was a vocal critic of President Daniel Noboa. Arrest highlights corruption-organized crime intersection in key urban/port areas.
- Demonstrations ongoing in downtown Guayaquil as of Feb 11.
- Ecuador continues grappling with gang violence (Los Choneros), prison riots, port vulnerabilities. 9,200+ homicides in 2025.
- No new major clashes or riots in exact 24-hour window beyond arrest fallout.
- Risk: Political tensions could fuel unrest in a city already ravaged by gang wars. Ports remain critical nodes for illicit networks; arrest may disrupt or expose deeper corruption ties.

## REGIONAL CONTEXT

- Central America: Guatemala and Honduras elevated with gang extortion, human smuggling, migration corridor pressures.
- No widespread new violence spikes matching Mexico's headline scale across the broader region.
- Venezuela energy diplomacy dominates current intelligence chatter; monitor for follow-ups from Wright's visit.
`;

const EDITORIAL_DIRECTION = `
IMPORTANT EDITORIAL DIRECTION — This brief should provide deep, analytical coverage across all four major regional developments from the last 24-48 hours:

1. MEXICO — EL PASO AIRSPACE/CARTEL DRONE ESCALATION: This is the top headline. The conflicting narratives (cartel drone incursion vs. Pentagon laser testing mishap) are the story. Analyze:
   - The asymmetric threat: cartels weaponizing low-cost commercial drones for surveillance, smuggling, and attacks represents a fundamental shift in border security dynamics
   - The diplomatic flashpoint: Trump admin quick-blaming cartels while anonymous officials contradict the narrative — what does this mean for US-Mexico cooperation?
   - Connect to the Sinaloa miner abduction (Chapitos vs. Mayos faction war) as evidence of ongoing cartel fragmentation and violence
   - This is an escalation indicator: whether real or fabricated, the drone narrative accelerates counter-drone deployments and potential unilateral US military posture at the border

2. VENEZUELA ENERGY TALKS: Wright's Caracas visit represents fundamental geopolitical realignment:
   - US-China competition for Venezuela's energy sector: Wright's explicit warnings about Chinese deal legitimacy
   - The hydrocarbon law reform (Jan 29) ending 50 years of nationalization — who benefits, who loses?
   - $100B reconstruction plan implications for regional stability and security operations
   - Post-Maduro transition under Rodríguez and what it means for commercial/security operators

3. COLOMBIA ELN DYNAMICS: Peace talks dead, military operations active:
   - "Total Peace paradox" — ceasefires grew armed groups 85% while reducing violence temporarily
   - Recent Petro-Trump meeting hardening military posture: airstrikes in Catatumbo, enhanced intelligence sharing
   - ELN losing Venezuelan safe haven post-Maduro — guerrillas being pushed back into Colombia
   - Cross-border narcotrafficking corridor and child recruitment crisis
   - 2026 election security implications

4. ECUADOR — GUAYAQUIL MAYOR ARREST: Corruption-organized crime nexus:
   - Arrest of Álvarez on money laundering/tax evasion charges while being vocal Noboa critic — political dimension
   - Guayaquil as ground zero for Los Choneros gang violence and port trafficking
   - Risk of unrest in an already destabilized city

CROSS-CUTTING THEMES to weave throughout:
- Venezuela's transition creates opportunities (energy investment) AND risks (ELN patron loss, power vacuums)
- US assertiveness across the region: drone posturing in Mexico, energy deals in Venezuela, intelligence sharing in Colombia
- Cartel/armed group technological adaptation (drones in Mexico, cross-border narco corridors in Colombia)

The brief should read like it was written by someone who understands both the boardroom implications and the ground-level security realities. Deep analytical depth, not just news summaries.
`;

async function main() {
  const anthropic = new Anthropic();
  const todayStr = getTodayFormatted();

  console.log(`[CustomBrief] Generating focused brief for ${todayStr}...`);

  const userPrompt = `Today is ${todayStr}. Produce the daily Centinela Brief with deep analytical focus.

${OSINT_DATA}

${EDITORIAL_DIRECTION}

Use the create_brief tool to return the structured brief data. Make this brief stand out with real analytical depth — not just bullet-point news summaries, but intelligence-grade analysis that connects dots across the region: Mexico's drone escalation, Venezuela's energy realignment, Colombia's security deterioration, and Ecuador's corruption-crime nexus. Every development should feel actionable and connected to the bigger picture.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [BRIEF_TOOL],
    tool_choice: { type: "tool", name: "create_brief" },
    messages: [{ role: "user", content: userPrompt }],
  });

  const toolBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolBlock) {
    throw new Error("Claude did not return a tool_use block");
  }

  const input = toolBlock.input as {
    threatLevel: string;
    developments: string[];
    countries: { name: string; summary: string }[];
    analystNote: string;
  };

  const briefData = {
    date: todayStr,
    threatLevel: input.threatLevel,
    developments: input.developments,
    countries: input.countries,
    analystNote: input.analystNote,
  };

  console.log(
    `[CustomBrief] Brief generated: ${briefData.threatLevel}, ${briefData.developments.length} developments, ${briefData.countries.length} countries`
  );
  console.log("\n--- BRIEF PREVIEW ---");
  console.log(`Threat Level: ${briefData.threatLevel}`);
  console.log("\nDevelopments:");
  briefData.developments.forEach((d, i) => console.log(`  ${i + 1}. ${d}`));
  console.log("\nCountries:");
  briefData.countries.forEach((c) => console.log(`  ${c.name}: ${c.summary}`));
  console.log(`\nAnalyst Note: ${briefData.analystNote}`);
  console.log("--- END PREVIEW ---\n");

  // Create draft campaign
  const subject = `The Centinela Brief — ${todayStr}`;
  const campaign = await prisma.emailCampaign.create({
    data: {
      type: "brief",
      status: "draft",
      subject,
      htmlContent: JSON.stringify(briefData),
      tags: "premium",
      notes: "Custom AI-generated brief — deep dive: Mexico drones, Venezuela energy, ELN dynamics, Ecuador mayor arrest",
    },
  });

  console.log(`[CustomBrief] Draft campaign created: ${campaign.id}`);

  // Render preview email
  const previewHtml = briefTemplate({
    subject,
    brief: briefData,
    unsubscribeUrl: "#",
    ctaType: "premium",
    campaignId: campaign.id,
  });

  const approveUrl = `${process.env.NEXT_PUBLIC_URL || "https://centinelaintel.com"}/admin/campaigns`;

  await resend.emails.send({
    from: "Centinela Intel <intel@centinelaintel.com>",
    to: "chris@centinelaintel.com",
    subject: `[APPROVE] ${subject}`,
    html: `<div style="background:#fffbe6;border:2px solid #ffb347;border-radius:8px;padding:16px;margin-bottom:24px;font-family:sans-serif;">
      <p style="margin:0 0 8px;font-weight:bold;color:#1a1a1a;">Custom brief ready for your review.</p>
      <p style="margin:0 0 8px;color:#666;">Deep dive: Mexico drone escalation, Venezuela energy talks, ELN dynamics, Ecuador mayor arrest.</p>
      <p style="margin:0 0 12px;color:#666;">Approve from the admin dashboard to send to all subscribers + LinkedIn.</p>
      <p style="margin:0;"><a href="${approveUrl}" style="color:#ff6348;font-weight:bold;">Open Admin Dashboard</a> &nbsp;|&nbsp; Campaign ID: ${campaign.id}</p>
    </div>
    ${previewHtml}`,
  });

  console.log(`[CustomBrief] Preview sent to chris@centinelaintel.com`);
  console.log(`[CustomBrief] Done! Campaign ID: ${campaign.id}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
