import { C } from "../tokens";

export const LOG_COL: Record<string, string> = {SYSTEM:C.dim,DATA:"#6BA3FF",AI:C.accent,VALID:C.warn,EXEC:C.ok,ERROR:C.danger,SIGN:C.purple,TREASURY:C.warn};

export const seedLog = (agentName: string) => {
  const n = Date.now();
  return [
    {ts:n-7200000,type:"SYSTEM",  msg:`Agent ${agentName} provisioned. Vault address mapped to session.`,fee:null},
    {ts:n-7140000,type:"SIGN",    msg:"Deploy transaction signed via Kasware. Vault funded.",fee:null},
    {ts:n-7100000,type:"TREASURY",msg:`Protocol fee: 0.20 KAS → Treasury 0.06 KAS / Pool 0.14 KAS`,fee:0.20},
    {ts:n-3600000,type:"DATA",    msg:"Kaspa DAG snapshot ingested. DAA score, hashrate, UTXO set analysed.",fee:null},
    {ts:n-3540000,type:"AI",      msg:"Quant engine invoked. Kelly criterion + Monte Carlo computed.",fee:0.12},
    {ts:n-3500000,type:"VALID",   msg:"Risk gate PASSED · Conf 0.82 · Kelly 0.08 · Phase: ENTRY",fee:null},
    {ts:n-3490000,type:"EXEC",    msg:"ACCUMULATE — 400 KAS · Auto-approved (below threshold)",fee:0.08},
    {ts:n-1800000,type:"AI",      msg:"Quant engine invoked.",fee:0.12},
    {ts:n-1780000,type:"VALID",   msg:"Conf 0.71 < 0.75 threshold — HOLD enforced.",fee:null},
    {ts:n-1770000,type:"EXEC",    msg:"HOLD — confidence gate. Position maintained.",fee:0.08},
  ];
};
