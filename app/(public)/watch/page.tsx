import type { Metadata } from "next";
import { CheckoutButton } from "../CheckoutButton";

export const metadata: Metadata = {
  title: "Watch Pro — The $200K Intelligence Platform for $199/mo | Centinela AI",
  description:
    "Dataminr charges $240K/yr. Crisis24 quotes six figures. Watch Pro gives you the same live threat map, incident feed, and flash alerts for $199/mo. Built by operators who work in Latin America.",
};

const FEATURES = [
  {
    label: "Live Threat Map",
    desc: "Real-time visualization of security events across your monitored countries. Severity-coded incidents plotted on an interactive map.",
  },
  {
    label: "Real-Time Incident Feed",
    desc: "Continuously updated intelligence feed with severity ranking, source attribution, and analyst commentary.",
  },
  {
    label: "Flash Alerts",
    desc: "Immediate push notifications when critical events affect your monitored regions. No delay between detection and notification.",
  },
  {
    label: "API Access",
    desc: "Integrate Centinela intelligence into your GSOC platform, travel management system, or custom security tools.",
  },
  {
    label: "Travel Risk Assessments",
    desc: "Route-specific threat analysis for executive and personnel travel. Insurance-ready documentation for your risk team.",
  },
  {
    label: "Monthly Analyst Strategy Call",
    desc: "Direct access to our intelligence team for strategic discussions, ad-hoc requests, and operational guidance.",
  },
];

const PRICING_DETAILS = {
  base: "$199/mo",
  baseDesc: "1 country, 1 seat",
  addCountry: "+$100/country",
  addSeat: "+$25/seat",
  cap: "$499/mo for all 22 countries",
};

export default function WatchProPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .wp-page { position: relative; z-index: 1; }
        .wp-hero {
          padding: 10rem 2rem 5rem;
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }
        .wp-hero h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.6rem, 6vw, 3.8rem);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .wp-hero h1 em { font-style: italic; color: var(--accent); }
        .wp-hero-sub {
          font-size: 1.2rem;
          line-height: 1.75;
          color: var(--text-secondary);
          max-width: 620px;
          margin: 0 auto;
        }
        .wp-hero-credibility {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          margin-top: 1.5rem;
          font-style: italic;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .wp-hero-cta-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .wp-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .wp-section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 0.75rem;
        }
        .wp-section h2 em { font-style: italic; color: var(--accent); }
        .wp-section-desc {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .wp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .wp-feature-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .wp-feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-orange);
        }
        .wp-feature-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .wp-feature-card h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .wp-feature-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        .wp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .wp-price-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2.5rem 1.75rem;
          position: relative;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .wp-price-card:hover {
          border-color: var(--accent);
          transform: translateY(-4px);
        }
        .wp-price-card {
          overflow: hidden;
        }
        .wp-price-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-orange);
        }
        .wp-price-card-featured {
          border-color: var(--accent);
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.08), rgba(20, 26, 40, 0.6));
        }
        .wp-price-card-featured::before {
          background: var(--accent);
        }
        .wp-price-card-featured::before {
          content: 'MOST POPULAR';
          position: absolute;
          top: -0.75rem; left: 50%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          background: var(--accent);
          color: var(--bg-primary);
          padding: 0.3rem 1rem;
          border-radius: 100px;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .wp-price-tier {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .wp-price-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .wp-price-amount {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.2rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        .wp-price-amount span {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 400;
        }
        .wp-price-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.55;
        }
        .wp-price-features {
          list-style: none;
          padding: 0;
          margin-bottom: 2rem;
          flex: 1;
        }
        .wp-price-features li {
          padding: 0.4rem 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .wp-price-features li::before {
          content: '\\2192';
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .wp-price-cta {
          width: 100%;
          padding: 0.85rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          display: block;
          background: var(--accent);
          color: var(--bg-primary);
          border: none;
        }
        .wp-price-cta:hover {
          background: #33e0f5;
          box-shadow: 0 0 24px var(--accent-glow);
        }

        .wp-upgrade-note {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .wp-upgrade-note a {
          color: var(--accent);
          text-decoration: none;
        }

        .wp-final-cta {
          text-align: center;
          padding: 5rem 2rem 6rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .wp-final-cta h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 1rem;
        }
        .wp-final-cta p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        /* ===== WATCH PRO TERMINAL MOCKUP ===== */
        .wp-terminal {
          background: #080b12;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        .wp-terminal-chrome {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 10px 16px;
          background: #060910;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .wp-terminal-dots { display: flex; gap: 6px; }
        .wp-dot { width: 10px; height: 10px; border-radius: 50%; }
        .wp-dot-red { background: #ff5f57; }
        .wp-dot-yellow { background: #febc2e; }
        .wp-dot-green { background: #28c840; }
        .wp-terminal-title {
          flex: 1; text-align: center;
          font-size: 0.7rem; color: rgba(255,255,255,0.5);
          font-family: 'JetBrains Mono', monospace;
        }
        .wp-terminal-live {
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; color: #28c840; letter-spacing: 0.05em;
        }
        .wp-live-dot {
          width: 6px; height: 6px; background: #28c840; border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(40, 200, 64, 0.5);
        }

        /* Sidebar + main layout */
        .wp-terminal-layout {
          display: grid;
          grid-template-columns: 48px 1fr;
        }
        .wp-sidebar {
          background: #060910;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0;
          gap: 4px;
        }
        .wp-sidebar-icon {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .wp-sidebar-icon:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.05); }
        .wp-sidebar-icon-active {
          color: var(--accent) !important;
          background: rgba(34, 211, 238, 0.1);
        }
        .wp-sidebar-divider {
          width: 24px; height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 4px 0;
        }
        .wp-main {
          display: flex;
          flex-direction: column;
        }

        /* Top bar */
        .wp-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px;
          background: rgba(10, 14, 22, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .wp-topbar-tabs { display: flex; }
        .wp-topbar-tab {
          padding: 10px 14px; font-size: 0.75rem;
          color: rgba(255,255,255,0.45); background: none; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500;
          border-bottom: 2px solid transparent; transition: all 0.2s;
        }
        .wp-topbar-tab:hover { color: rgba(255,255,255,0.8); }
        .wp-topbar-tab-active { color: var(--accent); border-bottom-color: var(--accent); }
        .wp-topbar-meta {
          display: flex; gap: 1.25rem;
          font-size: 0.65rem; color: rgba(255,255,255,0.4);
          font-family: 'JetBrains Mono', monospace;
        }

        /* Metrics */
        .wp-metrics-row {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 1px; background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .wp-metric-card { padding: 14px 16px; background: #080b12; }
        .wp-metric-label {
          font-size: 0.6rem; color: rgba(255,255,255,0.55);
          text-transform: uppercase; letter-spacing: 0.08em;
          font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;
        }
        .wp-metric-value {
          font-size: 1.6rem; font-weight: 600;
          font-family: 'JetBrains Mono', monospace; line-height: 1.2;
        }
        .wp-metric-danger { color: var(--danger); }
        .wp-metric-warning { color: var(--warning); }
        .wp-metric-info { color: var(--info); }
        .wp-metric-change {
          font-size: 0.6rem; margin-top: 4px;
          font-family: 'JetBrains Mono', monospace;
        }
        .wp-metric-change-up { color: var(--danger); }
        .wp-metric-change-neutral { color: rgba(255,255,255,0.4); }

        /* Terminal body */
        .wp-terminal-body {
          display: grid; grid-template-columns: 1.4fr 1fr;
          min-height: 420px;
        }

        /* Map panel */
        .wp-map-panel {
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex; flex-direction: column;
        }
        .wp-map-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .wp-map-title { font-size: 0.7rem; font-weight: 600; color: #fff; }
        .wp-map-filters {
          display: flex; gap: 6px;
        }
        .wp-map-filter-btn {
          font-size: 0.6rem; color: rgba(255,255,255,0.5);
          font-family: 'JetBrains Mono', monospace;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 8px; border-radius: 4px; cursor: pointer;
        }
        .wp-map-filter-btn-active {
          color: var(--accent); border-color: var(--accent);
          background: rgba(34, 211, 238, 0.08);
        }
        .wp-map-area {
          flex: 1; position: relative;
          background: #070a10;
          min-height: 380px; overflow: hidden;
        }
        .wp-map-svg {
          width: 100%; height: 100%;
          position: absolute; top: 0; left: 0;
        }
        .wp-country-monitored {
          fill: rgba(34, 211, 238, 0.08);
          stroke: rgba(34, 211, 238, 0.3);
          stroke-width: 0.8;
          transition: fill 0.2s;
        }
        .wp-country-monitored:hover {
          fill: rgba(34, 211, 238, 0.15);
        }
        .wp-country-unmonitored {
          fill: rgba(255, 255, 255, 0.02);
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 0.5;
        }
        .wp-country-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 5px;
          fill: rgba(255, 255, 255, 0.5);
          text-anchor: middle;
          pointer-events: none;
        }
        .wp-country-label-monitored {
          fill: rgba(34, 211, 238, 0.7);
          font-size: 5.5px;
        }

        /* Pings */
        .wp-ping {
          position: absolute; width: 10px; height: 10px;
          border-radius: 50%; cursor: pointer; z-index: 2;
        }
        .wp-ping::before {
          content: ''; position: absolute; inset: -4px;
          border-radius: 50%;
          animation: ping-ripple 2s ease-out infinite;
        }
        .wp-ping-critical {
          background: var(--danger);
          box-shadow: 0 0 14px rgba(255, 71, 87, 0.6);
        }
        .wp-ping-critical::before { border: 1.5px solid rgba(255, 71, 87, 0.4); }
        .wp-ping-advisory {
          background: var(--warning);
          box-shadow: 0 0 12px rgba(255, 179, 71, 0.5);
        }
        .wp-ping-advisory::before { border: 1.5px solid rgba(255, 179, 71, 0.3); }
        .wp-ping-info {
          background: var(--safe);
          box-shadow: 0 0 10px rgba(0, 212, 170, 0.4);
        }
        .wp-ping-info::before { border: 1.5px solid rgba(0, 212, 170, 0.3); }
        @keyframes ping-ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .wp-ping-tooltip {
          display: none; position: absolute;
          bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);
          background: rgba(6, 9, 16, 0.95);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 6px 10px; border-radius: 6px;
          font-size: 0.65rem; color: #fff;
          white-space: nowrap; font-family: 'DM Sans', sans-serif; z-index: 10;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .wp-ping:hover .wp-ping-tooltip { display: block; }

        /* Map legend */
        .wp-map-legend {
          position: absolute; bottom: 12px; left: 14px;
          display: flex; gap: 14px; z-index: 3;
          background: rgba(6, 9, 16, 0.8);
          padding: 6px 12px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .wp-legend-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.55rem; color: rgba(255,255,255,0.6);
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .wp-legend-dot { width: 6px; height: 6px; border-radius: 50%; }
        .wp-legend-critical { background: var(--danger); }
        .wp-legend-advisory { background: var(--warning); }
        .wp-legend-resolved { background: var(--safe); }
        .wp-legend-monitored {
          width: 12px; height: 8px; border-radius: 2px;
          background: rgba(34, 211, 238, 0.15);
          border: 1px solid rgba(34, 211, 238, 0.4);
        }

        /* Feed panel */
        .wp-feed-panel { display: flex; flex-direction: column; max-height: 480px; }
        .wp-feed-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .wp-feed-title { font-size: 0.7rem; font-weight: 600; color: #fff; }
        .wp-feed-count {
          font-size: 0.55rem; color: rgba(255,255,255,0.4);
          font-family: 'JetBrains Mono', monospace;
          background: rgba(255,255,255,0.04); padding: 2px 8px; border-radius: 10px;
        }
        .wp-feed-list { flex: 1; overflow-y: auto; }
        .wp-feed-item {
          display: grid; grid-template-columns: 36px auto 1fr;
          gap: 8px; padding: 10px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          align-items: start; transition: background 0.15s;
        }
        .wp-feed-item:hover { background: rgba(255, 255, 255, 0.02); }
        .wp-feed-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; color: rgba(255,255,255,0.45); margin-top: 2px;
        }
        .wp-feed-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; padding: 2px 6px; border-radius: 3px;
          font-weight: 700; letter-spacing: 0.05em;
          white-space: nowrap; text-align: center; margin-top: 1px;
        }
        .wp-tag-critical { background: rgba(255, 71, 87, 0.15); color: #ff4757; }
        .wp-tag-advisory { background: rgba(255, 179, 71, 0.15); color: #ffb347; }
        .wp-tag-resolved { background: rgba(0, 212, 170, 0.15); color: #00d4aa; }
        .wp-tag-monitor { background: rgba(77, 166, 255, 0.15); color: #4da6ff; }
        .wp-feed-text {
          font-size: 0.75rem; color: rgba(255,255,255,0.85); line-height: 1.5;
        }
        .wp-feed-country {
          font-size: 0.55rem; color: rgba(255,255,255,0.35);
          font-family: 'JetBrains Mono', monospace;
          margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em;
        }

        /* Price comparison strip */
        .wp-compare-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .wp-compare-card {
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .wp-compare-competitor {
          background: rgba(255, 71, 87, 0.06);
          border: 1px solid rgba(255, 71, 87, 0.25);
        }
        .wp-compare-competitor .wp-compare-price {
          text-decoration: line-through;
          text-decoration-color: #ff4757;
          text-decoration-thickness: 3px;
          color: #ffffff;
        }
        .wp-compare-centinela {
          background: linear-gradient(180deg, rgba(34, 211, 238, 0.1), rgba(20, 26, 40, 0.6));
          border: 2px solid rgba(0, 212, 170, 0.35);
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);
        }
        .wp-compare-centinela::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
        }
        .wp-compare-name {
          font-size: 1rem; font-weight: 600;
          color: #ffffff;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .wp-compare-centinela .wp-compare-name {
          color: var(--accent);
        }
        .wp-compare-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.4rem; font-weight: 700;
          margin-bottom: 0.75rem;
          color: #fff;
        }
        .wp-compare-price span {
          font-size: 0.9rem; font-weight: 400;
          color: rgba(255,255,255,0.5);
        }
        .wp-compare-centinela .wp-compare-price {
          color: var(--accent);
          text-decoration: none;
        }
        .wp-compare-note {
          font-size: 0.9rem; color: rgba(255,255,255,0.65);
          line-height: 1.6;
        }
        .wp-compare-savings {
          margin-top: 1.25rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; font-weight: 700;
          color: var(--safe);
          background: rgba(0, 212, 170, 0.12);
          padding: 6px 16px; border-radius: 100px;
          display: inline-block;
        }

        /* Intel examples — what competitors miss */
        .wp-intel-examples {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .wp-intel-card {
          background: rgba(20, 26, 40, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .wp-intel-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent-orange);
        }
        .wp-intel-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .wp-intel-badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; font-weight: 700;
          padding: 3px 10px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 1rem;
        }
        .wp-intel-badge-time {
          background: rgba(34, 211, 238, 0.12);
          color: var(--accent);
        }
        .wp-intel-badge-missed {
          background: rgba(255, 71, 87, 0.12);
          color: var(--danger);
        }
        .wp-intel-headline {
          font-size: 1.1rem; font-weight: 600;
          margin-bottom: 0.75rem; color: #fff;
        }
        .wp-intel-detail {
          font-size: 0.9rem; color: rgba(255,255,255,0.7);
          line-height: 1.65; margin-bottom: 1rem;
        }
        .wp-intel-source {
          font-size: 0.7rem; color: rgba(255,255,255,0.35);
          font-family: 'JetBrains Mono', monospace;
          font-style: italic;
        }

        /* Terminal micro-interactions */
        .wp-map-scanline {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent);
          animation: scanline 4s linear infinite;
          z-index: 1; pointer-events: none;
        }
        @keyframes scanline {
          0% { top: 0; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .wp-feed-item:nth-child(1) { animation: feed-in 0.4s ease-out 0.1s both; }
        .wp-feed-item:nth-child(2) { animation: feed-in 0.4s ease-out 0.25s both; }
        .wp-feed-item:nth-child(3) { animation: feed-in 0.4s ease-out 0.4s both; }
        .wp-feed-item:nth-child(4) { animation: feed-in 0.4s ease-out 0.55s both; }
        .wp-feed-item:nth-child(5) { animation: feed-in 0.4s ease-out 0.7s both; }
        .wp-feed-item:nth-child(6) { animation: feed-in 0.4s ease-out 0.85s both; }
        .wp-feed-item:nth-child(7) { animation: feed-in 0.4s ease-out 1.0s both; }
        .wp-feed-item:nth-child(8) { animation: feed-in 0.4s ease-out 1.15s both; }
        @keyframes feed-in {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .wp-feed-cursor {
          display: inline-block; width: 6px; height: 12px;
          background: var(--accent);
          margin-left: 4px; vertical-align: middle;
          animation: blink-cursor 1s step-end infinite;
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (max-width: 900px) {
          .wp-features-grid,
          .wp-pricing-grid,
          .wp-intel-examples { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
          .wp-compare-strip { grid-template-columns: repeat(2, 1fr); }
          .wp-sidebar { display: none; }
          .wp-terminal-layout { grid-template-columns: 1fr; }
          .wp-metrics-row { grid-template-columns: repeat(3, 1fr); }
          .wp-terminal-body { grid-template-columns: 1fr; }
          .wp-map-panel { border-right: none; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
          .wp-topbar-meta { display: none; }
          .wp-map-area { min-height: 280px; }
          .wp-feed-panel { max-height: 350px; }
        }
        @media (max-width: 600px) {
          .wp-hero { padding: 8rem 1.5rem 3rem; }
          .wp-section { padding: 3rem 1.5rem; }
          .wp-compare-strip { grid-template-columns: 1fr; max-width: 320px; margin-left: auto; margin-right: auto; }
          .wp-hero-cta-row { flex-direction: column; align-items: center; }
        }
      `,
        }}
      />

      <div className="wp-page">
        <section className="wp-hero">
          <div className="section-label">// Watch Pro</div>
          <h1>
            The $200K Intelligence Platform.<br /><em>For $199/mo.</em>
          </h1>
          <p className="wp-hero-sub">
            Dataminr charges $20,000/mo. Crisis24 quotes six figures annually.
            Watch Pro gives you the same live threat map, real-time incident feed,
            and flash alerts — built by operators who actually work in Latin America.
          </p>
          <div className="wp-hero-credibility">
            Built by a former US Marine &amp; State Dept High Threat Protection officer
            with 25+ years in security and 20+ years operating in LatAm.
          </div>
          <div className="wp-hero-cta-row">
            <a href="#pricing" className="btn-primary" style={{ padding: '0.85rem 2.5rem', display: 'inline-block', textDecoration: 'none' }}>
              Start at $199/mo
            </a>
            <a href="/subscribe" className="btn-outline" style={{ padding: '0.85rem 2.5rem', display: 'inline-block', textDecoration: 'none' }}>
              Try the Free Brief First
            </a>
          </div>
        </section>

        {/* ===== WATCH PRO TERMINAL MOCKUP ===== */}
        <section className="wp-section">
          <div className="section-label">// Live Preview</div>
          <h2>Your <em>Intelligence Terminal</em></h2>
          <p className="wp-section-desc">
            This is what Watch Pro looks like — a live operational dashboard built for security teams.
          </p>

          <div className="wp-terminal">
            {/* Window chrome */}
            <div className="wp-terminal-chrome">
              <div className="wp-terminal-dots">
                <span className="wp-dot wp-dot-red" />
                <span className="wp-dot wp-dot-yellow" />
                <span className="wp-dot wp-dot-green" />
              </div>
              <div className="wp-terminal-title">centinela.ai/watch — Intelligence Terminal</div>
              <div className="wp-terminal-live">
                <span className="wp-live-dot" />
                LIVE
              </div>
            </div>

            <div className="wp-terminal-layout">
              {/* Left sidebar — icon nav like Dataminr/Crisis24 */}
              <div className="wp-sidebar">
                <div className="wp-sidebar-icon wp-sidebar-icon-active" title="Overview">
                  {/* Grid/dashboard icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <div className="wp-sidebar-icon" title="Threat Map">
                  {/* Globe icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 8h13M8 1.5c-2 2-2.5 4-2.5 6.5s.5 4.5 2.5 6.5c2-2 2.5-4 2.5-6.5S10 3.5 8 1.5z" stroke="currentColor" strokeWidth="1.2"/></svg>
                </div>
                <div className="wp-sidebar-icon" title="Incidents">
                  {/* Alert icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="8" y1="6" x2="8" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>
                </div>
                <div className="wp-sidebar-icon" title="Travel Risk">
                  {/* Route icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="6" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/></svg>
                </div>
                <div className="wp-sidebar-divider" />
                <div className="wp-sidebar-icon" title="Reports">
                  {/* Doc icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1.2"/></svg>
                </div>
                <div className="wp-sidebar-icon" title="API">
                  {/* Code icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="5,4 1.5,8 5,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="11,4 14.5,8 11,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="wp-sidebar-icon" title="Settings">
                  {/* Gear icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
              </div>

              {/* Main area */}
              <div className="wp-main">
                {/* Top bar */}
                <div className="wp-topbar">
                  <div className="wp-topbar-tabs">
                    <button className="wp-topbar-tab wp-topbar-tab-active">Overview</button>
                    <button className="wp-topbar-tab">Incidents</button>
                    <button className="wp-topbar-tab">Travel Risk</button>
                    <button className="wp-topbar-tab">Reports</button>
                    <button className="wp-topbar-tab">API</button>
                  </div>
                  <div className="wp-topbar-meta">
                    <span>Last sync: 0547 CST</span>
                    <span>5 countries active</span>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="wp-metrics-row">
                  <div className="wp-metric-card">
                    <div className="wp-metric-label">Active Alerts</div>
                    <div className="wp-metric-value wp-metric-danger">7</div>
                    <div className="wp-metric-change wp-metric-change-up">&uarr; 3 from yesterday</div>
                  </div>
                  <div className="wp-metric-card">
                    <div className="wp-metric-label">Countries Monitored</div>
                    <div className="wp-metric-value wp-metric-info">5</div>
                    <div className="wp-metric-change wp-metric-change-neutral">MX CO EC GT HN</div>
                  </div>
                  <div className="wp-metric-card">
                    <div className="wp-metric-label">Incidents (7d)</div>
                    <div className="wp-metric-value wp-metric-warning">34</div>
                    <div className="wp-metric-change wp-metric-change-up">&uarr; 12% WoW</div>
                  </div>
                  <div className="wp-metric-card">
                    <div className="wp-metric-label">Regional Risk Score</div>
                    <div className="wp-metric-value wp-metric-danger">7.2</div>
                    <div className="wp-metric-change wp-metric-change-up">&uarr; 0.4 from last week</div>
                  </div>
                  <div className="wp-metric-card">
                    <div className="wp-metric-label">Flash Alerts (24h)</div>
                    <div className="wp-metric-value wp-metric-danger">2</div>
                    <div className="wp-metric-change wp-metric-change-up">Nayarit, Guayaquil</div>
                  </div>
                </div>

                {/* Main body: map + feed */}
                <div className="wp-terminal-body">
                  {/* Threat map with country borders */}
                  <div className="wp-map-panel">
                    <div className="wp-map-header">
                      <span className="wp-map-title">Threat Map</span>
                      <div className="wp-map-filters">
                        <span className="wp-map-filter-btn wp-map-filter-btn-active">All</span>
                        <span className="wp-map-filter-btn">Critical</span>
                        <span className="wp-map-filter-btn">Advisory</span>
                        <span className="wp-map-filter-btn">Resolved</span>
                      </div>
                    </div>
                    <div className="wp-map-area">
                      <div className="wp-map-scanline" />
                      <svg viewBox="0 0 500 700" className="wp-map-svg" xmlns="http://www.w3.org/2000/svg">
                        {/* Grid lines for that intel-platform look */}
                        <defs>
                          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="500" height="700" fill="url(#grid)"/>

                        {/* === MONITORED COUNTRIES (cyan highlight) === */}
                        {/* Mexico */}
                        <path className="wp-country-monitored" d="M38,58 L52,48 L68,42 L85,38 L105,35 L130,30 L155,28 L175,32 L192,40 L205,52 L218,48 L230,55 L238,50 L248,58 L255,55 L262,62 L258,75 L250,88 L245,100 L252,108 L262,105 L275,98 L282,108 L272,122 L260,135 L245,140 L228,138 L215,142 L200,148 L188,152 L175,148 L160,142 L145,135 L130,125 L115,112 L100,102 L85,95 L72,88 L58,78 L45,72 Z"/>
                        <text className="wp-country-label wp-country-label-monitored" x="170" y="95">MX</text>

                        {/* Guatemala */}
                        <path className="wp-country-monitored" d="M188,152 L200,148 L215,155 L218,168 L208,178 L195,175 L185,168 Z"/>
                        <text className="wp-country-label wp-country-label-monitored" x="200" y="166">GT</text>

                        {/* Honduras */}
                        <path className="wp-country-monitored" d="M215,155 L228,148 L245,152 L252,162 L242,175 L228,178 L218,172 L218,168 Z"/>
                        <text className="wp-country-label wp-country-label-monitored" x="235" y="166">HN</text>

                        {/* Colombia */}
                        <path className="wp-country-monitored" d="M210,225 L225,218 L245,222 L260,228 L272,238 L280,255 L285,275 L280,298 L268,315 L252,322 L235,315 L218,305 L205,312 L192,302 L185,280 L182,258 L188,242 Z"/>
                        <text className="wp-country-label wp-country-label-monitored" x="235" y="275">CO</text>

                        {/* Ecuador */}
                        <path className="wp-country-monitored" d="M182,312 L192,302 L205,312 L202,338 L188,345 L175,335 L172,322 Z"/>
                        <text className="wp-country-label wp-country-label-monitored" x="188" y="328">EC</text>

                        {/* === UNMONITORED COUNTRIES (dark) === */}
                        {/* Belize */}
                        <path className="wp-country-unmonitored" d="M228,138 L238,135 L240,148 L228,148 Z"/>

                        {/* El Salvador */}
                        <path className="wp-country-unmonitored" d="M195,175 L208,178 L208,188 L195,188 Z"/>
                        <text className="wp-country-label" x="202" y="184">SV</text>

                        {/* Nicaragua */}
                        <path className="wp-country-unmonitored" d="M218,172 L228,178 L242,175 L248,188 L240,202 L225,208 L215,198 L208,188 L208,178 L218,168 Z"/>
                        <text className="wp-country-label" x="228" y="192">NI</text>

                        {/* Costa Rica */}
                        <path className="wp-country-unmonitored" d="M215,198 L225,208 L228,220 L218,222 L210,215 Z"/>
                        <text className="wp-country-label" x="218" y="213">CR</text>

                        {/* Panama */}
                        <path className="wp-country-unmonitored" d="M218,222 L228,220 L245,222 L260,228 L252,238 L238,235 L225,232 L218,228 Z"/>
                        <text className="wp-country-label" x="238" y="230">PA</text>

                        {/* Venezuela */}
                        <path className="wp-country-unmonitored" d="M272,238 L290,225 L315,218 L338,222 L358,235 L362,258 L348,278 L330,288 L312,292 L298,285 L285,275 L280,255 Z"/>
                        <text className="wp-country-label" x="320" y="258">VE</text>

                        {/* Guyana */}
                        <path className="wp-country-unmonitored" d="M358,235 L372,228 L385,238 L382,258 L370,268 L358,262 L362,258 Z"/>

                        {/* Suriname */}
                        <path className="wp-country-unmonitored" d="M385,238 L398,235 L405,248 L400,262 L388,265 L382,258 Z"/>

                        {/* Peru */}
                        <path className="wp-country-unmonitored" d="M172,335 L188,345 L202,338 L215,348 L225,375 L220,408 L200,425 L178,418 L162,398 L155,372 L158,350 Z"/>
                        <text className="wp-country-label" x="190" y="382">PE</text>

                        {/* Brazil */}
                        <path className="wp-country-unmonitored" d="M252,322 L268,315 L285,310 L298,285 L312,292 L330,288 L348,278 L370,268 L388,265 L400,262 L405,280 L410,310 L405,350 L395,388 L378,425 L358,455 L338,472 L318,468 L298,458 L280,445 L268,425 L262,398 L258,368 L255,342 Z"/>
                        <text className="wp-country-label" x="335" y="365">BR</text>

                        {/* Bolivia */}
                        <path className="wp-country-unmonitored" d="M225,375 L242,368 L258,368 L262,398 L255,418 L240,425 L228,415 L222,395 Z"/>
                        <text className="wp-country-label" x="242" y="398">BO</text>

                        {/* Paraguay */}
                        <path className="wp-country-unmonitored" d="M268,425 L285,418 L298,428 L295,448 L280,452 L270,442 Z"/>
                        <text className="wp-country-label" x="282" y="438">PY</text>

                        {/* Uruguay */}
                        <path className="wp-country-unmonitored" d="M298,458 L312,452 L322,462 L318,478 L305,482 L298,472 Z"/>
                        <text className="wp-country-label" x="310" y="470">UY</text>

                        {/* Chile */}
                        <path className="wp-country-unmonitored" d="M155,372 L162,398 L168,418 L172,445 L175,475 L172,505 L165,535 L155,560 L148,580 L142,595 L135,585 L138,555 L142,525 L148,495 L150,465 L152,435 L152,405 Z"/>
                        <text className="wp-country-label" x="148" y="500">CL</text>

                        {/* Argentina */}
                        <path className="wp-country-unmonitored" d="M172,445 L178,418 L200,425 L228,415 L240,425 L255,418 L268,425 L280,452 L295,448 L298,458 L305,482 L300,510 L285,540 L268,565 L250,582 L232,592 L218,585 L205,568 L192,548 L178,525 L170,505 L172,475 Z"/>
                        <text className="wp-country-label" x="248" y="520">AR</text>

                        {/* Ocean labels */}
                        <text x="80" y="250" fill="rgba(255,255,255,0.08)" fontSize="12" fontFamily="JetBrains Mono, monospace" fontStyle="italic">Pacific</text>
                        <text x="380" y="150" fill="rgba(255,255,255,0.08)" fontSize="12" fontFamily="JetBrains Mono, monospace" fontStyle="italic">Atlantic</text>
                        <text x="310" y="195" fill="rgba(255,255,255,0.08)" fontSize="10" fontFamily="JetBrains Mono, monospace" fontStyle="italic">Caribbean</text>
                      </svg>

                      {/* Incident pings positioned over the map */}
                      <div className="wp-ping wp-ping-critical" style={{ top: '14%', left: '43%' }}>
                        <span className="wp-ping-tooltip">Nayarit, MX — Armed roadblock HWY 15D</span>
                      </div>
                      <div className="wp-ping wp-ping-critical" style={{ top: '47%', left: '39%' }}>
                        <span className="wp-ping-tooltip">Guayaquil, EC — Car bomb detonated</span>
                      </div>
                      <div className="wp-ping wp-ping-advisory" style={{ top: '24%', left: '42%' }}>
                        <span className="wp-ping-tooltip">Guatemala City — PNC checkpoints zones 9-10</span>
                      </div>
                      <div className="wp-ping wp-ping-advisory" style={{ top: '43%', left: '51%' }}>
                        <span className="wp-ping-tooltip">Buenaventura, CO — Port union 48hr stoppage</span>
                      </div>
                      <div className="wp-ping wp-ping-info" style={{ top: '38%', left: '48%' }}>
                        <span className="wp-ping-tooltip">Medell&iacute;n, CO — Protest resolved</span>
                      </div>
                      <div className="wp-ping wp-ping-info" style={{ top: '11%', left: '38%' }}>
                        <span className="wp-ping-tooltip">CDMX, MX — Security detail movement</span>
                      </div>

                      {/* Legend */}
                      <div className="wp-map-legend">
                        <span className="wp-legend-item"><span className="wp-legend-dot wp-legend-critical" /> Critical</span>
                        <span className="wp-legend-item"><span className="wp-legend-dot wp-legend-advisory" /> Advisory</span>
                        <span className="wp-legend-item"><span className="wp-legend-dot wp-legend-resolved" /> Resolved</span>
                        <span className="wp-legend-item"><span className="wp-legend-monitored" /> Monitored</span>
                      </div>
                    </div>
                  </div>

                  {/* Live intelligence feed */}
                  <div className="wp-feed-panel">
                    <div className="wp-feed-header">
                      <span className="wp-feed-title">Live Intelligence Feed<span className="wp-feed-cursor" /></span>
                      <span className="wp-feed-count">23 events</span>
                    </div>
                    <div className="wp-feed-list">
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0543</div>
                        <span className="wp-feed-tag wp-tag-critical">FLASH</span>
                        <div>
                          <div className="wp-feed-text">Armed roadblock confirmed on HWY 15D near Compostela. Two vehicles seized. Avoid corridor.</div>
                          <div className="wp-feed-country">Nayarit, Mexico</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0521</div>
                        <span className="wp-feed-tag wp-tag-advisory">ADVISORY</span>
                        <div>
                          <div className="wp-feed-text">Port union confirms 48hr work stoppage starting Wed. Pacific cargo ops affected.</div>
                          <div className="wp-feed-country">Buenaventura, Colombia</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0508</div>
                        <span className="wp-feed-tag wp-tag-advisory">ADVISORY</span>
                        <div>
                          <div className="wp-feed-text">Increased PNC checkpoint activity in zones 9-10. Expect delays for personnel movement.</div>
                          <div className="wp-feed-country">Guatemala City, Guatemala</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0445</div>
                        <span className="wp-feed-tag wp-tag-resolved">RESOLVED</span>
                        <div>
                          <div className="wp-feed-text">Protest activity near El Poblado subsided overnight. Normal operations resumed.</div>
                          <div className="wp-feed-country">Medell&iacute;n, Colombia</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0412</div>
                        <span className="wp-feed-tag wp-tag-monitor">MONITOR</span>
                        <div>
                          <div className="wp-feed-text">Presidential security detail movement observed near Los Pinos. Related to Wed summit prep.</div>
                          <div className="wp-feed-country">Mexico City, Mexico</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0338</div>
                        <span className="wp-feed-tag wp-tag-critical">FLASH</span>
                        <div>
                          <div className="wp-feed-text">Car bomb detonated near municipal building. No casualties. Area cordoned 3-block radius.</div>
                          <div className="wp-feed-country">Guayaquil, Ecuador</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0305</div>
                        <span className="wp-feed-tag wp-tag-monitor">MONITOR</span>
                        <div>
                          <div className="wp-feed-text">Social media chatter indicates planned protest in Tegucigalpa for Thursday. Scale TBD.</div>
                          <div className="wp-feed-country">Tegucigalpa, Honduras</div>
                        </div>
                      </div>
                      <div className="wp-feed-item">
                        <div className="wp-feed-time">0248</div>
                        <span className="wp-feed-tag wp-tag-advisory">ADVISORY</span>
                        <div>
                          <div className="wp-feed-text">CJNG presence reported near Colima port area. Maritime security advisory issued.</div>
                          <div className="wp-feed-country">Manzanillo, Mexico</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT COMPETITORS MISS ===== */}
        <section className="wp-section">
          <div className="section-label">// The Centinela Advantage</div>
          <h2>What <em>They Miss.</em> What We Catch.</h2>
          <p className="wp-section-desc">
            Most global platforms monitor English-language wire services. We monitor
            the Spanish-language sources where the real intelligence lives.
          </p>

          <div className="wp-intel-examples">
            <div className="wp-intel-card">
              <div className="wp-intel-badge wp-intel-badge-time">47 min faster</div>
              <div className="wp-intel-headline">Armed Roadblock, Nayarit HWY 15D</div>
              <p className="wp-intel-detail">
                Centinela flagged this from a local WhatsApp grupo and municipal police radio chatter at 0543 CST.
                English-language platforms picked it up 47 minutes later via Reuters stringer.
                By then, two client vehicles had already been rerouted.
              </p>
              <div className="wp-intel-source">Source: WhatsApp grupo, police radio, local Twitter</div>
            </div>
            <div className="wp-intel-card">
              <div className="wp-intel-badge wp-intel-badge-missed">Never reported</div>
              <div className="wp-intel-headline">CJNG Port Extortion Ring, Manzanillo</div>
              <p className="wp-intel-detail">
                Systematic extortion of port logistics companies was only visible in Spanish-language
                narco forums and local Colima news outlets. Global platforms never flagged it.
                Three clients with Pacific supply chain exposure were briefed within hours.
              </p>
              <div className="wp-intel-source">Source: Regional forums, Colima press, OSINT analysis</div>
            </div>
            <div className="wp-intel-card">
              <div className="wp-intel-badge wp-intel-badge-time">3 hrs faster</div>
              <div className="wp-intel-headline">Guayaquil Car Bomb, Municipal District</div>
              <p className="wp-intel-detail">
                Detected via Ecuadorian police scanner and local Twitter before any international
                wire service. Flash alert sent to all Ecuador-monitored clients at 0338 CST.
                First English-language coverage appeared at 0645 CST.
              </p>
              <div className="wp-intel-source">Source: Police scanner, local social media, municipal sources</div>
            </div>
          </div>
        </section>

        <section className="wp-section">
          <div className="section-label">// Platform Features</div>
          <h2>Beyond Email. <em>Live Intelligence.</em></h2>
          <p className="wp-section-desc">
            Watch Pro gives your team a real-time intelligence terminal — the same
            tools our analysts use, built for your security operations center.
          </p>
          <div className="wp-features-grid">
            {FEATURES.map((f) => (
              <div key={f.label} className="wp-feature-card">
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== WHAT YOU'D PAY ELSEWHERE ===== */}
        <section className="wp-section">
          <div className="section-label">// Price Comparison</div>
          <h2>What This <em>Actually Costs</em> Elsewhere</h2>
          <p className="wp-section-desc">
            Same capabilities. Same data. A fraction of the price.
          </p>
          <div className="wp-compare-strip">
            <div className="wp-compare-card wp-compare-competitor">
              <div className="wp-compare-name">Dataminr Pulse</div>
              <div className="wp-compare-price">$240K+<span>/yr</span></div>
              <div className="wp-compare-note">Enterprise contracts only. 12-month minimum.</div>
            </div>
            <div className="wp-compare-card wp-compare-competitor">
              <div className="wp-compare-name">Crisis24 Intel</div>
              <div className="wp-compare-price">$50–100K+<span>/yr</span></div>
              <div className="wp-compare-note">Custom quotes. Long sales cycles.</div>
            </div>
            <div className="wp-compare-card wp-compare-competitor">
              <div className="wp-compare-name">Seerist</div>
              <div className="wp-compare-price">$60K+<span>/yr</span></div>
              <div className="wp-compare-note">Annual commitment required.</div>
            </div>
            <div className="wp-compare-card wp-compare-centinela">
              <div className="wp-compare-name">Watch Pro</div>
              <div className="wp-compare-price">$2,388<span>/yr</span></div>
              <div className="wp-compare-note">No contract. Cancel anytime. Start today.</div>
              <div className="wp-compare-savings">Save $237K+ vs. Dataminr</div>
            </div>
          </div>
        </section>

        <section className="wp-section" id="pricing">
          <div className="section-label">// Watch Pro Pricing</div>
          <h2>Simple, <em>Scalable</em> Pricing</h2>
          <p className="wp-section-desc">
            One terminal. Add countries and seats as you grow. All 22 countries cap at $499/mo.
          </p>
          <div className="wp-pricing-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '100%' }}>
            <div className="wp-price-card wp-price-card-featured">
              <div className="wp-price-tier">Base</div>
              <div className="wp-price-name">Watch Pro</div>
              <div className="wp-price-amount">$199<span>/mo</span></div>
              <div className="wp-price-desc">Full intelligence terminal — 1 country, 1 seat</div>
              <CheckoutButton
                tier="watch-pro-starter"
                className="wp-price-cta"
                label="Get Watch Pro"
              />
            </div>
            <div className="wp-price-card">
              <div className="wp-price-tier">Add-on</div>
              <div className="wp-price-name">Countries</div>
              <div className="wp-price-amount">+$100<span>/country</span></div>
              <div className="wp-price-desc">Add additional countries from 22 monitored across LatAm</div>
            </div>
            <div className="wp-price-card">
              <div className="wp-price-tier">Add-on</div>
              <div className="wp-price-name">Team Seats</div>
              <div className="wp-price-amount">+$25<span>/seat</span></div>
              <div className="wp-price-desc">Add team members to your intelligence terminal</div>
            </div>
            <div className="wp-price-card">
              <div className="wp-price-tier">Cap</div>
              <div className="wp-price-name">All 22 Countries</div>
              <div className="wp-price-amount">$499<span>/mo</span></div>
              <div className="wp-price-desc">Full LatAm coverage — price never exceeds this regardless of countries</div>
            </div>
          </div>
          <p className="wp-upgrade-note">
            Need private AI infrastructure? <a href="/secure-ai">Secure AI &rarr;</a>
            {" "}&middot;{" "}
            Need 24/7 monitoring? <a href="/sentinel">Sentinel &rarr;</a>
          </p>
        </section>

        <section className="wp-final-cta">
          <h2>Stop Overpaying for Intelligence</h2>
          <p>
            Your competitors pay $200K+/year for what you can get at $199/mo.
            No contracts, no sales calls, no six-month onboarding. Start today.
          </p>
          <div className="wp-hero-cta-row">
            <a
              href="#pricing"
              className="btn-primary"
              style={{ padding: "0.85rem 2.5rem", display: "inline-block", textDecoration: "none" }}
            >
              Start at $199/mo
            </a>
            <a
              href="/subscribe"
              className="btn-outline"
              style={{ padding: "0.85rem 2.5rem", display: "inline-block", textDecoration: "none" }}
            >
              Try the Free Brief First
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
