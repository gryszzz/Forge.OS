export const DEFS = {
  name:"", kpiTarget:"12", capitalLimit:"5000", risk:"medium", execMode:"manual",
  autoApproveThreshold:"50",
  kpiMetric:"ROI %", horizon:30, revenueSource:"momentum",
  dataSources:["KAS On-Chain","Kaspa DAG"], frequency:"1h",
};

export const RISK_OPTS = [
  {v:"low",l:"Low",desc:"Tight stops. Max 5% exposure per action."},
  {v:"medium",l:"Medium",desc:"Balanced Kelly sizing. 10% max exposure."},
  {v:"high",l:"High",desc:"Aggressive. 20% max. Wide targets."},
];

export const EXEC_OPTS = [
  {v:"autonomous",l:"Fully Autonomous",desc:"Auto-signs under threshold. Manual above."},
  {v:"manual",l:"Manual Approval",desc:"Every action requires wallet signature."},
  {v:"notify",l:"Notify Only",desc:"Decisions generated, no execution."},
];
