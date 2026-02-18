import { C, mono } from "../../tokens";
import { shortAddr } from "../../helpers";
import { Inp, Label } from "../ui";
import { RISK_OPTS } from "./constants";

export const WStep1 = ({d, set, wallet}: any) => (
  <div>
    <div style={{fontSize:17, color:C.text, fontWeight:700, marginBottom:3, ...mono}}>Configure Agent</div>
    <div style={{fontSize:12, color:C.dim, marginBottom:20}}>Connected: <span style={{color:C.accent, ...mono}}>{shortAddr(wallet?.address)}</span></div>
    <Inp label="Agent Name" value={d.name} onChange={(v: string)=>set("name", v)} placeholder="KAS-Alpha-01"/>
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
      <Inp label="ROI Target" value={d.kpiTarget} onChange={(v: string)=>set("kpiTarget", v)} type="number" placeholder="12" suffix="%"/>
      <Inp label="Capital / Cycle" value={d.capitalLimit} onChange={(v: string)=>set("capitalLimit", v)} type="number" placeholder="5000" suffix="KAS"/>
    </div>
    <Label>Risk Tolerance</Label>
    <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8}}>
      {RISK_OPTS.map(r=>{const on = d.risk === r.v; return (
        <div key={r.v} onClick={()=>set("risk", r.v)} style={{padding:"12px 10px", borderRadius:4, cursor:"pointer", border:`1px solid ${on?C.accent:C.border}`, background:on?C.aLow:C.s2, textAlign:"center", transition:"all 0.15s"}}>
          <div style={{fontSize:13, color:on?C.accent:C.text, fontWeight:700, ...mono, marginBottom:3}}>{r.l}</div>
          <div style={{fontSize:11, color:C.dim}}>{r.desc}</div>
        </div>
      );})}
    </div>
  </div>
);
