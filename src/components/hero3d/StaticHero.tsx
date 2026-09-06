// Lightweight fallback for low-end devices / slow networks — no WebGL, no
// heavy JS bundle. Pure CSS + inline SVG so it paints instantly.
export default function StaticHero() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-100 to-emerald-50 sm:h-80">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-700/20 to-transparent" />
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={0} y={70 + i * 6} width={200} height={2} fill="#15803d" opacity={0.4} />
        ))}
        <g transform="translate(100,45)">
          <rect x={-18} y={-6} width={36} height={12} rx={3} fill="#047857" />
          <circle cx={0} cy={-10} r={6} fill="#a3e635" />
          {[[-30, -20], [30, -20], [-30, 20], [30, 20]].map(([dx, dy], i) => (
            <g key={i}>
              <line x1={0} y1={0} x2={dx} y2={dy} stroke="#292524" strokeWidth={3} />
              <circle cx={dx} cy={dy} r={9} fill="none" stroke="#44403c" strokeWidth={2} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
