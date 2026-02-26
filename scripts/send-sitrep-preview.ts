import prisma from "../lib/prisma";
import resend from "../lib/resend";
import { baseTemplate } from "../lib/emails/base-template";
import { renderCTA } from "../lib/emails/cta-blocks";

const SUBJECT = "HIGH PRIORITY: MEXICO SITUATION REPORT";

const p = (text: string) =>
  `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">${text}</p>`;

const label = (text: string) =>
  `<p style="margin: 28px 0 8px; font-size: 13px; line-height: 1.6; color: #ff4757; font-family: monospace; letter-spacing: 1px; font-weight: bold;">${text}</p>`;

const sublabel = (text: string) =>
  `<p style="margin: 24px 0 8px; font-size: 14px; line-height: 1.6; color: #1a1a1a; font-weight: bold;">${text}</p>`;

const body = `
${label("CENTINELA INTEL — COMPREHENSIVE SITUATION REPORT")}

${p(`<strong>Post-El Mencho: Mexico-Wide Regional Intelligence Assessment</strong>`)}

${p(`Report ID: CI-2026-0223-003 | 23 February 2026, 1400 hrs MST<br>Classification: Subscriber Confidential | Threat Level: CRITICAL<br>Coverage Period: 22 February 0600 through 23 February 1200 (local Mexico time)`)}

<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

${p(`We are making today's comprehensive Mexico report available to all subscribers given the risk and impact of what is happening in Mexico. Reach out if you need any help getting people out, or other services inside Mexico — we have people on the ground and are coordinating charter flights out. We can provide further comprehensive, specific on-the-ground information, intel briefings, and planning. <strong>Reply directly to this email.</strong>`)}

<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">

${label("EXECUTIVE SUMMARY")}

${p(`On February 22, 2026, Mexican Army special forces, supported by National Guard, Air Force, and Attorney General intelligence personnel, conducted a targeted operation against Nemesio Ruben Oseguera Cervantes ("El Mencho"), age 59, in the municipality of Tapalpa, Jalisco. El Mencho was wounded during the raid and died while being airlifted to Mexico City, according to SEDENA. Four CJNG bodyguards were killed at the scene, two additional cartel members died during transport, and two more were arrested. Armored vehicles, rocket launchers capable of downing aircraft, and other military-grade weapons were seized.`)}

${p(`The operation was conducted with "complementary intelligence" from U.S. authorities, confirmed by both SEDENA and the U.S. Embassy. The Joint Interagency Task Force-Counter Cartel played a role in the operation. White House Press Secretary confirmed U.S. intelligence support.`)}

${p(`His death triggered the most significant coordinated cartel retaliation event in modern Mexican history. Mexico's Security Cabinet reported more than 250 blockades across 20 Mexican states, with Jalisco alone accounting for 65+ incidents across 30 municipalities. Guanajuato reported more than 70 attacks across 23 municipalities, including 60 arson incidents targeting 18 Banco del Bienestar branches and 69 Oxxo stores. Confirmed security force casualties include one National Guard member killed in Tapalpa, six National Guard members killed in Zapopan, a jail guard killed during a prison riot in Puerto Vallarta, and a Jalisco state prosecutor's office agent killed in Guadalajara.`)}

${p(`As of the morning of February 23, approximately 90% of blockades have been cleared by federal and state forces. Codigo Rojo emergency protocols remain active statewide in Jalisco. Schools and public transportation are suspended in Jalisco and Nayarit on Monday. The U.S. Embassy issued its third security alert update, directing government staff across multiple consulates to shelter in place. Multiple nations including the U.S., Canada, the U.K., and India have issued shelter-in-place advisories.`)}

${p(`The situation is stabilizing under heavy military presence but remains dynamic. The risk of renewed disruption is elevated, and the medium-term outlook is characterized by significant uncertainty around CJNG succession dynamics.`)}

${label("SECTION 1: THE OPERATION AND ITS IMMEDIATE AFTERMATH")}

${sublabel("How El Mencho Was Killed")}

${p(`The raid was planned and executed by Mexican special forces with intelligence coordination from U.S. agencies. Intelligence indicated El Mencho was present in the Tapalpa area, a mountainous, forested region that has long served as a CJNG stronghold with active laboratories, training camps, and fortified compounds.`)}

${p(`During the operation, CJNG members opened fire on approaching forces. Four cartel members were killed at the scene. El Mencho and two others were wounded and extracted, but all three died during air transport to Mexico City. Two additional individuals were arrested. Three members of the Mexican armed forces were wounded.`)}

${p(`What was seized tells its own story about the organization's military capability: armored vehicles, rocket launchers described as "capable of shooting down aircraft and destroying armored vehicles," and additional weaponry.`)}

${sublabel("The Retaliation: Scale and Character")}

${p(`The retaliatory response was not improvised. Its speed, geographic scope, and tactical coordination indicate CJNG activated pre-planned contingency protocols within hours. This is consistent with the cartel's documented organizational doctrine.`)}

${p(`Narcobloqueos (road blockades): Operatives hijacked cargo trucks, passenger buses, and civilian vehicles and set them ablaze at strategic highway chokepoints. More than 250 blockade points across 20 states.`)}

${p(`Arson targeting commercial infrastructure: Oxxo stores, Banco del Bienestar branches, pharmacies, gas stations, a Costco in Puerto Vallarta, and public transportation were set ablaze. In Guanajuato alone, 18 bank branches and 69 Oxxo stores were damaged.`)}

${p(`Armed convoy deployment: "Monstruos," CJNG's improvised armored vehicles, were observed in multiple locations.`)}

${p(`Psychological operations: Social media messages attributed to CJNG threatened to forcibly enter homes and hotels by 5:00 PM. These threats were NOT carried out, but effectively amplified panic. Jalisco authorities confirmed several viral images, including purported gunfire inside Guadalajara airport and images of downtown Puerto Vallarta engulfed in flames, were AI-generated fakes.`)}

${p(`Prison coordination: A jail guard was killed during a prisoner riot at a lockup in Puerto Vallarta.`)}

${sublabel("Confirmed Casualties (As of February 23 AM)")}

${p(`Security forces killed: 1 National Guard member in Tapalpa, 6 National Guard members in Zapopan, 1 jail guard in Puerto Vallarta, 1 Jalisco state prosecutor's office agent in Guadalajara. 3 military personnel wounded.`)}

${p(`CJNG killed: 4 at the Tapalpa raid site, 3 (including El Mencho) died during air transport, multiple additional operatives killed during retaliatory confrontations.`)}

${p(`Arrests: 25-30 individuals detained for blockade activities and looting.`)}

${p(`Civilian impact: No confirmed civilian fatalities. 1,200+ civilians stranded at Guadalajara Zoo overnight under police guard. Thousands of travelers stranded at airports.`)}

${label("SECTION 2: JALISCO (PRIMARY CRISIS ZONE)")}

${sublabel("CJNG Territorial Control (Unchanged Post-Death)")}

${p(`A single leadership elimination does not alter territorial control. Every previous cartel decapitation in Mexico has confirmed this. CJNG maintains near-hegemonic dominance across its core Jalisco zones.`)}

${p(`Full operational control: The rural and mountainous sierras, including Tapalpa, Talpa de Allende, Autlan, and the Cihuatlan corridor. These zones contain active methamphetamine and fentanyl production laboratories, training camps, dirt airstrips, and fortified compounds. The southern coastal corridor extending to the Colima border and the port of Manzanillo remains under CJNG control.`)}

${p(`Deep urban infiltration: Puerto Vallarta (tourism extortion and timeshare rackets) and the Guadalajara metropolitan area (money laundering, forced retail participation, disappearances).`)}

${sublabel("Guadalajara Metropolitan Area")}

${p(`The Guadalajara metro, Mexico's second-largest city and a scheduled host for four FIFA World Cup matches in June 2026, was paralyzed for approximately eight hours on February 22.`)}

${p(`Periferico system: More than 20 blockade points confirmed across the metro area during peak violence.`)}

${p(`Airport: Guadalajara International Airport (GDL) remained physically operational but experienced significant panic. Multiple domestic and international flights were cancelled. Delta, American, United, Alaska, Air Canada, and Southwest all cancelled or diverted flights.`)}

${p(`Current status (morning of February 23): Most blockades cleared overnight. Traffic is slow but flowing with heavy National Guard and SEDENA patrols. Codigo Rojo remains active. Schools are closed Monday. Burned-out vehicles and damaged Oxxo stores and bank branches remain visible throughout the city.`)}

${sublabel("Puerto Vallarta")}

${p(`Starting in the early-to-mid afternoon of February 22, armed CJNG operatives on motorcycles transited the city. Multiple fires were set across commercial zones. A Costco in the hotel/marina area was set ablaze. Gas stations, Oxxo, and pharmacies were torched. Public buses were torched. Thick black smoke was visible rising over the bay.`)}

${p(`Airport access roads, including MX-200, were blocked with torched vehicles and spike strips. The airport itself was never seized, but access was severely disrupted. Air Canada, United, Delta, American, Southwest, and Alaska Airlines all cancelled flights. Over 50% of arrivals and 62% of departures from PVR were cancelled on February 22.`)}

${p(`Current status: Puerto Vallarta is described by residents and journalists as a "ghost town" with heavy military presence. Governor Lemus announced public transit service will resume statewide on Monday. U.S., Canadian, and multiple other embassies continue to direct their citizens to shelter in place. Taxi and rideshare services remain suspended.`)}

${p(`Assessment: PV remains HIGH RISK for the next 48-72 hours.`)}

${sublabel("Ajijic and Lake Chapala (Expat Zone)")}

${p(`The Ajijic/Chapala area, home to approximately 50,000 American and Canadian expatriate retirees, sits squarely within CJNG's sphere of influence. The U.S. Embassy shelter-in-place advisory explicitly names Chapala.`)}

${p(`Key incidents: Multiple blockades with torched vehicles on Carretera a Chapala, the primary access road from Guadalajara. A shootout at the Lazaro Cardenas and Carretera a Chapala intersection.`)}

${p(`Ajijic village itself: No reported urban battles or home invasions. Expat community reports "eerie calm" with heavy patrols visible. Impact was primarily on access roads. Government checkpoints are now active on all approaches.`)}

${p(`Assessment for expats: Low direct violence risk inside the lakeside communities but HIGH risk on access roads. Shelter-in-place strictly. Stock essentials. The succession vacuum is unlikely to produce direct violence in the lake area in the near term, but reduced centralized control may produce more erratic local extortion and criminal activity.`)}

${sublabel("Jalisco Rural and Sierra Routes (HIGHEST ONGOING RISK)")}

${p(`Tapalpa/Talpa de Allende: The epicenter of the raid. Active military operations continue. This area should be considered an active combat zone.`)}

${p(`Ojuelos (northern Jalisco, near Zacatecas border): Heavy clashes with federal forces continued into the morning of February 23. Armed CJNG elements remain engaged.`)}

${p(`Assessment: Do not transit any rural or secondary road in southern Jalisco under any circumstances until further notice. Residual retenes (narco checkpoints) and ambush risk remain elevated throughout the sierra.`)}

${sublabel("Jalisco Route Status Summary")}

${p(`Primary highways: Zero major narco checkpoints as of the morning of February 23. Officials confirm "slow but constant traffic flow." Government checkpoints and GN/SEDENA patrols are ubiquitous on all major arteries.`)}

${p(`Secondary/rural routes: Proceed with extreme caution. Lingering risk on secondary roads, particularly in the Ojuelos area and throughout the southern sierras.`)}

${label("SECTION 3: RESORT AREAS AND TOURISM CORRIDORS")}

${sublabel("Cancun / Quintana Roo (Including Playa del Carmen, Tulum, Cozumel)")}

${p(`The retaliation extended to Quintana Roo, though at lower intensity than Jalisco. More than a dozen vehicles were torched and two businesses set on fire across the state on February 22. Three cars set on fire on Highway 180 between Cancun and Puerto Morelos, two cars ablaze in Centro Maya shopping mall parking lot in Playa del Carmen, Oxxo stores set ablaze in Tulum.`)}

${p(`U.S. government staff in Cancun, Playa del Carmen, and Cozumel have been directed to shelter in place on Monday. The U.S. Embassy advisory explicitly covers Cancun, Cozumel, Playa del Carmen, and Tulum.`)}

${p(`Current status: Contained spillover. Roads mostly reopened with heavy patrols. Resorts report internal calm but advise low profiles.`)}

${p(`Assessment: MODERATE risk. The Riviera Maya experienced real but limited retaliatory activity. Monitor for whether CJNG succession dynamics produce increased extortion activity in this corridor.`)}

${sublabel("Oaxaca Coast (Huatulco, Puerto Escondido)")}

${p(`Vehicle burnings and blockades were reported in the Istmo zone affecting resort access roads. Airport roads to both PXO and PXM saw temporary retenes that were cleared.`)}

${p(`Current status: Lightest direct impact among major resort areas. Roads reopened. Resorts operational.`)}

${p(`Assessment: LOW-MODERATE risk.`)}

${sublabel("Los Cabos / Cabo San Lucas (Baja California Sur)")}

${p(`No confirmed blockades or arson tied to the El Mencho retaliation were reported in the Los Cabos corridor. An isolated Oxxo fire was reported in La Paz, more than 100 miles north of Cabo, with no impact on the resort area.`)}

${p(`Current status: Unaffected. U.S. advisories remain at Level 2. Airports, hotels, and tourist operations fully open.`)}

${p(`Assessment: LOW risk. Cabo is the safest of the major resort areas. Sinaloa dominance and geographic distance from CJNG's core provide a natural buffer.`)}

${label("SECTION 4: MONTERREY AND NORTHERN MANUFACTURING CORRIDOR")}

${p(`Nuevo Leon saw only isolated spillover incidents, primarily attempted narcobloqueos on highways feeding toward Tamaulipas border plazas. No sustained urban violence or major fires in Monterrey proper.`)}

${p(`Fuerza Civil dismantled obstructions rapidly under Operativo Muralla and restored circulation on key routes by midday on February 22.`)}

${p(`Current status: Normal traffic in city core. Schools and events proceeding normally in the metro area on Monday. Heavy patrols visible on Periferico, major avenues, the airport (MTY), and industrial zones.`)}

${sublabel("Key Shipping Routes to the U.S. Border")}

${p(`Monterrey to Nuevo Laredo (MX-85/85D Autopista): This is the busiest U.S. land port. No major blockades. Normal traffic with increased military checkpoints.`)}

${p(`Monterrey to Reynosa/Matamoros (via MX-40): More heavily impacted on February 22. Attempted blockades and vehicle burnings on the Reynosa side spilled to Nuevo Leon approaches. Cleared by approximately noon.`)}

${p(`Overall shipping impact: Freight delays were minimal (1-3 hours on affected segments). Most routes remained operational throughout. Border crossings at Laredo/Nuevo Laredo remain open with heightened scrutiny.`)}

${p(`Assessment for Monterrey operations: LOW-MODERATE risk. Monterrey is the most stable major metro in the current environment. Industrial operations should proceed normally with heightened security awareness.`)}

${label("SECTION 5: U.S.-MEXICO BORDER CROSSINGS")}

${p(`All 50+ international border crossings remain open with no closures reported. The physical border infrastructure was not targeted.`)}

${sublabel("Western Border (Baja California)")}

${p(`Tijuana/San Ysidro/Otay Mesa/CBX: Approximately 10+ narcobloqueos documented in the Tijuana area on February 22, including burned vehicles on airport road and Otay Mesa feeders. Crossings remained open but with long lines. U.S. Consulate Tijuana staff directed to shelter in place.`)}

${p(`Mexicali/Calexico: Six or more blockades documented. Open with delays; lighter impact than Tijuana.`)}

${p(`Nogales: Scattered reports of tension but minimal confirmed arsons. Fully operational.`)}

${sublabel("Central Border")}

${p(`Ciudad Juarez/El Paso: Minimal direct blockades. Open with normal-to-slow traffic. Relative calm compared to western and eastern sectors.`)}

${p(`Nuevo Laredo/Laredo, TX: No major incidents at actual bridges. Open with heightened security. This crossing handles the largest volume of U.S.-Mexico trade and remained functional throughout.`)}

${sublabel("Eastern Border")}

${p(`Reynosa/McAllen and Matamoros/Brownsville: Blockades on Reynosa airport/highway roads documented but cleared by morning. Full shelter-in-place advisory for all of Tamaulipas. Open with possible delays.`)}

${p(`Assessment for border operations: All crossings are operational. Primary delays (1-4 hours) occurred on western approaches and are resolving. Avoid non-essential land crossings in Baja California and Tamaulipas. Use major ports of entry during daytime hours only.`)}

${label("SECTION 6: MEXICO CITY")}

${p(`Mexico City, paradoxically, served as both the destination for El Mencho's remains and the calmest major metro in Mexico during the crisis.`)}

${p(`No widespread narcobloqueos, arsons, or sustained clashes occurred inside Mexico City's core. A single vehicle fire was reported on the southern outskirts.`)}

${p(`AICM and AIFA airports are fully operational with no disruptions. Metro and Metrobus ran normal schedules. Schools and public services are largely unaffected. The U.S. Embassy did not issue a shelter-in-place for Mexico City itself.`)}

${p(`Assessment: VERY LOW risk for the immediate crisis. Normal business and tourism operations in the capital.`)}

${label("SECTION 7: AIRPORTS AND AIR TRAVEL")}

${p(`All major public airports remain open with no seizures or terminal attacks. The critical vulnerability is ground access roads, not the airports themselves.`)}

${p(`Puerto Vallarta (PVR): Most heavily impacted. Over 50% of arrivals and 62% of departures cancelled on February 22. United, Delta, American, Southwest, Alaska, Air Canada, WestJet, and Porter all cancelled or diverted flights. Airport spokesperson confirmed "all international operations and most national operations were canceled Sunday." Partial resumption expected Monday but commercial flights remain unreliable.`)}

${p(`Guadalajara (GDL): Open but experienced passenger panic and widespread cancellations. Partial flight resumption on February 23. Protected by National Guard and SEDENA troops.`)}

${p(`Cancun (CUN): Open with normal operations. Some Highway 180/307 approach blockades cleared.`)}

${p(`Monterrey (MTY): Fully normal operations throughout.`)}

${p(`Mexico City (MEX/AIFA): Fully normal. No disruptions.`)}

${p(`Tijuana (TIJ): Open with minor approach blockade delays now cleared.`)}

${p(`Private aviation/FBOs: All major FBOs remain fully operational at all sites. Private aviation offers a viable bypass for business and high-net-worth travelers. In Puerto Vallarta specifically, the Aerotron FBO and Universal Aviation are operational and have been utilized by private charter operators. Pre-arranged ground transport with security escorts is recommended for any FBO arrivals in Jalisco.`)}

${label("SECTION 8: FORWARD ASSESSMENT AND KEY INTELLIGENCE INDICATORS")}

${sublabel("Immediate Outlook (Next 72 Hours)")}

${p(`The trajectory is toward continued stabilization under heavy security force presence. However, several factors keep the risk of renewed disruption elevated:`)}

${p(`CJNG demonstrated the capability to activate more than 250 blockades across 20 states within hours. That infrastructure remains intact. A second wave is possible if surviving leadership seeks to demonstrate continued capability.`)}

${p(`Narco-mensajes from CJNG leadership or aspiring successors are expected within 24-48 hours. These will be the first signals about organizational cohesion or fragmentation.`)}

${p(`Rural CJNG strongholds in the Jalisco sierras are entirely untouched by the operation. The federal raid targeted El Mencho personally, not CJNG's production or territorial infrastructure.`)}

${p(`Guadalajara's status as a host city for four FIFA World Cup matches in June 2026 adds a political dimension.`)}

${sublabel("Medium-Term Outlook (1-4 Weeks): Succession")}

${p(`The critical intelligence question is whether CJNG consolidates under a single successor or fragments.`)}

${p(`There is no obvious successor to Oseguera. His brother is in a US prison, and his son, called El Menchito, is also in prison. As is his daughter. CNN reporting confirmed that multiple high-ranking CJNG figures are already in U.S. custody, including El Mencho's brother Antonio "Tony Montana" Oseguera Cervantes, El Mencho's son Ruben "El Menchito" Oseguera Gonzalez (sentenced to life plus 30 years), El Mencho's brother-in-law Abigael Gonzalez Valencia (Los Cuinis leader), and CJNG co-founder Erick "El 85" Valencia Salazar. El Mencho's son-in-law was sentenced to 11 years for money laundering in December 2025.`)}

${p(`This decimation of the leadership's inner circle means succession will likely fall to regional commanders rather than family members, increasing the probability of fragmentation.`)}

${sublabel("Long-Term Outlook (1-6 Months): The Kingpin Strategy's Track Record")}

${p(`The historical record is consistent: El Chapo's arrest fractured the Sinaloa Cartel into warring factions that produced the Sinaloa civil war still producing casualties today. The dismantling of Los Zetas produced a patchwork of smaller, less predictable groups. No major cartel decapitation in Mexico since 2006 has produced reduced violence in the medium term.`)}

${p(`If fragmentation occurs, expect more erratic extortion, less predictable violence patterns, expanded turf conflict in contested zones (Michoacan, Guanajuato, Colima border areas), and increased competition for CJNG's fentanyl and methamphetamine production and trafficking networks.`)}

${sublabel("Key Indicators to Monitor")}

${p(`Narco-mensajes / narcomantas claiming leadership: Signals whether succession consolidates or fragments.`)}

${p(`Second wave of coordinated blockades: Would demonstrate organizational capability intact under new leadership.`)}

${p(`Inter-cartel confrontations in Michoacan/Guanajuato border zones: Sinaloa factions, Los Viagras, and La Familia Michoacana remnants probing CJNG boundaries would signal an accelerating power vacuum.`)}

${p(`Escalation of extortion demands in Guadalajara/Puerto Vallarta: Would indicate local cells operating autonomously without centralized restraint.`)}

${p(`U.S. follow-on actions: DOJ indictments, Treasury sanctions, and the Joint Interagency Task Force-Counter Cartel operational tempo will indicate whether Washington exploits the disruption window.`)}

${p(`FIFA World Cup security preparations: Government response to the security implications for Guadalajara as a host city will signal the priority level of stabilization efforts.`)}

${label("SECTION 9: RECOMMENDATIONS")}

${sublabel("Immediate (Next 72 Hours)")}

${p(`Suspend all non-essential travel to Jalisco, Michoacan, Guanajuato, Colima, Nayarit, Tamaulipas, and Baja California. This includes commercial flights through PVR and GDL, which remain unreliable.`)}

${p(`Personnel in-country: shelter in place. Follow U.S. Embassy directives. Do not rely on taxi or rideshare services in Puerto Vallarta (suspended) or attempt ground transportation on secondary roads.`)}

${p(`Conduct personnel accountability check-ins with all staff, contractors, dependents, and business partners in affected regions.`)}

${p(`Supply chain teams: notify logistics partners of residual highway risk. Primary corridors are reopening but secondary routes remain unpredictable.`)}

${p(`Information discipline. Do not make operational decisions based on unverified social media. Jalisco authorities have confirmed AI-generated fake images are circulating. Rely on official sources (SEDENA, GN_Carreteras, state governors, U.S. Embassy) and Centinela Intel reporting.`)}

${sublabel("Near-Term (1-4 Weeks)")}

${p(`Elevate security posture at all facilities in affected states. Brief local security teams on the succession violence risk profile and more erratic extortion demands from local cells operating without centralized oversight.`)}

${p(`Executive protection: Enhanced measures for senior personnel. Avoid predictable movement patterns. Pre-arrange ground transport with security options for any necessary travel.`)}

${p(`Document current extortion baseline. If your operations are subject to extortion demands, record current levels. Anticipate potential escalation as CJNG cells adjust to the new power dynamic.`)}

${p(`Review and update contingency plans. Evacuation procedures, business continuity protocols, crisis communication plans, and insurance coverage should all be reviewed.`)}

${sublabel("Strategic (1-6 Months)")}

${p(`Reassess territorial risk exposure. If CJNG fragments, the risk map changes. Previously stable (if controlled) areas may become contested.`)}

${p(`Tourism sector modeling. Organizations with tourism-dependent operations in Puerto Vallarta, Guadalajara, or the broader Jalisco coast should model revenue impact scenarios for sustained security disruption, particularly in the context of the approaching FIFA World Cup.`)}

${p(`Monitor Centinela Intel. We will provide ongoing situation reports, updated threat assessments, route-specific advisories, and flash alerts as succession dynamics develop and the security landscape evolves.`)}

${label("NEXT UPDATE")}

${p(`Scheduled: 23 February 2026, 2000 hrs MST, or sooner if a material change in conditions occurs.`)}

${p(`Flash alerts will be issued immediately for critical threshold events.`)}

<p style="margin: 24px 0 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&mdash; Chris Dover, Founder<br><em>Centinela Intel | Latin America Security Intelligence</em></p>
`.trim();

const ctaBlock = renderCTA("briefing", { position: "footer" });

const html = baseTemplate({
  content: body,
  unsubscribeUrl: "#",
  ctaBlock,
  isAlert: true,
  preheader: "Comprehensive Mexico situation report — Post-El Mencho regional intelligence assessment. We have people on the ground and are coordinating charter flights.",
});

async function main() {
  const isSend = process.argv.includes("--send");

  if (!isSend) {
    console.log("HTML length:", html.length);

    const result = await resend.emails.send({
      from: "Centinela Intel <intel@centinelaintel.com>",
      to: "chris@centinelaintel.com",
      subject: `[PREVIEW] ${SUBJECT}`,
      html,
    });

    console.log("Preview sent:", result.data?.id || result.error);
  } else {
    // Create campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        type: "broadcast",
        subject: SUBJECT,
        htmlContent: body,
        status: "draft",
        tags: "briefing",
        notes: "Comprehensive Mexico Situation Report — Post-El Mencho regional intelligence assessment.",
      },
    });

    console.log(`Campaign created: ${campaign.id}`);

    // Update campaign to use broadcast type so variant-renderer passes body as raw HTML
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { htmlContent: body, type: "broadcast" },
    });

    const { sendCampaign } = await import("../lib/campaigns/send-brief");
    console.log("Sending to full subscriber list...");
    const result = await sendCampaign(campaign.id);
    console.log(`Done. Sent: ${result.scheduled}, Failed: ${result.failed}`);
    if (result.errors.length > 0) console.log("Errors:", result.errors);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
