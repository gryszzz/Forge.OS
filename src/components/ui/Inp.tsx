import { C, mono } from "../../tokens";
import { Label } from "./Label";

export const Inp = ({label, value, onChange, placeholder, type = "text", hint, suffix}: any) => (
  <div style={{marginBottom:16}}>
    {label && <Label>{label}</Label>}
    <div style={{position:"relative"}}>
      <input value={value} onChange={(e)=>onChange(e.target.value)} type={type} placeholder={placeholder}
        style={{width:"100%", background:C.s2, border:`1px solid ${C.border}`, borderRadius:4, color:C.text, padding:`8px ${suffix?"36px":"10px"} 8px 10px`, fontSize:12, ...mono, outline:"none", boxSizing:"border-box"}}
        onFocus={(e)=>e.target.style.borderColor=C.accent} onBlur={(e)=>e.target.style.borderColor=C.border}/>
      {suffix && <span style={{position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:11, color:C.dim, ...mono}}>{suffix}</span>}
    </div>
    {hint && <div style={{fontSize:11, color:C.dim, marginTop:3}}>{hint}</div>}
  </div>
);
