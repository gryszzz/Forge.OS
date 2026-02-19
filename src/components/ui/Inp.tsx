import { C, mono } from "../../tokens";
import { Label } from "./Label";

export const Inp = ({label, value, onChange, placeholder, type = "text", hint, suffix}: any) => (
  <div style={{marginBottom:16}}>
    {label && <Label>{label}</Label>}
    <div style={{position:"relative"}}>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        style={{
          width:"100%",
          background:C.s3,
          border:`1px solid ${C.border}`,
          borderRadius:10,
          color:C.text,
          padding:`10px ${suffix?"40px":"12px"} 10px 12px`,
          fontSize:12,
          ...mono,
          outline:"none",
          boxSizing:"border-box",
          transition:"border-color 0.16s ease, box-shadow 0.16s ease",
        }}
        onFocus={(e)=>{e.target.style.borderColor=C.accent; e.target.style.boxShadow=`0 0 0 2px ${C.accent}22`;}}
        onBlur={(e)=>{e.target.style.borderColor=C.border; e.target.style.boxShadow="none";}}
      />
      {suffix && <span style={{position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:11, color:C.dim, ...mono}}>{suffix}</span>}
    </div>
    {hint && <div style={{fontSize:11, color:C.dim, marginTop:4}}>{hint}</div>}
  </div>
);
