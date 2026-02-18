import { C, mono } from "../../tokens";

export const Badge = ({text, color = C.accent, dot}: any) => (
  <span style={{background:color+"18", color, border:`1px solid ${color}35`, borderRadius:3, padding:"2px 8px", fontSize:11, letterSpacing:"0.04em", ...mono, display:"inline-flex", alignItems:"center", gap:5}}>
    {dot && <span style={{width:5, height:5, borderRadius:"50%", background:color, display:"inline-block"}}/>}{text}
  </span>
);
