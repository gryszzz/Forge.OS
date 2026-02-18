import { C, mono } from "../../tokens";

export const Btn = ({children, onClick, variant = "primary", disabled, style = {}, size = "md"}: any) => {
  const s = {
    primary:{bg:C.accent,color:"#000",border:"none"},
    ghost:{bg:"transparent",color:C.text,border:`1px solid ${C.border}`},
    danger:{bg:C.dLow,color:C.danger,border:`1px solid ${C.danger}40`},
    warn:{bg:C.wLow,color:C.warn,border:`1px solid ${C.warn}40`},
  }[variant];

  return (
    <button onClick={onClick} disabled={disabled} style={{...s, background:s.bg, color:s.color, border:s.border, borderRadius:4, padding:size==="sm"?"5px 12px":"9px 20px", fontSize:size==="sm"?11:12, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.4:1, fontWeight:700, letterSpacing:"0.06em", ...mono, ...style}}>{children}</button>
  );
};
