# Centinela Intel — Project Brief

## Overview
Centinela Intel is an AI-powered security risk intelligence service focused on Latin America and high-threat environments. It is a product/service of **Enfocado Capital LLC**.

**Domain**: centinelaintel.com (registered on GoDaddy)
**Brand**: Centinela Intel (not "Centinela Intelligence")
**Parent Entity**: Enfocado Capital LLC

---

## Brand & Design System

### Visual Identity
- **Aesthetic**: Dark, tech-forward (not tactical/PMC, not generic corporate)
- **Primary BG**: #0a0e17
- **Card BG**: #141a28
- **Accent**: #00d4aa (teal/green)
- **Danger**: #ff4757
- **Warning**: #ffb347
- **Info**: #4da6ff
- **Typography**:
  - Display: Instrument Serif
  - Body: DM Sans
  - Mono/Data: JetBrains Mono
- **Tone**: Quiet confidence, operator-built, not salesy

### Brand Hierarchy
```
Enfocado Capital LLC (parent)
├── Centinela Intel (security intelligence)
├── TrendLock (systematic trading)
└── Trading Thunderdome (education)
```

---

## Infrastructure Decisions

### Hosting
- GitHub repo → Deploy via Vercel or Cloudflare Pages (match TrendLock's stack)
- Static site for now — single HTML landing page, no build step required

### Email
- **Professional email**: Google Workspace → chris@centinelaintel.com, intel@centinelaintel.com
- **Newsletter/marketing**: Beehiiv (free tier to start)
  - Newsletter name: "The Centinela Brief"
  - Embed signup form on landing page
  - Custom subdomain: brief.centinelaintel.com or similar

### DNS
- Domain registered on GoDaddy
- MX records → Google Workspace
- CNAME → Vercel/Cloudflare (for site hosting)
- Consider also grabbing centinela.ai as redirect

---

## Assets Created

### 1. Landing Page (`centinela-landing.html`)
Full single-page website including:
- Navigation with brand
- Hero section with credibility stats (25+ years, 8+ years LatAm, 2000+ personnel, 24/7 AI monitoring)
- Threat context banner with regional stats
- Deliverables section (Daily Briefs, Travel Risk Assessments, Incident Alerts, Quarterly Reports)
- Sample intelligence brief mockup (fully designed inline)
- Dashboard mockup with live feed, threat map, metrics
- "Why Centinela" differentiators section
- Secure infrastructure / air-gapped selling point
- Pricing tiers (3 tiers — see below)
- Credibility / About section (Marine vet bio)
- Newsletter signup section (Beehiiv placeholder)
- CTA section
- Footer

### 2. Weekly Brief Issue #001 (`centinela-weekly-brief-001.html`)
Real intelligence brief using current Feb 2026 OSINT covering:
- Mexico: Sinaloa mine worker kidnapping, cartel transfers to U.S., Michoacán IED attacks, business confidence decline
- Ecuador: Guayaquil car bombing, state of emergency, 9,200+ homicides in 2025
- Ecuador-Colombia: 30% security tariff dispute, electricity suspension
- Analyst assessment with 3 key dynamics to watch
- Classified as "Open Source — For Distribution" (free tier)

### 3. Cost & Revenue Analysis (`centinela-cost-analysis.jsx`)
Interactive React component with:
- Adjustable client mix sliders
- Cloud API vs Local GPU toggle
- Revenue, costs, profit, margin calculations
- MRR progress bar toward $23K target
- Time investment estimates
- Scenario modeling (Conservative/Base/Aggressive)
- API vs Local GPU comparison table

---

## Service Tiers & Pricing

### Essentials — "Regional Watch" — $1,500/mo
- Daily intelligence briefs — 1 region
- Monthly threat landscape report
- Email-based incident alerts
- Dashboard access (read-only)
- Email analyst support

### Professional — "Operations Intelligence" — $3,500/mo (featured)
- Daily briefs — up to 3 countries
- 10 travel risk assessments / month
- Real-time incident alerts (push)
- Full dashboard with custom views
- Monthly analyst strategy call
- Quarterly threat landscape report

### Enterprise — "Dedicated Intelligence Cell" — $5,000+/mo
- Unlimited country coverage
- Unlimited travel risk assessments
- Dedicated analyst hours
- Air-gapped local AI processing (if GPU available)
- White-label option
- Custom reporting and integration
- Weekly strategy calls

---

## Revenue Model

### Target: $23,000 combined MRR
- TrendLock current: $5,600/mo
- Centinela Intel needed: ~$17,400/mo

### Base Case (6 months): 
- 2 Essentials + 3 Professional + 1 Enterprise = $18,500/mo Centinela
- Combined: $24,100/mo → **Target met**

### Cost Structure
- Per-client variable cost (Cloud API): ~$165/mo
- Per-client variable cost (Local GPU): ~$105/mo
- Fixed costs: ~$800/mo
- Margins: 85-90%

### Time Investment
- ~14-16 hours/week at 6 clients
- AI agent handles ~80% (OSINT monitoring, brief drafting, alert triage)
- Operator time: editorial review, client calls, "so what" analysis

---

## Go-To-Market Strategy

### Phase 1: Build Pipeline (Weeks 1-4)
1. **Free weekly LatAm brief** on LinkedIn + Beehiiv every Monday
2. **LinkedIn content cadence**: 3x/week (Monday brief, Wednesday insight, Friday scenario)
3. **Direct outreach**: 20 warm contacts from security network, share brief, ask for feedback

### Phase 2: Convert (Weeks 4-8)
1. **Complimentary threat briefing**: Free 30-min customized brief for prospects
2. **ASIS chapter events**: Network in person
3. **EP firm partnerships**: White-label intel arm for protection firms

### Phase 3: Scale (Months 3-6)
1. Content compounds — 12+ weeks of published briefs builds credibility
2. "Centinela was right" effect — flag threats, show when they materialize
3. Expand coverage beyond LatAm

### Target Clients
- Corporate security teams (companies with LatAm operations)
- Family offices / UHNW principals
- Executive protection firms needing intel support
- Defense contractors / government-adjacent

---

## Immediate Action Items

1. ✅ Register centinelaintel.com
2. [ ] Set up GitHub repo for centinelaintel.com
3. [ ] Deploy landing page via Vercel/Cloudflare Pages
4. [ ] Set up Google Workspace (MX records in GoDaddy)
5. [ ] Create Beehiiv account → "The Centinela Brief"
6. [ ] Embed Beehiiv signup form on landing page
7. [ ] Post Weekly Brief #001 on LinkedIn
8. [ ] Send brief to 10-15 security network contacts
9. [ ] Consider grabbing centinela.ai domain

---

## Key Differentiators to Emphasize
1. **Operator-built** — 25+ years, 8+ years in-country LatAm, managed 2,000+ personnel
2. **AI-accelerated, human-verified** — machine speed, operator judgment
3. **Hyper-secure option** — local GPU processing, air-gapped, no third-party API exposure
4. **Spanish-language OSINT** — monitoring sources most English-language services miss
5. **Right price point** — between expensive firms ($10K+/mo) and useless free sources

---

## Notes for Claude Code
- The landing page is a single self-contained HTML file — no framework, no build step
- All CSS is inline, all fonts loaded from Google Fonts CDN
- The Beehiiv signup form section has a placeholder — replace with actual embed code once account is created
- The weekly brief is also standalone HTML, designed to also work as email content
- Match the existing TrendLock deployment workflow for consistency
- The cost analysis is a React JSX component — can be used standalone or integrated later
