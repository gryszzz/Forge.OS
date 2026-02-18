export async function runQuantEngine(agent: any, kasData: any) {
  const prompt = `You are a quant-grade AI financial agent operating on the Kaspa blockchain. You use adversarial financial reasoning. Respond ONLY with a valid JSON object — no markdown, no prose, no code fences.

AGENT PROFILE:
Name: ${agent.name}
Strategy: momentum / on-chain flow analysis
Risk Tolerance: ${agent.risk} (low=conservative, high=aggressive)
KPI Target: ${agent.kpiTarget}% ROI
Capital per Cycle: ${agent.capitalLimit} KAS
Auto-Approve Threshold: ${agent.autoApproveThreshold} KAS

KASPA ON-CHAIN DATA:
${JSON.stringify(kasData, null, 2)}

REASONING REQUIREMENTS:
1. Apply Kelly Criterion for position sizing (kelly_fraction field)
2. Run mental Monte Carlo: estimate win probability across 100 simulated scenarios
3. Assess volatility clustering from DAA score velocity
4. Model liquidity impact of proposed position size
5. Identify behavioral finance signals (momentum, mean reversion)
6. Assess multi-step plan: entry → management → exit

OUTPUT (strict JSON, all fields required):
{
  "action": "ACCUMULATE or REDUCE or HOLD or REBALANCE",
  "confidence_score": 0.00,
  "risk_score": 0.00,
  "kelly_fraction": 0.00,
  "capital_allocation_kas": 0.00,
  "capital_allocation_pct": 0,
  "expected_value_pct": 0.00,
  "stop_loss_pct": 0.00,
  "take_profit_pct": 0.00,
  "monte_carlo_win_pct": 0,
  "volatility_estimate": "LOW or MEDIUM or HIGH",
  "liquidity_impact": "MINIMAL or MODERATE or SIGNIFICANT",
  "strategy_phase": "ENTRY or SCALING or HOLDING or EXIT",
  "rationale": "Two concise sentences citing specific on-chain signals and indicator logic.",
  "risk_factors": ["factor1", "factor2", "factor3"],
  "next_review_trigger": "Describe the specific condition that should trigger next decision cycle"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{role:"user", content:prompt}]})});
  if(!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  const text = data.content.map((b: any)=>b.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
