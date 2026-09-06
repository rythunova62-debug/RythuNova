// CSS-animated hero illustration — floating + glowing drone over a field.
// Pure inline SVG + CSS keyframes (see globals.css): no WebGL, no extra JS
// bundle, no external assets, and it degrades to a static image automatically
// under prefers-reduced-motion.
export default function HeroIllustration() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-100 via-emerald-50 to-white sm:h-80">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-700/15 to-transparent" />

      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={0} y={72 + i * 6} width={200} height={2} fill="#15803d" opacity={0.35} />
        ))}
      </svg>

      <div className="animate-float animate-glow-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 120 80" className="h-24 w-36 sm:h-28 sm:w-44" aria-hidden="true">
          <g transform="translate(60,36)">
            <rect x={-18} y={-6} width={36} height={12} rx={3} fill="#047857" />
            <circle cx={0} cy={-10} r={6} fill="#a3e635" />
            {[
              [-30, -20],
              [30, -20],
              [-30, 20],
              [30, 20],
            ].map(([dx, dy], i) => (
              <g key={i}>
                <line x1={0} y1={0} x2={dx} y2={dy} stroke="#292524" strokeWidth={3} />
                <circle cx={dx} cy={dy} r={9} fill="none" stroke="#44403c" strokeWidth={2} />
                <circle cx={dx} cy={dy} r={2} fill="#78716c" />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
