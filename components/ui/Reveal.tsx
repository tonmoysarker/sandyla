"use client";

import { useInView } from "@/lib/use-in-view";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-testid="reveal"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
