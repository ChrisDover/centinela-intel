import { useState } from "react";

const CostAnalysis = () => {
  const [clientCount, setClientCount] = useState({ essentials: 2, professional: 3, enterprise: 1 });
  const [useLocalModel, setUseLocalModel] = useState(false);

  const pricing = {
    essentials: 1500,
    professional: 3500,
    enterprise: 5000,
  };

  // Cost assumptions per client per month
  const apiCosts = {
    llmPerClient: 85, // GPT-4/Claude API calls for daily briefs, alerts, analysis
    osintSources: 45, // News APIs, social media monitoring, data feeds
    infrastructure: 30, // Hosting, databases, monitoring tools
    emailDelivery: 5, // Transactional email service
  };

  const localModelCosts = {
    llmPerClient: 15, // Electricity + amortized GPU cost per client
    osintSources: 45,
    infrastructure: 40, // Slightly higher for self-hosted infra
    emailDelivery: 5,
    gpuAmortized: 200, // Monthly amortized cost of GPU hardware (spread across clients)
  };

  const fixedCosts = {
    domainHosting: 50,
    dashboardHosting: 100,
    toolsAndSoftware: 150,
    insurance: 200,
    marketing: 300,
  };

  const totalClients = clientCount.essentials + clientCount.professional + clientCount.enterprise;
  const monthlyRevenue =
    clientCount.essentials * pricing.essentials +
    clientCount.professional * pricing.professional +
    clientCount.enterprise * pricing.enterprise;

  const costs = useLocalModel ? localModelCosts : apiCosts;
  const perClientCost = costs.llmPerClient + costs.osintSources + costs.infrastructure + costs.emailDelivery;
  const totalVariableCosts = perClientCost * totalClients + (useLocalModel ? localModelCosts.gpuAmortized : 0);
  const totalFixedCosts = Object.values(fixedCosts).reduce((a, b) => a + b, 0);
  const totalCosts = totalVariableCosts + totalFixedCosts;
  const netProfit = monthlyRevenue - totalCosts;
  const margin = monthlyRevenue > 0 ? ((netProfit / monthlyRevenue) * 100).toFixed(1) : 0;

  // Time cost estimate (hours per week)
  const timePerClient = {
    essentials: 1.5, // Review daily brief, minimal custom work
    professional: 3, // Review briefs, travel assessments, monthly call
    enterprise: 5, // Custom work, weekly calls, dedicated attention
  };

  const weeklyHours =
    clientCount.essentials * timePerClient.essentials +
    clientCount.professional * timePerClient.professional +
    clientCount.enterprise * timePerClient.enterprise;

  const CardStyle = {
    background: "#141a28",
    border: "1px solid #1e2a3f",
    borderRadius: "12px",
    padding: "24px",
  };

  const LabelStyle = {
    fontFamily: "'Courier New', monospace",
    fontSize: "11px",
    color: "#00d4aa",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "8px",
  };

  return (
    <div style={{ background: "#0a0e17", color: "#e8ecf4", minHeight: "100vh", padding: "32px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={LabelStyle}>// Financial Model</div>
          <h1 style={{ fontSize: "32px", fontWeight: 400, marginBottom: "8px", lineHeight: 1.2 }}>
            Centinela Intelligence — Cost & Revenue Analysis
          </h1>
          <p style={{ color: "#8a96ad", fontSize: "15px", lineHeight: 1.6 }}>
            Interactive model. Adjust client counts and infrastructure choices to see margins.
          </p>
        </div>

        {/* Client Count Controls */}
        <div style={CardStyle}>
          <div style={LabelStyle}>Client Mix</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginTop: "16px" }}>
            {Object.entries(pricing).map(([tier, price]) => (
              <div key={tier}>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px", textTransform: "capitalize" }}>{tier}</div>
                <div style={{ fontSize: "12px", color: "#5a6680", marginBottom: "12px" }}>${price.toLocaleString()}/mo each</div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={() => setClientCount(p => ({ ...p, [tier]: Math.max(0, p[tier] - 1) }))}
                    style={{ width: "32px", height: "32px", background: "#1e2a3f", border: "1px solid #2a3a55", borderRadius: "6px", color: "#e8ecf4", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <span style={{ fontFamily: "monospace", fontSize: "24px", fontWeight: 500, minWidth: "32px", textAlign: "center" }}>
                    {clientCount[tier]}
                  </span>
                  <button
                    onClick={() => setClientCount(p => ({ ...p, [tier]: p[tier] + 1 }))}
                    style={{ width: "32px", height: "32px", background: "#1e2a3f", border: "1px solid #2a3a55", borderRadius: "6px", color: "#e8ecf4", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Infrastructure toggle */}
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #1e2a3f", display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setUseLocalModel(!useLocalModel)}
              style={{
                width: "48px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                background: useLocalModel ? "#00d4aa" : "#2a3a55",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
                position: "absolute", top: "3px", transition: "left 0.2s",
                left: useLocalModel ? "27px" : "3px",
              }} />
            </button>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>Local GPU Model</div>
              <div style={{ fontSize: "12px", color: "#5a6680" }}>Use dedicated GPU infrastructure instead of cloud APIs</div>
            </div>
          </div>
        </div>

        {/* Revenue & Profit Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginTop: "24px" }}>
          {[
            { label: "Monthly Revenue", value: `$${monthlyRevenue.toLocaleString()}`, color: "#00d4aa" },
            { label: "Total Costs", value: `$${totalCosts.toLocaleString()}`, color: "#ff4757" },
            { label: "Net Profit", value: `$${netProfit.toLocaleString()}`, color: netProfit >= 0 ? "#00d4aa" : "#ff4757" },
            { label: "Margin", value: `${margin}%`, color: margin >= 70 ? "#00d4aa" : margin >= 50 ? "#ffb347" : "#ff4757" },
          ].map((item, i) => (
            <div key={i} style={CardStyle}>
              <div style={{ fontSize: "11px", color: "#5a6680", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{item.label}</div>
              <div style={{ fontFamily: "monospace", fontSize: "28px", fontWeight: 500, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* MRR Target */}
        <div style={{ ...CardStyle, marginTop: "24px" }}>
          <div style={LabelStyle}>Progress to $23K MRR Target</div>
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#8a96ad" }}>Current TrendLock MRR: $5,600</span>
              <span style={{ fontSize: "13px", color: "#8a96ad" }}>Target: $23,000</span>
            </div>
            <div style={{ width: "100%", height: "12px", background: "#1e2a3f", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "6px", transition: "width 0.5s",
                width: `${Math.min(100, ((5600 + monthlyRevenue) / 23000) * 100)}%`,
                background: (5600 + monthlyRevenue) >= 23000
                  ? "linear-gradient(90deg, #00d4aa, #00e8bb)"
                  : "linear-gradient(90deg, #ffb347, #ff9500)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#00d4aa" }}>
                ${(5600 + monthlyRevenue).toLocaleString()} combined MRR
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "14px", color: (5600 + monthlyRevenue) >= 23000 ? "#00d4aa" : "#ffb347" }}>
                {(5600 + monthlyRevenue) >= 23000 ? "✓ TARGET MET" : `$${(23000 - 5600 - monthlyRevenue).toLocaleString()} remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
          <div style={CardStyle}>
            <div style={LabelStyle}>Variable Costs (Per Client/Mo)</div>
            <div style={{ marginTop: "16px" }}>
              {[
                { label: useLocalModel ? "Local LLM Compute" : "LLM API (Claude/GPT-4)", value: costs.llmPerClient },
                { label: "OSINT Data Sources", value: costs.osintSources },
                { label: "Infrastructure / Hosting", value: costs.infrastructure },
                { label: "Email Delivery", value: costs.emailDelivery },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2a3f" }}>
                  <span style={{ fontSize: "13px", color: "#8a96ad" }}>{item.label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px" }}>${item.value}</span>
                </div>
              ))}
              {useLocalModel && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2a3f" }}>
                  <span style={{ fontSize: "13px", color: "#8a96ad" }}>GPU Amortization (fixed/mo)</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px" }}>${localModelCosts.gpuAmortized}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 600 }}>
                <span style={{ fontSize: "13px" }}>Per-client cost</span>
                <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#00d4aa" }}>${perClientCost}/mo</span>
              </div>
            </div>
          </div>

          <div style={CardStyle}>
            <div style={LabelStyle}>Fixed Costs (Monthly)</div>
            <div style={{ marginTop: "16px" }}>
              {Object.entries(fixedCosts).map(([key, value], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2a3f" }}>
                  <span style={{ fontSize: "13px", color: "#8a96ad" }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px" }}>${value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 600 }}>
                <span style={{ fontSize: "13px" }}>Total fixed</span>
                <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#00d4aa" }}>${totalFixedCosts}/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Investment */}
        <div style={CardStyle}>
          <div style={LabelStyle}>Your Time Investment</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginTop: "16px" }}>
            {[
              { label: "Essentials clients", hours: `${(clientCount.essentials * timePerClient.essentials).toFixed(1)} hrs/wk`, desc: "Brief review, light edits" },
              { label: "Professional clients", hours: `${(clientCount.professional * timePerClient.professional).toFixed(1)} hrs/wk`, desc: "Briefs + travel assessments + calls" },
              { label: "Enterprise clients", hours: `${(clientCount.enterprise * timePerClient.enterprise).toFixed(1)} hrs/wk`, desc: "Custom work + weekly calls" },
              { label: "Total weekly hours", hours: `${weeklyHours.toFixed(1)} hrs/wk`, desc: "Your operator time", highlight: true },
            ].map((item, i) => (
              <div key={i} style={{ padding: "16px", background: item.highlight ? "rgba(0,212,170,0.08)" : "#0f1420", borderRadius: "8px", border: item.highlight ? "1px solid rgba(0,212,170,0.2)" : "1px solid #1e2a3f" }}>
                <div style={{ fontSize: "12px", color: "#5a6680", marginBottom: "6px" }}>{item.label}</div>
                <div style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 500, color: item.highlight ? "#00d4aa" : "#e8ecf4" }}>{item.hours}</div>
                <div style={{ fontSize: "11px", color: "#5a6680", marginTop: "4px" }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "#0f1420", borderRadius: "8px", border: "1px solid #1e2a3f" }}>
            <span style={{ fontSize: "13px", color: "#8a96ad" }}>
              💡 The AI agent handles ~80% of the work — OSINT monitoring, brief drafting, alert triage, dashboard updates. 
              Your time is spent on editorial review, client relationships, and the "so what" analysis that only an operator can provide.
            </span>
          </div>
        </div>

        {/* API vs Local comparison */}
        <div style={{ ...CardStyle, marginTop: "24px" }}>
          <div style={LabelStyle}>Cloud API vs Local GPU — Cost Comparison</div>
          <div style={{ marginTop: "16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px", fontSize: "12px", color: "#5a6680", borderBottom: "1px solid #1e2a3f" }}></th>
                  <th style={{ textAlign: "right", padding: "10px", fontSize: "12px", color: "#5a6680", borderBottom: "1px solid #1e2a3f" }}>Cloud API</th>
                  <th style={{ textAlign: "right", padding: "10px", fontSize: "12px", color: "#5a6680", borderBottom: "1px solid #1e2a3f" }}>Local GPU</th>
                  <th style={{ textAlign: "right", padding: "10px", fontSize: "12px", color: "#5a6680", borderBottom: "1px solid #1e2a3f" }}>Advantage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: "LLM cost per client", api: "$85/mo", local: "$15/mo", winner: "local" },
                  { metric: "At 6 clients", api: "$510/mo", local: "$290/mo", winner: "local" },
                  { metric: "At 15 clients", api: "$1,275/mo", local: "$425/mo", winner: "local" },
                  { metric: "Upfront investment", api: "$0", local: "GPU hardware", winner: "api" },
                  { metric: "Security selling point", api: "Standard", local: "Premium — air-gapped", winner: "local" },
                  { metric: "Model quality", api: "Best available", local: "Good (Llama/Mistral)", winner: "api" },
                  { metric: "Setup complexity", api: "Low", local: "Medium-High", winner: "api" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px", fontSize: "13px", color: "#8a96ad", borderBottom: "1px solid #1e2a3f" }}>{row.metric}</td>
                    <td style={{ padding: "10px", fontSize: "13px", fontFamily: "monospace", textAlign: "right", borderBottom: "1px solid #1e2a3f", color: row.winner === "api" ? "#00d4aa" : "#e8ecf4" }}>{row.api}</td>
                    <td style={{ padding: "10px", fontSize: "13px", fontFamily: "monospace", textAlign: "right", borderBottom: "1px solid #1e2a3f", color: row.winner === "local" ? "#00d4aa" : "#e8ecf4" }}>{row.local}</td>
                    <td style={{ padding: "10px", fontSize: "12px", textAlign: "right", borderBottom: "1px solid #1e2a3f", color: row.winner === "local" ? "#00d4aa" : "#4da6ff" }}>
                      {row.winner === "local" ? "◆ Local" : "◆ Cloud"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(0,212,170,0.05)", borderRadius: "8px", border: "1px solid rgba(0,212,170,0.15)" }}>
              <span style={{ fontSize: "13px", color: "#8a96ad" }}>
                <strong style={{ color: "#00d4aa" }}>Recommendation:</strong> Start with cloud APIs (faster launch, no hardware dependency). 
                If GPUs are confirmed, migrate the Enterprise tier to local models first — it becomes a premium feature you can charge MORE for. 
                "Your intelligence never leaves your infrastructure" is worth $1,000+/mo to defense and family office clients.
              </span>
            </div>
          </div>
        </div>

        {/* Scenario modeling */}
        <div style={{ ...CardStyle, marginTop: "24px" }}>
          <div style={LabelStyle}>Scenario Modeling — Path to $23K MRR</div>
          <div style={{ marginTop: "16px" }}>
            {[
              { scenario: "Conservative (3 months)", mix: "2 Essentials + 2 Professional + 0 Enterprise", centinelaRev: 10000, total: 15600, gap: 7400 },
              { scenario: "Base Case (6 months)", mix: "2 Essentials + 3 Professional + 1 Enterprise", centinelaRev: 18500, total: 24100, gap: 0 },
              { scenario: "Aggressive (6 months)", mix: "3 Essentials + 4 Professional + 2 Enterprise", centinelaRev: 28500, total: 34100, gap: 0 },
            ].map((s, i) => (
              <div key={i} style={{ padding: "16px", background: "#0f1420", borderRadius: "8px", border: "1px solid #1e2a3f", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{s.scenario}</div>
                    <div style={{ fontSize: "12px", color: "#5a6680", marginTop: "4px" }}>{s.mix}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 500, color: s.total >= 23000 ? "#00d4aa" : "#ffb347" }}>
                      ${s.total.toLocaleString()}/mo
                    </div>
                    <div style={{ fontSize: "12px", color: s.gap === 0 ? "#00d4aa" : "#ffb347", fontFamily: "monospace" }}>
                      {s.gap === 0 ? "✓ TARGET MET" : `$${s.gap.toLocaleString()} short`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", fontSize: "13px", color: "#8a96ad", lineHeight: 1.6 }}>
            Combined with TrendLock at $5,600 MRR. Base case requires 6 Centinela clients — achievable within 6 months with your network and LinkedIn momentum.
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", padding: "20px 0", borderTop: "1px solid #1e2a3f", fontSize: "12px", color: "#5a6680", textAlign: "center" }}>
          Centinela Intelligence — Financial Model v1.0 — Confidential — Enfocado Capital LLC
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis;
