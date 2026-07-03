/**
 * Stained-glass rose window. Colors come from the theme tokens so the
 * glass shifts between Nocturne (stained-glass teal/brass) and Aged
 * Parchment (deep teal/bronze) palettes.
 */
export function StainedGlassRose() {
  const lead = "rgb(var(--surface))";
  const accent = "rgb(var(--accent))";
  const accentStrong = "rgb(var(--accent-strong))";
  const secondary = "rgb(var(--secondary))";
  const secondaryDeep = "rgb(var(--secondary-container))";
  const tertiary = "rgb(var(--tertiary))";

  return (
    <svg
      data-testid="stained-glass-rose"
      role="img"
      aria-label="Ilustração de uma rosa em vitral dentro de um arco gótico"
      viewBox="0 0 300 400"
      className="h-full w-full"
    >
      {/* arch background panes */}
      <path d="M0 400 V150 A150 190 0 0 1 300 150 V400 Z" fill="rgb(var(--surface-mid))" />
      <g stroke={lead} strokeWidth={3}>
        {/* radiating pane leads */}
        <path d="M150 10 V400" opacity={0.9} />
        <path d="M8 210 C60 150 240 150 292 210" fill="none" />
        <path d="M2 320 H298" />
        <path d="M150 200 L30 60" />
        <path d="M150 200 L270 60" />
        {/* corner glass tints */}
        <path d="M8 210 C60 150 148 152 150 200 L150 318 L4 318 Z" fill={secondaryDeep} fillOpacity={0.55} />
        <path d="M292 210 C240 150 152 152 150 200 L150 318 L296 318 Z" fill={tertiary} fillOpacity={0.28} />
        <path d="M2 320 H298 V400 H2 Z" fill={accentStrong} fillOpacity={0.16} />
        <path d="M150 12 A150 190 0 0 1 292 205 C240 148 160 148 150 198 Z" fill={secondary} fillOpacity={0.2} />
        <path d="M150 12 A150 190 0 0 0 8 205 C60 148 140 148 150 198 Z" fill={accent} fillOpacity={0.14} />
      </g>

      {/* rose */}
      <g stroke={lead} strokeWidth={2.5}>
        <circle cx="150" cy="200" r="58" fill={secondary} fillOpacity={0.85} />
        <path d="M150 142 C118 158 118 200 150 200 C182 200 182 158 150 142 Z" fill={secondaryDeep} />
        <path d="M150 258 C118 242 118 200 150 200 C182 200 182 242 150 258 Z" fill={secondaryDeep} />
        <path d="M92 200 C108 168 150 168 150 200 C150 232 108 232 92 200 Z" fill={accent} />
        <path d="M208 200 C192 168 150 168 150 200 C150 232 192 232 208 200 Z" fill={accent} />
        <circle cx="150" cy="200" r="14" fill={accentStrong} />
        {/* stem and leaves */}
        <path d="M146 256 h8 v92 h-8 Z" fill={secondaryDeep} />
        <path d="M150 296 C136 288 122 290 114 302 C126 310 142 308 150 296 Z" fill={secondaryDeep} />
        <path d="M150 320 C164 312 178 314 186 326 C174 334 158 332 150 320 Z" fill={secondaryDeep} />
      </g>

      {/* outer frame on top */}
      <path
        d="M6 400 V152 A144 184 0 0 1 294 152 V400"
        fill="none"
        stroke={accentStrong}
        strokeWidth={4}
      />
      <path
        d="M16 400 V156 A134 174 0 0 1 284 156 V400"
        fill="none"
        stroke={accentStrong}
        strokeWidth={1}
        opacity={0.5}
      />
    </svg>
  );
}
