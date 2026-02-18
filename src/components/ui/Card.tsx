import { C } from "../../tokens";

export const Card = ({children, p = 16, style = {}}: any) => (
  <div style={{background:C.s1, border:`1px solid ${C.border}`, borderRadius:6, padding:p, ...style}}>{children}</div>
);
