/**
 * Send the Iran Analysis report as a broadcast email to all active subscribers.
 * Includes all 9 chart images from the PDF.
 * Usage: npx tsx scripts/send-iran-analysis.ts
 */

import prisma from "../lib/prisma";
import { sendCampaign } from "../lib/campaigns/send-brief";

const IMG_BASE = "https://centinelaintel.com/email-images/iran-analysis";

const htmlBody = `
<p style="margin: 0 0 4px; font-size: 11px; letter-spacing: 1.5px; color: #999999; text-transform: uppercase;">Centinela Intelligence Report</p>

<h1 style="margin: 0 0 8px; font-size: 28px; line-height: 1.2; font-weight: 700; color: #1a1a1a;">62% and Climbing: Inside the Math on a US-Iran War</h1>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #666666; font-style: italic;">I built a Bayesian model to cut through the noise. Here's what the data actually says about the next 10 days.</p>

<p style="margin: 0 0 4px; font-size: 13px; color: #666666;"><strong style="color: #1a1a1a;">Chris Dover</strong> &nbsp;|&nbsp; Centinela Intelligence &nbsp;|&nbsp; February 24, 2026</p>
<p style="margin: 0 0 24px; font-size: 12px; color: #4da6ff;">#Geopolitics #Iran #NationalSecurity #BayesianAnalysis #EnergyMarkets #RiskAnalysis #MiddleEast</p>

<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 24px;">

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">I'm going to skip the preamble on this one.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Two US carrier strike groups are in the Persian Gulf right now. 120+ combat aircraft are forward deployed. Trump gave Iran a 10-to-15-day deadline to make a nuclear deal &mdash; and that clock runs out around March 1st. Iran responded by closing the Strait of Hormuz for live-fire exercises. Gold just blew past $5,400 an ounce. The International Crisis Group came out and said these two countries have &ldquo;never been so close to a major war.&rdquo;</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Everybody's got an opinion on this. Cable news is running the same five talking points on loop. What nobody seems to be doing is actually putting a number on it.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">So I did.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">I built a Bayesian probability model that synthesizes nine observable evidence variables &mdash; military posture, diplomatic status, rhetoric, nuclear activity, proxy mobilization, and more &mdash; into a single, updateable conflict probability. Not vibes. Not punditry. Math.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The model currently puts the probability of US military strikes on Iran in the next 30 days at <strong style="color: #ff4757; font-size: 17px;">62%</strong>.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Let me walk you through how I got there, what it means for markets, and what I'm watching over the next 10 days.</p>

<!-- HOW WE GOT HERE -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">How We Got Here</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">To make sense of where we are, you have to see the trajectory. This isn't a situation that materialized overnight. It's been building since the June 2025 ceasefire, and the model has been tracking it the whole way:</p>

<img src="${IMG_BASE}/bayesian-probability.png" alt="Bayesian Conflict Probability Evolution — June 2025 to February 2026" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Bayesian Conflict Probability — June 2025 to Today</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Right after the June ceasefire, conflict probability sat at 15%. Reasonable. Both sides had just gotten punched in the mouth and needed time to regroup.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Then the escalation ladder kicked in. Iran authorized nuclear weaponization in October. The US deployed the Lincoln carrier strike group in January. Iran and Russia and China signed a strategic pact on January 29th. An IRGC boat tried to seize a US tanker on February 3rd &mdash; an F-35 shot down an Iranian drone near the Lincoln that same day. Iran closed the Strait of Hormuz on February 16th. And then Trump dropped the deadline on the 19th.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">See that little dip around February 6th? That's the Oman talks. Both sides called them a &ldquo;good start.&rdquo; The model responded &mdash; probability dropped from 48% to 42%. That's how it should work. De-escalation signals pull the number down. But the diplomatic window slammed shut almost immediately.</p>

<!-- THE MODEL -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">The Model: Why Bayes and Why These Variables</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Here's the problem with most geopolitical analysis: it's narrative-driven and unfalsifiable. Analysts say tensions are &ldquo;high&rdquo; or &ldquo;rising&rdquo; but never commit to a number. That means you can't measure whether they were right after the fact, and &mdash; more importantly &mdash; you can't use it to actually manage risk.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Bayesian inference fixes this. You start with a prior (base rate probability of conflict), then update it with evidence. Each piece of evidence has two key properties: how likely you'd see that signal if conflict IS coming, and how likely you'd see it even if it ISN'T. The ratio between those two numbers is what moves the needle.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Nine evidence variables. Each one calibrated against past US-Iran crises (2012, 2019, 2025). Here's how much weight each one carries right now:</p>

<img src="${IMG_BASE}/evidence-weight.png" alt="Bayesian Evidence Weight — How Much Each Variable Shifts the Probability" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Evidence Weight — Which Signals Actually Move the Needle</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Presidential rhetoric is the strongest signal at 2.14 bits.</strong> That means the current language &mdash; explicit deadline with military positioning &mdash; is 4.4x more likely in a pre-conflict scenario than in one that fizzles out. And look, I know Trump talks a big game. Everybody knows that. But there's a meaningful difference between tweeting threats and deploying two carrier strike groups while issuing a calendar deadline. The model captures that distinction. Generic bluster scores a 0.50. An explicit deadline with force deployment scores a 0.88.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Military buildup is right behind it at 1.77 bits.</strong> Two carrier strike groups in the CENTCOM AOR is the largest naval deployment since 2003 Iraq. When you combine the Ford and the Lincoln, plus F-22s deploying to Israel, plus 120+ combat aircraft surging to regional bases &mdash; the signal is hard to misread. This isn't a show of force. This is a force that's ready to go.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Regional opposition is the weakest discriminator at 0.14 bits.</strong> Why? Because Gulf states opposing strikes is basically a constant. It happens whether or not conflict occurs. Saudi opposed the Iraq war and it happened anyway. Not useless information, but not a strong signal either direction.</p>

<!-- WHY THE NEXT 10 DAYS -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Why the Next 10 Days Are the Window</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Three things are converging right now that make late February through early March the highest-probability strike window:</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>The moon.</strong> New moon hits around March 1st. If you know anything about US military operations, you know this matters. Desert Storm launched on a new moon. The Iraq invasion launched on a new moon. The bin Laden raid &mdash; new moon. US doctrine heavily favors minimum illumination for initial strike packages. The window from roughly February 27th through March 5th is as dark as it gets.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>The weather.</strong> Persian Gulf temps in late February sit around 18&ndash;28&deg;C. Compare that to the 50&deg;C+ summer hellscape that degrades everything from pilot performance to electronics. Seas are calm. Dust storms are at seasonal low. Visibility is good. From a purely operational standpoint, this is about as clean a window as the theater offers.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>The deadline.</strong> Trump's 10-to-15-day clock, set on roughly February 19th, expires between March 1st and 6th. That lines up almost perfectly with the new moon. I don't think that's an accident. The military planning cycle would have identified this window months ago.</p>

<!-- THE FORCE PICTURE -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #4da6ff;">The Force Picture</h2>

<img src="${IMG_BASE}/force-comparison.png" alt="Force Comparison: US/Coalition vs. Iran" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">US/Coalition vs. Iran — Relative Capability</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The US has overwhelming conventional superiority in air, sea, cyber, and special operations. That's not news. What's worth paying attention to is where Iran has the edge: roughly 5,000 naval mines, 1,500 fast attack boats built for swarm tactics in tight Gulf waters, and a drone fleet numbering in the thousands. Iran doesn't need to win a conventional fight. It needs to make the fight expensive enough to change the political calculus.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The other thing that matters: this isn't 2003. The regional basing picture is fundamentally different. Saudi Arabia has publicly denied airspace for attack routes. Qatar &mdash; which hosts Al Udeid, the biggest US air base in the Middle East &mdash; is playing mediator, not combatant. That means the US is likely leaning hard on sea-launched Tomahawks, B-2 sorties from Missouri (30+ hour round trips), and carrier aviation instead of the sprawling regional network that supported Iraq.</p>

<!-- WHAT THE STRIKES WOULD LOOK LIKE -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #4da6ff;">What the Strikes Would Look Like</h2>

<img src="${IMG_BASE}/attack-vectors.png" alt="Attack Vector Assessment — Likelihood vs. Effectiveness" style="width: 100%; max-width: 400px; height: auto; margin: 0 auto 4px; display: block; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Attack Vector Assessment — Likelihood vs. Effectiveness</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Standoff cruise missiles are the bread and butter &mdash; 600+ Tomahawks available in a single salvo from the current fleet posture, zero pilot risk. But the hardest target in the world right now is probably Fordow, Iran's enrichment facility buried under 80 meters of mountain. The only conventional weapon that can touch it is the GBU-57 Massive Ordnance Penetrator, a 30,000-pound bomb delivered by B-2 stealth bombers. And even that's not a guarantee.</p>

<!-- FOUR SCENARIOS -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Four Scenarios, Weighted</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">If conflict kicks off, here's how I'm weighting the scope:</p>

<img src="${IMG_BASE}/strike-scope.png" alt="IF Conflict Occurs — Strike Scope Distribution" style="width: 100%; max-width: 420px; height: auto; margin: 0 auto 4px; display: block; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">IF Conflict Occurs — Strike Scope Distribution</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Surgical Nuclear Only (35%)</strong><br>1&ndash;3 days. B-2s with bunker busters and cruise missiles hitting Fordow, Natanz, Isfahan, Parchin. Nothing else. The &ldquo;minimum viable strike&rdquo; &mdash; set the program back, declare victory, hope Iran absorbs the hit without escalating. Problem is, Iran almost certainly retaliates, which pushes us into...</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Nuclear + Military Infrastructure (40%)</strong><br>3&ndash;7 days. This is the most likely scenario and it's basically what happened in June 2025 but bigger. Nuclear sites plus missile bases, air defenses, IRGC naval assets, command-and-control. History tells us limited strikes rarely stay limited once the other side starts shooting back. This is where escalation dynamics take over.</p>

<p style="margin: 0 0 12px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Comprehensive Degradation (15%)</strong><br>2&ndash;4 weeks. Full spectrum &mdash; nuclear, military, economic targets (oil infrastructure, ports), and regime leadership. This only happens if the political objective shifts to regime change. Massive resource commitment, massive political risk, massive humanitarian fallout.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Diplomatic Off-Ramp (24% unconditional)</strong><br>Iran has signaled willingness to suspend enrichment for 1&ndash;5 years. The force buildup might be the coercive leverage that makes a deal happen. Wouldn't be the first time the threat of force produced a diplomatic breakthrough. But it needs a face-saving formula for both sides, and the gap between &ldquo;zero enrichment&rdquo; (the US demand) and &ldquo;temporary suspension&rdquo; (Iran's offer) is still enormous.</p>

<!-- IRAN'S FRIENDS -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Iran's Friends: Weakened but Not Toothless</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The Axis of Resistance has taken an absolute beating over the past 18 months. Hezbollah's leader is dead. Assad fell. Hamas is gutted. But writing off Iran's retaliatory network would be a mistake.</p>

<table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-size: 13px; margin: 0 0 16px; border: 1px solid #e5e5e5;">
  <tr style="background-color: #f5f5f5;">
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Actor</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Role</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Current State</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Will They Act?</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Kataib Hezbollah</strong></td>
    <td style="border: 1px solid #e5e5e5;">Iraq &mdash; IRGC proxy militia</td>
    <td style="border: 1px solid #e5e5e5;">Actively recruiting, including suicide bombers. War prep order Jan 25.</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757; font-weight: bold;">ALMOST CERTAIN</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Houthis</strong></td>
    <td style="border: 1px solid #e5e5e5;">Yemen &mdash; Red Sea ops</td>
    <td style="border: 1px solid #e5e5e5;">Best shape of any proxy. Anti-ship missiles, drones, ballistic missiles. 750-ton weapons seized en route.</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757; font-weight: bold;">ALMOST CERTAIN</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Hezbollah</strong></td>
    <td style="border: 1px solid #e5e5e5;">Lebanon &mdash; rebuilding</td>
    <td style="border: 1px solid #e5e5e5;">Severely degraded. Nasrallah killed. Rearming via overland routes through Iraq.</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347; font-weight: bold;">LIKELY (limited)</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Russia</strong></td>
    <td style="border: 1px solid #e5e5e5;">Strategic partner</td>
    <td style="border: 1px solid #e5e5e5;">Trilateral pact signed Jan 29. Joint naval drills. No mutual defense clause. Tied down in Ukraine.</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">TALK ONLY</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>China</strong></td>
    <td style="border: 1px solid #e5e5e5;">Economic/diplomatic</td>
    <td style="border: 1px solid #e5e5e5;">Major Iranian oil buyer. UN veto. Not going to war over this.</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">TALK ONLY</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>IRGC Quds Force</strong></td>
    <td style="border: 1px solid #e5e5e5;">Global sleeper cells</td>
    <td style="border: 1px solid #e5e5e5;">Covert ops capability. 2011 DC assassination plot as precedent.</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347; font-weight: bold;">POSSIBLE</td>
  </tr>
</table>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The bottom line on allies: the Russia-China pact is political theater. Neither one is going to war for Iran. The real retaliation threat is Iraqi militias and Houthis &mdash; and they will absolutely act. US forces in Iraq should expect rocket and drone attacks within 24&ndash;48 hours of any strike on Iran. Red Sea shipping disruption gets significantly worse.</p>

<!-- WHAT THIS MEANS FOR MARKETS -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">What This Means for Markets</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Alright, let's talk money. Because that's what a lot of you are really here for.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Markets have already priced in a chunk of geopolitical risk. Gold doesn't go from $2,850 to $5,400 on vibes alone. But the scenario analysis suggests current prices might still be underweighting the tails.</p>

<img src="${IMG_BASE}/gold-price.png" alt="Gold Price Surge — Geopolitical Premium Since June 2025" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Gold's Run — $2,850 to $5,400 in Eight Months</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">That chart tells you everything about sentiment. Every single escalation event put in a new floor. And notice there's no meaningful pullback &mdash; gold has basically only gone up since June 2025. Central banks (China, India, Turkey in particular) are buying aggressively. This isn't just retail fear; it's sovereign-level repositioning.</p>

<h3 style="margin: 24px 0 12px; font-size: 18px; font-weight: 700; color: #4da6ff;">Oil Is the Big One</h3>

<img src="${IMG_BASE}/oil-scenarios.png" alt="Oil Price Scenarios by Conflict Intensity" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Brent Crude Scenarios by Conflict Intensity</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Everything comes back to the Strait of Hormuz. About 20% of the world's oil and 25% of global LNG passes through a 21-mile-wide chokepoint every single day. Three-quarters of that oil goes to Asia &mdash; China, India, Japan, South Korea.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">A temporary two-week Hormuz disruption craters global energy supply. War risk insurance is already up 300%+ since January. Shipping companies are rerouting around the Cape of Good Hope, adding two weeks and a million dollars per voyage. And we're not even in a shooting war yet. If Hormuz actually closes &mdash; even for a week &mdash; you're looking at $120&ndash;150 oil, maybe higher. That's not a forecast. That's just arithmetic &mdash; 20% of global supply offline with no quick substitute.</p>

<h3 style="margin: 24px 0 12px; font-size: 18px; font-weight: 700; color: #4da6ff;">Winners and Losers by Sector</h3>

<img src="${IMG_BASE}/sector-impact.png" alt="Sector Impact Analysis by Conflict Scenario" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Sector Impact by Conflict Scenario</p>

<table role="presentation" width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 12px; margin: 0 0 16px; border: 1px solid #e5e5e5;">
  <tr style="background-color: #f5f5f5;">
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Asset</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">No Conflict</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Surgical</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold;">Extended</td>
    <td style="border: 1px solid #e5e5e5; font-weight: bold; color: #ff4757;">Hormuz Closed</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Brent Crude</strong></td>
    <td style="border: 1px solid #e5e5e5; color: green;">$65&ndash;70</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347;">$80&ndash;90</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347;">$95&ndash;110</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757; font-weight: bold;">$120&ndash;150+</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Gold</strong></td>
    <td style="border: 1px solid #e5e5e5; color: green;">$4,800&ndash;5,000</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347;">$5,500&ndash;5,800</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347;">$6,000&ndash;6,500</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757; font-weight: bold;">$7,000+</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>S&amp;P 500</strong></td>
    <td style="border: 1px solid #e5e5e5; color: green;">+2 to +5%</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757;">-3 to -7%</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757;">-8 to -15%</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757; font-weight: bold;">-15 to -25%</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>10Y Yield</strong></td>
    <td style="border: 1px solid #e5e5e5;">Stable ~4.2%</td>
    <td style="border: 1px solid #e5e5e5;">&darr; 3.8&ndash;4.0%</td>
    <td style="border: 1px solid #e5e5e5;">&darr; 3.5&ndash;3.8%</td>
    <td style="border: 1px solid #e5e5e5;">Volatile</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Natural Gas</strong></td>
    <td style="border: 1px solid #e5e5e5; color: green;">Stable</td>
    <td style="border: 1px solid #e5e5e5; color: green;">+10&ndash;15%</td>
    <td style="border: 1px solid #e5e5e5; color: #ffb347;">+20&ndash;40%</td>
    <td style="border: 1px solid #e5e5e5; color: #ff4757; font-weight: bold;">+50&ndash;100%</td>
  </tr>
  <tr>
    <td style="border: 1px solid #e5e5e5;"><strong>Defense Stocks</strong></td>
    <td style="border: 1px solid #e5e5e5;">Flat</td>
    <td style="border: 1px solid #e5e5e5; color: green;">+5&ndash;10%</td>
    <td style="border: 1px solid #e5e5e5; color: green;">+15&ndash;25%</td>
    <td style="border: 1px solid #e5e5e5; color: green; font-weight: bold;">+20&ndash;30%</td>
  </tr>
</table>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>On rates:</strong> An oil spike to $100+ reignites inflation fears and probably kills the two rate cuts markets are pricing in for 2026. You get a stagflation setup &mdash; rising prices, slowing growth &mdash; which is the single worst macro environment for balanced portfolios. The Fed ends up trapped between cutting to support growth and holding to fight inflation. Nobody wants to be in that box.</p>

<!-- THE PART NOBODY WANTS TO TALK ABOUT -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">The Part Nobody Wants to Talk About</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">I almost didn't include this section. LinkedIn is a professional platform and people are here for market takes, not moral reckonings. But I think ignoring the human dimension of a potential war involving a country of 90 million people would be irresponsible.</p>

<img src="${IMG_BASE}/displacement.png" alt="Humanitarian Displacement Projections by Scenario" style="width: 100%; max-width: 560px; height: auto; margin: 0 0 4px; border-radius: 4px;" />
<p style="margin: 0 0 16px; font-size: 12px; color: #999999; text-align: center; font-style: italic;">Displacement Projections by Scenario</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The June 2025 precedent &mdash; a 12-day limited war &mdash; killed over 627 people, injured 5,000, and displaced 7 million internally. Tehran experienced a mass exodus. Over a million Afghan refugees were forcibly expelled back across the border.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Worst case?</strong> The CATO Institute projects that a regime collapse scenario could produce 23 million cross-border refugees. That's ten times the Syrian refugee crisis. Turkey &mdash; already hosting 3.5 million Syrians &mdash; would buckle. Europe would face a migration wave that makes 2015 look like a prelude.</p>

<p style="margin: 0 0 24px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">These numbers should factor into anyone's risk calculus. The second- and third-order effects of destabilizing a country this size don't stay in the Middle East. They show up in European politics, energy prices, food security, and global aid budgets for years.</p>

<!-- WHAT I'M WATCHING -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #1a1a1a;">What I'm Watching Right Now</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>The deadline.</strong> Full stop. March 1&ndash;6. If it passes without strikes or a credible diplomatic framework, the probability starts to decay &mdash; though the force posture keeps it elevated. If it expires and B-2s are wheels-up, everything else is secondary.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Specific indicators I'm tracking:</p>

<ul style="margin: 0 0 24px; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">
  <li style="margin-bottom: 8px;">B-2 departures from Whiteman AFB &mdash; OSINT-trackable and the clearest 24&ndash;48 hour warning signal</li>
  <li style="margin-bottom: 8px;">NOTAMs closing Iranian airspace to civilian traffic &mdash; this is the &ldquo;it's happening&rdquo; indicator</li>
  <li style="margin-bottom: 8px;">Diplomatic resumption &mdash; any announcement of new Oman/Geneva talks would pull the probability down 8&ndash;12 points</li>
  <li style="margin-bottom: 8px;">Gold and oil as real-time crowd-sourced probability &mdash; the market is pricing this faster than any analyst can type</li>
  <li style="margin-bottom: 8px;">IRGC naval dispersal from port &mdash; if they're moving assets out of Bandar Abbas, they're expecting strikes</li>
  <li style="margin-bottom: 8px;">Iraqi militia attacks on US forces &mdash; a spike in rocket/drone incidents in Iraq could indicate Iran has pre-authorized proxy action</li>
</ul>

<!-- A WORD ON HUMILITY -->
<h2 style="margin: 32px 0 12px; font-size: 22px; font-weight: 700; color: #4da6ff;">A Word on Humility</h2>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">62% is high, but it's not a certainty. It means there's still a 38% chance this resolves without a shot fired. Iran has offered to suspend enrichment. Regional mediators are working around the clock. The economic costs of conflict create powerful incentives for both sides to find an off-ramp. And Trump has pulled back before &mdash; in June 2019, he called off strikes with 10 minutes to spare.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The model is a framework, not a crystal ball. The false positive rates on several variables carry real uncertainty. Military buildups have preceded breakthroughs before. Deadlines have been extended.</p>

<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">What I am confident about is the <strong><em>convergence</em></strong>. The signals &mdash; military, diplomatic, rhetorical, nuclear, temporal &mdash; are all pointing the same direction at the same time. That's different from 2019. That's different from every prior US-Iran crisis since 1979. The forces deployed, the deadlines set, the alliances formed, and the weapons tested all point toward a genuine decision point within days.</p>

<p style="margin: 0 0 32px; font-size: 17px; line-height: 1.8; color: #1a1a1a; font-weight: 700;">Position accordingly.</p>

<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0 0 16px;">

<p style="margin: 0 0 12px; font-size: 12px; line-height: 1.6; color: #999999;"><strong>Methodology:</strong> Iterative Bayesian updating across 9 evidence variables, base prior 0.45, calibrated against 2012/2019/2025 Iran crisis precedents. Market data: Alpha Vantage, GoldAPI.io. Events verified against Al Jazeera, NBC News, PBS, RFE/RL, Stars and Stripes, IAEA, Arms Control Association, ACLED, CSIS, Carnegie Endowment, Chatham House, ICG, and CATO Institute. Full interactive dashboard and sourcing available on request.</p>

<p style="margin: 0 0 0; font-size: 12px; line-height: 1.6; color: #999999;"><strong>Chris Dover</strong> is the founder of Centinela Intelligence. This analysis represents the author's views and does not constitute investment advice. Want the live interactive dashboard behind this report? <a href="https://centinelaintel.com/contact?utm_source=centinela&utm_medium=email&utm_content=iran-dashboard&utm_campaign=iran-analysis-feb24" style="color: #999999; text-decoration: underline;">Reach out</a>.</p>
`;

async function main() {
  // 1. Create the campaign
  console.log("Creating campaign...");
  const campaign = await prisma.emailCampaign.create({
    data: {
      type: "broadcast",
      subject: "62% and Climbing: Inside the Math on a US-Iran War",
      htmlContent: htmlBody,
      status: "draft",
      tags: "briefing",
      notes: "Iran Bayesian analysis with 9 charts — LinkedIn cross-post",
    },
  });
  console.log(`Campaign created: ${campaign.id}`);

  // 2. Check subscriber count
  const subscriberCount = await prisma.subscriber.count({
    where: { status: "active" },
  });
  console.log(`Active subscribers: ${subscriberCount}`);

  // 3. Send
  console.log("Sending to all active subscribers...");
  const result = await sendCampaign(campaign.id);
  console.log(`Sent: ${result.scheduled}, Failed: ${result.failed}`);
  if (result.errors.length > 0) {
    console.log("Errors:", result.errors);
  }

  console.log("Done.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
