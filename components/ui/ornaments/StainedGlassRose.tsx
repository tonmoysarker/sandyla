export function StainedGlassRose() {
  return (
    <svg
      data-testid="stained-glass-rose"
      role="img"
      aria-label="Ilustração de uma rosa em vitral dentro de um arco gótico"
      viewBox="0 0 300 400"
      className="h-full w-full"
    >
      <path
        d="M20 400 V150 A130 170 0 0 1 280 150 V400 Z"
        fill="#1c1b1b"
        stroke="#d4af37"
        strokeWidth={4}
      />
      <g stroke="#131313" strokeWidth={2}>
        <circle cx="150" cy="200" r="55" fill="#95d3ba" />
        <path d="M150 145 C120 160 120 200 150 200 C180 200 180 160 150 145 Z" fill="#0b513d" />
        <path d="M150 255 C120 240 120 200 150 200 C180 200 180 240 150 255 Z" fill="#0b513d" />
        <path d="M95 200 C110 170 150 170 150 200 C150 230 110 230 95 200 Z" fill="#f2ca50" />
        <path d="M205 200 C190 170 150 170 150 200 C150 230 190 230 205 200 Z" fill="#f2ca50" />
        <rect x="145" y="255" width="10" height="90" fill="#0b513d" />
        <path d="M150 300 L120 320" stroke="#0b513d" strokeWidth={4} fill="none" />
        <path d="M150 320 L180 340" stroke="#0b513d" strokeWidth={4} fill="none" />
      </g>
    </svg>
  );
}
