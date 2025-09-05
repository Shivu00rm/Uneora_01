import React from "react";
import type { PropsWithChildren } from "react";

interface SafeResponsiveContainerProps extends PropsWithChildren {
  height?: number | string;
  width?: number | string;
}

export function SafeResponsiveContainer({
  height = "100%",
  width = "100%",
  children,
}: SafeResponsiveContainerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} />;
  }

  const { ResponsiveContainer } = require("recharts");
  return (
    <ResponsiveContainer width={width as any} height={height as any}>
      {children as any}
    </ResponsiveContainer>
  );
}
export default SafeResponsiveContainer;
