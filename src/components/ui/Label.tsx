import { C, mono } from "../../tokens";

export const Label = ({children, color}: any) => (
  <div style={{fontSize:10, color:color || C.dim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6, ...mono}}>{children}</div>
);
