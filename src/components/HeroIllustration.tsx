// Hand-built CSS/SVG animated scene — a drone patrolling side to side over a
// field, spraying as it goes, with spinning rotors and a shadow that tracks
// it on the ground. No external assets, no WebGL, no extra JS bundle; the
// whole thing degrades to a static frame under prefers-reduced-motion.
function Rotor({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={2} fill="#78716c" />
      <g className="animate-rotor" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <rect x={cx - 11} y={cy - 1.1} width={22} height={2.2} rx={1.1} fill="#57534e" />
        <rect x={cx - 1.1} y={cy - 11} width={2.2} height={22} rx={1.1} fill="#57534e" />
      </g>
      <circle cx={cx} cy={cy} r={11} fill="none" stroke="#a8a29e" strokeWidth={1} opacity={0.5} />
    </g>
  );
}

export default function HeroIllustration() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-emerald-50 to-white sm:h-80">
      {/* Sun glow */}
      <div className="absolute right-8 top-6 h-16 w-16 rounded-full bg-amber-200/70 blur-xl" />

      {/* Field */}
      <svg viewBox="0 0 200 120" className="absolute inset-x-0 bottom-0 h-1/2 w-full" preserveAspectRatio="none" aria-hidden="true">
        <rect x={0} y={0} width={200} height={120} fill="#bbf7d0" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={0} y={i * 13} width={200} height={6} fill="#15803d" opacity={0.3} />
        ))}
      </svg>

      {/* Ground shadow — tracks the drone's horizontal patrol */}
      <div className="animate-patrol absolute bottom-[38%] left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-emerald-950/20 blur-sm sm:bottom-[34%]" />

      {/* Drone patrol group (horizontal) -> bob group (vertical) -> drone art */}
      <div className="animate-patrol absolute left-1/2 top-[38%] -translate-x-1/2 sm:top-[34%]">
        <div className="animate-float">
          <svg viewBox="0 0 140 90" className="h-24 w-40 sm:h-28 sm:w-48 overflow-visible" aria-hidden="true">
            {/* Spray drops */}
            {[-24, -6, 12].map((dx, i) => (
              <circle
                key={dx}
                className="animate-drip"
                cx={70 + dx}
                cy={62}
                r={2.2}
                fill="#4ade80"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            ))}

            {/* Arms */}
            <line x1={70} y1={40} x2={30} y2={16} stroke="#292524" strokeWidth={3} />
            <line x1={70} y1={40} x2={110} y2={16} stroke="#292524" strokeWidth={3} />
            <line x1={70} y1={40} x2={30} y2={58} stroke="#292524" strokeWidth={3} />
            <line x1={70} y1={40} x2={110} y2={58} stroke="#292524" strokeWidth={3} />

            <Rotor cx={30} cy={16} />
            <Rotor cx={110} cy={16} />
            <Rotor cx={30} cy={58} />
            <Rotor cx={110} cy={58} />

            {/* Body */}
            <rect x={52} y={32} width={36} height={16} rx={4} fill="#047857" />
            <circle cx={70} cy={28} r={7} fill="#a3e635" />
            {/* Spray tank */}
            <rect x={60} y={48} width={20} height={16} rx={4} fill="#bef264" stroke="#65a30d" strokeWidth={1} />
          </svg>
        </div>
      </div>
    </div>
  );
}
