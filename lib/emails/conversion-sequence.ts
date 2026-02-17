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

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Here's what Centinela Watch subscribers get on top of that:</p>

<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; <strong>Country-specific deep dives</strong> — full intelligence briefs for the countries you operate in, not just summaries</p>
<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; <strong>Real-time incident alerts</strong> — when something breaks, you know immediately</p>
<p style="margin: 0 0 6px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; <strong>Live dashboard</strong> — threat maps, trend data, and custom views for your operating environment</p>
<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">&bull; <strong>Direct analyst access</strong> — ask questions, get answers from someone who's been on the ground</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">If the daily brief is the headline, Watch is the full story. <a href="https://centinelaintel.com/watch?utm_source=centinela&utm_medium=email&utm_content=day3_sequence" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">See what's included</a>.</p>

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

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">That's what the <a href="https://centinelaintel.com/watch?utm_source=centinela&utm_medium=email&utm_content=day7_sequence" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Country Monitor</a> is built for. Pick the countries you care about, and get daily deep-dive intelligence that's actually actionable for your operations.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Not sure if it's right for you? <a href="https://centinelaintel.com/contact?utm_source=centinela&utm_medium=email&utm_content=day7_briefing" style="color: #1a1a1a; text-decoration: underline; font-weight: bold;">Request a complimentary threat briefing</a> — 30 minutes, tailored to your operating environment, no obligation. We'll show you exactly what country-specific intelligence looks like for your situation.</p>

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

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">Not a sales call. An actual intelligence briefing. I'll pull together the current threat picture for your operating environment, walk you through what we're seeing, and give you an honest assessment of the risks. If Centinela Watch makes sense after that, great. If not, you still walk away with actionable intelligence.</p>

<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.8; color: #1a1a1a;">25+ years in global security. 8+ years on the ground in Latin America. This is what I do.</p>

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
