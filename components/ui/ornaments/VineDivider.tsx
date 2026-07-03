export function VineDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      data-testid="vine-divider"
      aria-hidden="true"
      viewBox="0 0 320 32"
      className={`mx-auto my-flow-m h-8 w-72 text-accent ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
    >
      {/* rails tapering to the edges */}
      <path d="M8 16 H112" strokeOpacity={0.35} />
      <path d="M208 16 H312" strokeOpacity={0.35} />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" fillOpacity={0.5} />
      <circle cx="312" cy="16" r="1.2" fill="currentColor" stroke="none" fillOpacity={0.5} />

      {/* whiplash vine curls flanking the center */}
      <path d="M112 16 C124 16 128 6 138 8 C146 9.6 147 18 140 20 C135 21.4 132 17 135 14" />
      <path d="M208 16 C196 16 192 26 182 24 C174 22.4 173 14 180 12 C185 10.6 188 15 185 18" />
      <path d="M118 16 C126 22 136 24 146 21" strokeOpacity={0.55} />
      <path d="M202 16 C194 10 184 8 174 11" strokeOpacity={0.55} />

      {/* leaf buds */}
      <path d="M148 10 C151 6 156 5.4 159 8 C156.4 11 151.6 11.4 148 10 Z" fill="currentColor" fillOpacity={0.35} stroke="none" />
      <path d="M172 22 C169 26 164 26.6 161 24 C163.6 21 168.4 20.6 172 22 Z" fill="currentColor" fillOpacity={0.35} stroke="none" />

      {/* central diamond node with buds */}
      <path d="M160 9 L166 16 L160 23 L154 16 Z" fill="currentColor" fillOpacity={0.9} stroke="none" />
      <path d="M160 4.5 L162 7 L160 9.5 L158 7 Z" fill="currentColor" fillOpacity={0.45} stroke="none" />
      <path d="M160 22.5 L162 25 L160 27.5 L158 25 Z" fill="currentColor" fillOpacity={0.45} stroke="none" />
    </svg>
  );
}
