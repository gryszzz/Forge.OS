import { C } from "../../tokens";

export const Card = ({children, p = 16, style = {}}: any) => (
  <div
    style={{
      background:`linear-gradient(180deg, ${C.s2} 0%, ${C.s1} 100%)`,
      border:`1px solid ${C.border}`,
      borderRadius:12,
      padding:p,
      boxShadow:C.shadow,
      backdropFilter:"blur(6px)",
      ...style,
    }}
  >
    {children}
  </div>
);
