import { C, mono } from "../../tokens";

export const ExtLink = ({href, label = "↗"}: any) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    style={{fontSize:11, color:C.accent, ...mono, textDecoration:"none", border:`1px solid ${C.accent}25`, padding:"3px 9px", borderRadius:3}}>{label}</a>
);
