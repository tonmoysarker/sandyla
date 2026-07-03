export function ArchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden border border-accent-strong [border-radius:50%_50%_0_0/100%_100%_0_0]"
      style={{ aspectRatio: "3 / 4" }}
    >
      {children}
    </div>
  );
}
