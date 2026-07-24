import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 animate-reveal">
        {eyebrow && (
          <span className="inline-block px-3 py-1 bg-arsn-green/10 text-arsn-green text-[10px] font-bold tracking-widest uppercase rounded mb-6">
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-serif leading-[1.05] text-balance max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
