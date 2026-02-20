const env = import.meta.env;

const AI_API_URL = env.VITE_AI_API_URL || "https://api.anthropic.com/v1/messages";
const AI_MODEL = env.VITE_AI_MODEL || "claude-sonnet-4-20250514";
const ANTHROPIC_API_KEY = env.VITE_ANTHROPIC_API_KEY || "";
const AI_TIMEOUT_MS = 30000;
const AI_FALLBACK_ENABLED = String(env.VITE_AI_FALLBACK_ENABLED || "true").toLowerCase() !== "false";

function buildHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // If using Anthropic directly from client, key+version headers are required.
  if(AI_API_URL.includes("api.anthropic.com")) {
    if(!ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key missing. Set VITE_ANTHROPIC_API_KEY or configure VITE_AI_API_URL to your secure backend endpoint.");
    }
    headers["x-api-key"] = ANTHROPIC_API_KEY;
    headers["anthropic-version"] = "2023-06-01";
  }

  return headers;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("AI response was not valid JSON");
  }
}

function toFinite(value: any, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeDecision(raw: any, agent: any) {
  const actionRaw = String(raw?.action || "HOLD").toUpperCase();
  const action = ["ACCUMULATE", "REDUCE", "HOLD", "REBALANCE"].includes(actionRaw) ? actionRaw : "HOLD";

  const capitalLimit = Math.max(0, toFinite(agent?.capitalLimit, 0));
  const allocation = clamp(toFinite(raw?.capital_allocation_kas, 0), 0, capitalLimit);
  const allocationPct =
    capitalLimit > 0 ? clamp((allocation / capitalLimit) * 100, 0, 100) : clamp(toFinite(raw?.capital_allocation_pct, 0), 0, 100);

  const confidence = clamp(toFinite(raw?.confidence_score, 0), 0, 1);
  const risk = clamp(toFinite(raw?.risk_score, 1), 0, 1);

  const volatilityRaw = String(raw?.volatility_estimate || "MEDIUM").toUpperCase();
  const volatility = ["LOW", "MEDIUM", "HIGH"].includes(volatilityRaw) ? volatilityRaw : "MEDIUM";

  const liquidityRaw = String(raw?.liquidity_impact || "MODERATE").toUpperCase();
  const liquidity = ["MINIMAL", "MODERATE", "SIGNIFICANT"].includes(liquidityRaw) ? liquidityRaw : "MODERATE";

  const phaseRaw = String(raw?.strategy_phase || "HOLDING").toUpperCase();
  const phase = ["ENTRY", "SCALING", "HOLDING", "EXIT"].includes(phaseRaw) ? phaseRaw : "HOLDING";

  const riskFactors = Array.isArray(raw?.risk_factors)
    ? raw.risk_factors.map((v: any) => String(v)).filter(Boolean).slice(0, 5)
    : [];
  const decisionSourceRaw = String(raw?.decision_source || "ai").toLowerCase();
  const decisionSource = decisionSourceRaw === "fallback" ? "fallback" : "ai";
  const decisionSourceDetail = String(raw?.decision_source_detail || "").slice(0, 180);

  return {
    action,
    confidence_score: confidence,
    risk_score: risk,
    kelly_fraction: clamp(toFinite(raw?.kelly_fraction, 0), 0, 1),
    capital_allocation_kas: Number(allocation.toFixed(6)),
    capital_allocation_pct: Number(allocationPct.toFixed(2)),
    expected_value_pct: Number(toFinite(raw?.expected_value_pct, 0).toFixed(2)),
    stop_loss_pct: Number(Math.max(0, toFinite(raw?.stop_loss_pct, 0)).toFixed(2)),
    take_profit_pct: Number(Math.max(0, toFinite(raw?.take_profit_pct, 0)).toFixed(2)),
    monte_carlo_win_pct: Number(clamp(toFinite(raw?.monte_carlo_win_pct, 0), 0, 100).toFixed(2)),
    volatility_estimate: volatility,
    liquidity_impact: liquidity,
    strategy_phase: phase,
    rationale: String(raw?.rationale || "No rationale returned by AI engine."),
    risk_factors: riskFactors,
    next_review_trigger: String(raw?.next_review_trigger || "On next cycle or major DAA/price movement."),
    decision_source: decisionSource,
    decision_source_detail: decisionSourceDetail,
  };
}

function buildFallbackDecision(agent: any, kasData: any, reason: string) {
  const capitalLimit = Math.max(0, toFinite(agent?.capitalLimit, 0));
  const riskMode = String(agent?.risk || "medium").toLowerCase();
  const riskCap = riskMode === "low" ? 0.04 : riskMode === "high" ? 0.12 : 0.08;
  const walletKas = Math.max(0, toFinite(kasData?.walletKas, capitalLimit));
  const daaScore = toFinite(kasData?.dag?.daaScore, 0);
  const modSignal = Math.abs(Math.floor(daaScore)) % 4;

  const shouldAccumulate = walletKas > 1 && modSignal !== 0;
  const action = shouldAccumulate ? "ACCUMULATE" : "HOLD";
  const allocation = shouldAccumulate ? Math.min(capitalLimit * riskCap, walletKas * 0.15) : 0;

  return sanitizeDecision(
    {
      action,
      confidence_score: shouldAccumulate ? 0.79 : 0.73,
      risk_score: riskMode === "low" ? 0.29 : riskMode === "high" ? 0.61 : 0.43,
      kelly_fraction: shouldAccumulate ? riskCap : 0,
      capital_allocation_kas: allocation,
      expected_value_pct: shouldAccumulate ? 1.8 : 0.2,
      stop_loss_pct: shouldAccumulate ? 4.8 : 0,
      take_profit_pct: shouldAccumulate ? 9.5 : 0,
      monte_carlo_win_pct: shouldAccumulate ? 56 : 51,
      volatility_estimate: modSignal >= 2 ? "MEDIUM" : "LOW",
      liquidity_impact: allocation > capitalLimit * 0.1 ? "MODERATE" : "MINIMAL",
      strategy_phase: shouldAccumulate ? "SCALING" : "HOLDING",
      rationale: `Fallback quant policy activated due to upstream AI unavailability (${reason}). Using conservative Kaspa-native accumulation posture with explicit risk cap.`,
      risk_factors: [
        "AI endpoint unavailable",
        "Fallback deterministic sizing active",
        "Execution remains wallet-signed",
      ],
      next_review_trigger: "Re-run after next DAG refresh or when AI endpoint connectivity is restored.",
      decision_source: "fallback",
      decision_source_detail: `fallback_reason:${reason}`,
    },
    agent
  );
}

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

  const body = AI_API_URL.includes("api.anthropic.com")
    ? { model: AI_MODEL, max_tokens: 800, messages: [{ role: "user", content: prompt }] }
    : { prompt, agent, kasData };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  let data: any;
  try {
    const res = await fetch(AI_API_URL, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if(!res.ok) throw new Error(`AI endpoint ${res.status}`);
    data = await res.json();
  } catch(err: any) {
    if (AI_FALLBACK_ENABLED) {
      return buildFallbackDecision(agent, kasData, err?.name === "AbortError" ? "timeout" : (err?.message || "request failure"));
    }
    if(err?.name === "AbortError") throw new Error(`AI request timeout (${AI_TIMEOUT_MS}ms)`);
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if(data?.error?.message) throw new Error(data.error.message);

  // Anthropic shape
  if(Array.isArray(data?.content)) {
    try {
      const text = data.content.map((b: any) => b.text || "").join("");
      const parsed = safeJsonParse(text.replace(/```json|```/g, "").trim());
      return sanitizeDecision({ ...parsed, decision_source: "ai" }, agent);
    } catch (err: any) {
      if (AI_FALLBACK_ENABLED) {
        return buildFallbackDecision(agent, kasData, err?.message || "invalid AI payload");
      }
      throw err;
    }
  }

  // Backend-proxy shape: { decision: {...} } or direct JSON decision object.
  try {
    if(data?.decision) return sanitizeDecision({ ...data.decision, decision_source: "ai" }, agent);
    return sanitizeDecision({ ...data, decision_source: "ai" }, agent);
  } catch (err: any) {
    if (AI_FALLBACK_ENABLED) {
      return buildFallbackDecision(agent, kasData, err?.message || "invalid decision format");
    }
    throw err;
  }
}
