"use client";

/**
 * The admin scene: the four groups who use RythuNova — farmers, drone pilots,
 * drone providers and the admin team — standing in one field, each linked up
 * to the platform hub above them. This is the whole-platform view, which is
 * why only the admin portal gets it.
 */
import { Farmer, Pilot, Provider, Admin, Sprig, LIGHT, DARK } from "./scene-figures";

/* ------------------------------------------------------------------- scene */

export default function AdminNetworkScene({ dark = false }: { dark?: boolean }) {
  const p = dark ? DARK : LIGHT;

  // Everyone stands on the same ground line; the hub sits above the middle.
  const GROUND = 690;
  const HUB = { x: 600, y: dark ? 118 : 250 };

  const people = [
    { x: 150, label: "Farmers", node: Farmer, s: 0.92 },
    { x: 380, label: "Drone Pilots", node: Pilot, s: 1 },
    { x: 830, label: "Providers", node: Provider, s: 1 },
    { x: 1060, label: "Admin Team", node: Admin, s: 0.94 },
  ];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMax slice"
      opacity={dark ? 1 : 0.45}
    >
      {/* Ground band */}
      <ellipse cx="600" cy={GROUND + 90} rx="820" ry="150" fill={p.ground} opacity={dark ? 0.5 : 0.7} />

      {/* Links from the hub down to each group */}
      {people.map((person, i) => (
        <line
          key={person.label}
          x1={HUB.x}
          y1={HUB.y + 46}
          x2={person.x}
          y2={GROUND - 250 * person.s}
          stroke={p.line}
          strokeWidth="3"
          strokeDasharray="14 11"
          opacity={dark ? 0.75 : 0.45}
          className="animate-bg-dash"
          style={{ animationDelay: `${-i * 1.1}s` }}
        />
      ))}

      {/* The platform hub everyone is connected through */}
      <g>
        {[0, 1.6].map((d) => (
          <circle
            key={d}
            cx={HUB.x}
            cy={HUB.y}
            r="30"
            fill="none"
            stroke={p.accent}
            strokeWidth="2"
            className="animate-bg-ping"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
        <g className="animate-float" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect
            x={HUB.x - 84}
            y={HUB.y - 56}
            width="168"
            height="106"
            rx="18"
            fill={dark ? "#0b3b2c" : "#ffffff"}
            stroke={p.line}
            strokeWidth="3"
          />
          {/* a drone on the platform screen */}
          <line x1={HUB.x - 44} y1={HUB.y - 12} x2={HUB.x + 44} y2={HUB.y - 12} stroke={p.line} strokeWidth="5" />
          <rect x={HUB.x - 20} y={HUB.y - 26} width="40" height="22" rx="9" fill={p.accent} />
          <ellipse cx={HUB.x - 44} cy={HUB.y - 12} rx="20" ry="5" fill={p.accent} opacity="0.8" />
          <ellipse cx={HUB.x + 44} cy={HUB.y - 12} rx="20" ry="5" fill={p.accent} opacity="0.8" />
          <text
            x={HUB.x}
            y={HUB.y + 32}
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill={p.label}
            letterSpacing="0.5"
          >
            RythuNova
          </text>
        </g>
      </g>

      {/* Paddy between the figures */}
      {[70, 260, 500, 600, 700, 950, 1150].map((x, i) => (
        <g key={x} transform={`translate(${x} ${GROUND + 26}) scale(${i % 2 ? 0.85 : 1})`}>
          <g className="animate-sway" style={{ animationDelay: `${-i * 0.8}s` }}>
            <Sprig tone={dark ? "#14603a" : "#1f7a4d"} />
          </g>
        </g>
      ))}

      {/* The four groups */}
      {people.map(({ x, label, node: Node, s }, i) => (
        <g key={label} transform={`translate(${x} ${GROUND}) scale(${s})`}>
          <ellipse cx="0" cy="6" rx="52" ry="11" fill={p.line} opacity="0.14" />
          <g
            className="animate-float"
            style={{ animationDelay: `${-i * 1.3}s`, transformBox: "fill-box", transformOrigin: "center" }}
          >
            <Node />
          </g>
          <text
            x="0"
            y="52"
            textAnchor="middle"
            fontSize="19"
            fontWeight="600"
            fill={p.label}
            opacity={dark ? 0.95 : 0.75}
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}
