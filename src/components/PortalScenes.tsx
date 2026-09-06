"use client";

/**
 * Dashboard backdrops. These sit under real content, so each one is a light
 * motif rather than a full illustration: a handful of shapes, one idea, no
 * figures. The detailed illustrated scene stays on the admin login page.
 *
 * Each portal gets a different motif drawn from its own domain — a spray run
 * for pilots, a fleet for providers, the platform network for admins — so no
 * two dashboards look alike.
 */

const LINE = "#047857";
const ACCENT = "#10b981";

/** Small drone glyph, ~6 nodes. */
function Drone({ w = 46, fill = ACCENT }: { w?: number; fill?: string }) {
  return (
    <g>
      <line x1={-w} y1="0" x2={w} y2="0" stroke={LINE} strokeWidth="4" />
      <rect x={-w * 0.4} y="-11" width={w * 0.8} height="17" rx="7" fill={fill} />
      <ellipse cx={-w} cy="0" rx={w * 0.42} ry="4.5" fill={fill} />
      <ellipse cx={w} cy="0" rx={w * 0.42} ry="4.5" fill={fill} />
    </g>
  );
}

/** Pilot dashboard — one drone flying a spray run over field rows. */
export function PilotJobScene() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      {/* Field rows */}
      {[430, 510, 590, 670].map((y, i) => (
        <line
          key={y}
          x1="-40"
          y1={y}
          x2="1240"
          y2={y}
          stroke={LINE}
          strokeWidth="3"
          strokeDasharray="22 16"
          opacity={0.1 + i * 0.05}
          className="animate-bg-dash"
          style={{ animationDelay: `${-i * 1.4}s` }}
        />
      ))}

      {/* The run itself */}
      <g className="animate-bg-cruise" opacity="0.5">
        <g transform="translate(600 250)">
          <Drone />
          <path d="M-18 8 L-32 78 L32 78 L18 8 Z" fill={ACCENT} opacity="0.18" />
        </g>
      </g>
    </svg>
  );
}

/** Provider dashboard — a fleet holding formation over the depot. */
export function ProviderFleetScene() {
  const fleet = [
    { x: 300, y: 250, s: 1.15, d: "0s" },
    { x: 640, y: 180, s: 1.45, d: "-4s" },
    { x: 950, y: 275, s: 1, d: "-8s" },
  ];

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      {/* Depot apron */}
      <g opacity="0.16" stroke={LINE} strokeWidth="2.5" fill="none">
        {[0, 1, 2, 3].map((i) => (
          <line key={`v${i}`} x1={220 + i * 260} y1="500" x2={80 + i * 360} y2="840" />
        ))}
        {[0, 1, 2].map((i) => (
          <line key={`h${i}`} x1="-40" y1={540 + i * 100} x2="1240" y2={540 + i * 100} />
        ))}
      </g>

      <g className="animate-bg-drift" opacity="0.5">
        {fleet.map((f) => (
          <g key={f.x} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
            <g
              className="animate-float"
              style={{ animationDelay: f.d, transformBox: "fill-box", transformOrigin: "center" }}
            >
              <Drone />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
