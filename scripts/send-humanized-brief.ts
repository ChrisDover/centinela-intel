/**
 * One-off: update existing draft campaign with humanized brief and send preview.
 */

import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { briefTemplate } from "../lib/emails/brief-template";

const CAMPAIGN_ID = "cmljiunhw0000jusnmdpex0yn";

const briefData = {
  date: "February 12, 2026",
  threatLevel: "ELEVATED",
  developments: [
    `FAA shut down El Paso airspace late Feb 11, grounding flights for roughly 7 hours before quietly reopening. Transportation Secretary Duffy blamed cartel drones; DoD/CBP sources told AP and NPR it was actually a Pentagon anti-drone laser test that went sideways and risked hitting civilian aircraft. One account mentions the laser locked onto a party balloon. The real story matters less than what both versions confirm: CJNG and Sinaloa factions are flying weaponized commercial drones regularly now in Michoacan and Guerrero turf wars, and Washington is testing shoot-down capability at the border. Either way, Mexico wasn't consulted, and that's going to cost something on fentanyl cooperation.`,

    `Energy Secretary Wright landed in Caracas Feb 11 for a three-day sit-down with Acting President Rodriguez at Miraflores. First US energy visit at this level in 30+ years. He wants faster oil production and told reporters that Chinese deals in Venezuela are often "not mutually beneficial," which is about as direct as cabinet-level diplomats get. This comes six weeks after the Jan 29 hydrocarbon law blew open 50 years of nationalization: private firms can now explore and extract directly, royalties start at 30% but drop to 15% for marginal projects. Trump's $100B reconstruction number is still aspirational, but the legal framework to spend it is now real. Rodriguez has been consolidating steadily since Maduro's removal. No opposition arrests in 48 hours. The question is whether that restraint holds as US and Chinese firms start competing for the same contracts.`,

    `Peace talks between Bogota and the ELN are dead. Formally cancelled Jan 17 after two years of going nowhere. What the ceasefire period actually produced: 85% growth in armed group ranks across the board. ELN, FARC dissidents, and Clan del Golfo went from roughly 6,500 fighters to over 25,000, per ACLED data. The Colombian military hit back with airstrikes in Catatumbo in early February, killing 7 ELN members, and a Petro-Trump meeting opened up enhanced intelligence sharing. Maduro's removal is pushing guerrillas back across the border and cutting off their Venezuelan safe haven, but it's also concentrating violence in border departments. ELN's Eastern War Front still controls the Arauca-Apure coca corridor. They're displacing farming families along the Catatumbo river to lock down cocaine loading points. Child recruitment is running into the hundreds in Cauca and Catatumbo. And 2026 elections are adding another layer: candidates are already receiving threats.`,

    `Guayaquil Mayor Aquiles Alvarez was arrested Feb 11 on money laundering and tax evasion charges. Several associates were also picked up. Alvarez had been a vocal Noboa critic, so the political dimension is impossible to ignore, but Guayaquil recorded the bulk of Ecuador's 9,200+ homicides in 2025 and its port is a known Los Choneros trafficking node. If there's real collusion between city hall and organized crime, this arrest could expose it. Demonstrations are already active downtown. The risk is that unrest in an already violent city disrupts port operations or triggers gang retaliation.`,

    `Washington is pressing harder across the entire region simultaneously: counter-drone systems at the Mexico border, direct energy sector engagement in Venezuela, expanded intelligence sharing with Colombia. Whether this is coordinated strategy or opportunistic positioning, the effect is the same. Armed groups and cartels are adapting faster than state countermeasures, particularly on drone technology and cross-border logistics.`,

    `Maduro's removal is producing second-order effects that connect across borders. The ELN lost its primary state patron and safe haven. Chinese energy investors face direct US pressure to justify their deal terms. And Rodriguez hasn't defined her government's posture toward armed groups operating along the Venezuelan side of the border. That last point will determine whether Colombia's eastern frontier stabilizes or gets worse.`,
  ],
  countries: [
    {
      name: "Mexico",
      summary:
        "ELEVATED. The El Paso airspace incident, whatever actually caused it, confirmed two things: cartels are using weaponized drones routinely in internal turf wars, and the US is testing counter-drone systems on the border without coordinating with Mexico. The Sinaloa factional war continues. Garcia Harfuch confirmed the 10 miners abducted from a Canadian-owned mine in January were killed by Chapitos operatives who mistook them for Mayos rivals. The counter-drone buildup has direct implications for commercial aviation and cross-border logistics, and it's eroding the bilateral trust needed for fentanyl interdiction.",
    },
    {
      name: "Venezuela",
      summary:
        "MODERATE but volatile. Wright's visit is the most significant US energy engagement in decades, and the Jan 29 hydrocarbon law reform is the most significant legal change since nationalization in 1976. Rodriguez is governing pragmatically so far. The variables to watch: which firms get the first hydrocarbon contracts (US or Chinese), how Russia and China respond to debt restructuring negotiations (they hold billions in claims), and whether the Rodriguez government tolerates ELN and FARC remnant activity along the Colombian border. That last item will shape narcotrafficking routes across the region.",
    },
    {
      name: "Colombia",
      summary:
        "HIGH. The situation is deteriorating on multiple fronts. Military operations are intensifying after the Petro-Trump meeting, but the armed groups that grew 85% during ceasefire lulls now have the numbers to absorb losses and keep fighting. The Venezuelan transition is a double-edged sword: it's cutting off ELN's safe haven, which helps Colombian forces, but it's also pushing fighters back into Colombian territory and concentrating violence in border zones. Forced displacement, child recruitment, cocaine corridor control, and election-related threats are all running concurrently.",
    },
    {
      name: "Ecuador",
      summary:
        "HIGH in Guayaquil. The Alvarez arrest sits at the intersection of political rivalry, corruption, and organized crime in a city where gang violence and port trafficking are entrenched problems. If demonstrations grow or Los Choneros-linked groups retaliate, expect port disruption and a possible spike in violence. The rest of the country remains strained under the continuing state of emergency.",
    },
    {
      name: "Guatemala",
      summary:
        "MODERATE. No new incidents in the past 24 hours. MS-13 and Barrio 18 extortion continues. Northern border departments remain staging areas for northbound migration and southbound arms flows.",
    },
    {
      name: "Honduras",
      summary:
        "MODERATE. Gang extortion in Tegucigalpa and San Pedro Sula is steady. Worth watching whether US counter-drone operations near Mexico's border push smuggling routes southward through Central American transit points.",
    },
  ],
  analystNote:
    `Three things to watch over the next 72 hours. First, whether the Pentagon laser testing story sticks. If it does, Mexico's government will use it as leverage, and the counter-drone posture at the border may get walked back, at least publicly. Second, Venezuela's first hydrocarbon contract awards will signal whether Rodriguez is genuinely balancing US and Chinese interests or picking a side. Any Chinese pushback on debt terms could complicate the transition fast. Third, and most consequentially, the Rodriguez government needs to decide what it's doing about ELN operations on Venezuelan soil. If it looks the other way, cross-border narco corridors stay open. If it cracks down, it pushes more fighters into Colombia right as Petro's military is ramping up ahead of elections. Either outcome increases violence somewhere. Guayaquil is a secondary watch: port disruption or gang retaliation after the mayor's arrest could ripple into supply chains. Across the board, Washington is moving faster than its partners can absorb, which produces short-term wins but builds up the kind of resentment that armed groups know how to exploit.`,
};

async function main() {
  // Update existing campaign with humanized brief
  await prisma.emailCampaign.update({
    where: { id: CAMPAIGN_ID },
    data: {
      htmlContent: JSON.stringify(briefData),
      notes: "Humanized AI brief — deep dive: Mexico drones, Venezuela energy, ELN dynamics, Ecuador mayor arrest",
    },
  });

  console.log(`[Brief] Updated campaign ${CAMPAIGN_ID} with humanized content`);

  // Render and send preview
  const subject = `The Centinela Brief — February 12, 2026`;
  const previewHtml = briefTemplate({
    subject,
    brief: briefData,
    unsubscribeUrl: "#",
    ctaType: "premium",
    campaignId: CAMPAIGN_ID,
  });

  const approveUrl = `${process.env.NEXT_PUBLIC_URL || "https://centinelaintel.com"}/admin/campaigns`;

  await resend.emails.send({
    from: "Centinela Intel <intel@centinelaintel.com>",
    to: "chris@centinelaintel.com",
    subject: `[APPROVE] ${subject}`,
    html: `<div style="background:#fffbe6;border:2px solid #ffb347;border-radius:8px;padding:16px;margin-bottom:24px;font-family:sans-serif;">
      <p style="margin:0 0 8px;font-weight:bold;color:#1a1a1a;">Humanized brief ready for review.</p>
      <p style="margin:0 0 8px;color:#666;">Deep dive: Mexico drone escalation, Venezuela energy talks, ELN dynamics, Ecuador mayor arrest.</p>
      <p style="margin:0 0 12px;color:#666;">Approve from the admin dashboard to send to all subscribers + LinkedIn.</p>
      <p style="margin:0;"><a href="${approveUrl}" style="color:#ff6348;font-weight:bold;">Open Admin Dashboard</a> &nbsp;|&nbsp; Campaign ID: ${CAMPAIGN_ID}</p>
    </div>
    ${previewHtml}`,
  });

  console.log(`[Brief] Preview sent to chris@centinelaintel.com`);
  console.log(`[Brief] Campaign ${CAMPAIGN_ID} is queued as draft in your dashboard`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
