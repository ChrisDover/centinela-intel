/**
 * 3-email conversion sequence for free subscribers.
 * Day 3: Value reinforcement + what Watch adds
 * Day 7: Social proof + deeper coverage sample
 * Day 14: Direct offer + request briefing CTA
 */

import { baseTemplate } from "./base-template";

interface SequenceEmailOptions {
  unsubscribeUrl: string;
}

/**
 * Day 3 — "Here's what you're getting (and what you're missing)"
 */
export function day3Email({ unsubscribeUrl }: SequenceEmailOptions) {
  const content = `<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">You've been reading The Centinela Brief for a few days now. Quick question: is it useful?</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Every morning you get a threat-level assessment, key developments across 22 Latin American countries, a full country watch, and an analyst note with forward-looking indicators. That's the free brief. It's designed to give you a clear, fast read on what's happening across the region.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The brief covers 22 countries in summary. If you operate in specific countries, you need more than a summary. That's where the paid products come in — and they're priced to be accessible, not exclusive.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Centinela Monitor</strong> goes deep on the countries that matter to you. Daily country-specific intelligence briefs with full threat assessments, incident tracking, and travel risk updates. If you have people, facilities, or supply chain running through Mexico, Colombia, Ecuador, or anywhere else in the region, this is what your security team needs on their desk every morning. $29/mo per country. That's less than a single Uber ride in most of these cities. <a href="https://centinelaintel.com/pricing?utm_source=centinela&utm_medium=email&utm_content=day3_sequence" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">See Monitor plans</a>.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>Watch Pro</strong> is for teams that can't wait until morning. It's a live intelligence terminal — real-time threat map, continuously updated incident feed with flash alerts, and API access to pipe our data directly into your GSOC or travel management platform. Dataminr charges $240K/yr for something in this category. We built Watch Pro for $199/mo because we think security intelligence shouldn't require an enterprise budget. <a href="https://centinelaintel.com/watch?utm_source=centinela&utm_medium=email&utm_content=day3_sequence" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">See Watch Pro</a>.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Either way, the daily brief isn't going anywhere. Keep reading.</p>

<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">— Centinela Intel</p>`;

  return {
    subject: "What you're getting — and what you're not",
    html: baseTemplate({ content, unsubscribeUrl }),
  };
}

/**
 * Day 7 — "Who reads this (and why it matters)"
 */
export function day7Email({ unsubscribeUrl }: SequenceEmailOptions) {
  const content = `<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">One week in. Here's something you might not know.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The Centinela Brief is read by corporate security teams, executive protection firms, family offices, and defense contractors with operations across Latin America. The reason is simple: most English-language coverage of LatAm security is shallow, delayed, or both. We monitor Spanish-language and Portuguese-language OSINT sources that most services miss.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">The daily brief gives you the regional picture. But if you're making decisions about specific countries — deploying personnel, routing logistics, evaluating facility security — you need deeper coverage than a regional summary can provide.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Think about the last time something broke in a country where your organization operates. A roadblock that stranded personnel. A cartel clash near your facility. A political shift that changed the risk picture overnight. The daily brief tells you it happened. <a href="https://centinelaintel.com/pricing?utm_source=centinela&utm_medium=email&utm_content=day7_sequence" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Centinela Monitor</a> tells you what it means for your specific operations. And <a href="https://centinelaintel.com/watch?utm_source=centinela&utm_medium=email&utm_content=day7_sequence" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Watch Pro</a> tells you the moment it starts — with a live threat map and flash alerts pushed to your phone.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Monitor is $29/mo per country. Watch Pro is $199/mo. Both are self-serve — you can be set up and receiving intelligence in under two minutes. No sales calls, no procurement hoops.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Not sure which is right for your situation? <a href="https://centinelaintel.com/contact?utm_source=centinela&utm_medium=email&utm_content=day7_briefing" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Request a complimentary 30-minute threat briefing</a> tailored to your operating environment. We'll walk you through the current threat picture for your specific countries and give you an honest read on what level of coverage makes sense. No obligation.</p>

<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">— Centinela Intel</p>`;

  return {
    subject: "Why security teams read this brief",
    html: baseTemplate({ content, unsubscribeUrl }),
  };
}

/**
 * Day 14 — "Let's talk about your operating environment"
 */
export function day14Email({ unsubscribeUrl }: SequenceEmailOptions) {
  const content = `<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">You've been reading The Centinela Brief for two weeks. You know the product. You know the voice. You know whether it's useful.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">If you or your organization operates in Latin America, I'd like to offer you something.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><strong>A free 30-minute threat briefing, tailored to your specific countries and operations.</strong></p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Not a sales call. An actual intelligence briefing. I'll pull together the current threat picture for your operating environment, walk you through what we're seeing, and give you an honest assessment of the risks. If one of our products makes sense after that — Monitor for daily country intelligence at $29/mo, or Watch Pro for a live terminal at $199/mo — great. If not, you still walk away with actionable intelligence you can use immediately.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">25+ years in global security. This is what I do.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;"><a href="https://centinelaintel.com/contact?utm_source=centinela&utm_medium=email&utm_content=day14_briefing" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Request your briefing here</a>. I'll respond within 24 hours.</p>

<p style="margin: 0; font-size: 15px; line-height: 1.8; color: #1a1a1a;">— Chris Dover<br><span style="font-size: 13px; color: #666;">Founder, Centinela Intel</span></p>`;

  return {
    subject: "Free threat briefing for your operations",
    html: baseTemplate({ content, unsubscribeUrl }),
  };
}

export type SequenceDay = 3 | 7 | 14;

export function getSequenceEmail(
  day: SequenceDay,
  opts: SequenceEmailOptions
) {
  switch (day) {
    case 3:
      return day3Email(opts);
    case 7:
      return day7Email(opts);
    case 14:
      return day14Email(opts);
  }
}
