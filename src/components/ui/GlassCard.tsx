import type { PropsWithChildren } from "react";

interface GlassCardProps {
  className?: string;
}

export const GlassCard = ({ children, className = "" }: PropsWithChildren<GlassCardProps>) => (
  <section
    className={`rounded-2xl border border-white/70 bg-white/80 p-6 shadow-glass backdrop-blur-xl sm:p-8 ${className}`}
  >
    {children}
  </section>
);
