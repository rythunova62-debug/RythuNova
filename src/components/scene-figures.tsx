"use client";

/**
 * The cast shared by every portal scene: the four groups who use RythuNova,
 * plus the paddy they stand in. Drawn flat-vector to match the illustrated
 * login videos so all four portals read as one world.
 */

export const SKIN = "#f0c49b";
export const SKIN_DARK = "#d9a273";
export const HAIR = "#2f2a26";
export const SHOE = "#243b3a";

export type Palette = {
  /** dashed link lines and the hub outline */
  line: string;
  /** hub fill and glow */
  accent: string;
  /** ground band under the figures */
  ground: string;
  /** label text */
  label: string;
};

export const LIGHT: Palette = {
  line: "#047857",
  accent: "#10b981",
  ground: "#bbf7d0",
  label: "#065f46",
};

export const DARK: Palette = {
  line: "#34d399",
  accent: "#6ee7b7",
  ground: "#0f3d2e",
  label: "#a7f3d0",
};

/* ---------------------------------------------------------------- figures */

type FigureProps = {
  shirt: string;
  pants: string;
  skin?: string;
};

/** Shared body: legs, torso, head. Props are drawn by each role on top. */
export function Body({ shirt, pants, skin = SKIN }: FigureProps) {
  return (
    <g>
      {/* legs */}
      <rect x="-28" y="-74" width="24" height="74" rx="10" fill={pants} />
      <rect x="4" y="-74" width="24" height="74" rx="10" fill={pants} />
      <rect x="-32" y="-12" width="30" height="14" rx="6" fill={SHOE} />
      <rect x="2" y="-12" width="30" height="14" rx="6" fill={SHOE} />
      {/* torso */}
      <rect x="-38" y="-166" width="76" height="100" rx="26" fill={shirt} />
      {/* neck + head */}
      <rect x="-9" y="-186" width="18" height="24" rx="8" fill={SKIN_DARK} />
      <circle cx="0" cy="-208" r="31" fill={skin} />
      {/* face */}
      <circle cx="-11" cy="-211" r="3.2" fill={HAIR} />
      <circle cx="11" cy="-211" r="3.2" fill={HAIR} />
      <path d="M-9 -199 q9 8 18 0" stroke={HAIR} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Farmer — conical hat, booking a spray on the phone. */
export function Farmer() {
  return (
    <g>
      <Body shirt="#e05a68" pants="#1f3a5f" />
      {/* arm holding the phone */}
      <rect x="30" y="-158" width="20" height="62" rx="10" fill="#e05a68" transform="rotate(-24 30 -158)" />
      <rect x="44" y="-172" width="26" height="40" rx="6" fill="#1e293b" />
      <rect x="48" y="-167" width="18" height="28" rx="3" fill="#7dd3fc" />
      {/* conical hat */}
      <path d="M-52 -226 L0 -272 L52 -226 Z" fill="#e0b465" />
      <ellipse cx="0" cy="-226" rx="54" ry="9" fill="#c99a4e" />
      <path d="M-24 -212 a24 12 0 0 0 48 0" fill={HAIR} />
    </g>
  );
}

/** Drone pilot — cap and controller, matching the pilot login video. */
export function Pilot() {
  return (
    <g>
      <Body shirt="#e2e8f0" pants="#2f86d1" />
      {/* dungaree straps */}
      <rect x="-26" y="-166" width="12" height="54" rx="5" fill="#2f86d1" />
      <rect x="14" y="-166" width="12" height="54" rx="5" fill="#2f86d1" />
      {/* both arms up on the controller */}
      <rect x="-44" y="-154" width="20" height="52" rx="10" fill="#e2e8f0" transform="rotate(32 -44 -154)" />
      <rect x="24" y="-154" width="20" height="52" rx="10" fill="#e2e8f0" transform="rotate(-32 24 -154)" />
      <rect x="-32" y="-142" width="64" height="38" rx="8" fill="#1e3a5f" />
      <rect x="-24" y="-135" width="48" height="24" rx="4" fill="#60a5fa" />
      {/* bucket hat */}
      <path d="M-38 -228 h76 a14 14 0 0 1 -14 14 h-48 a14 14 0 0 1 -14 -14 Z" fill="#2f86d1" />
      <path d="M-34 -230 a34 26 0 0 1 68 0 Z" fill="#3d9be9" />
      <path d="M-31 -196 a31 18 0 0 0 62 0" fill={HAIR} />
    </g>
  );
}

/** Drone provider — clipboard in hand, a drone from the fleet overhead. */
export function Provider() {
  return (
    <g>
      {/* fleet drone hovering above */}
      <g className="animate-float" style={{ animationDelay: "-1.5s", transformBox: "fill-box", transformOrigin: "center" }}>
        <line x1="-34" y1="-274" x2="34" y2="-274" stroke="#1e3a5f" strokeWidth="5" />
        <rect x="-16" y="-286" width="32" height="18" rx="7" fill="#2563eb" />
        <ellipse cx="-34" cy="-274" rx="17" ry="4" fill="#16a34a" />
        <ellipse cx="34" cy="-274" rx="17" ry="4" fill="#16a34a" />
      </g>
      <Body shirt="#0f766e" pants="#334155" />
      <rect x="-54" y="-150" width="20" height="58" rx="10" fill="#0f766e" transform="rotate(30 -54 -150)" />
      {/* clipboard */}
      <rect x="-58" y="-132" width="42" height="52" rx="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="-51" y={-122 + i * 12} width="28" height="5" rx="2.5" fill="#94a3b8" />
      ))}
      <path d="M-32 -196 a32 20 0 0 0 64 0 v-10 a32 24 0 0 0 -64 0 Z" fill={HAIR} />
    </g>
  );
}

/** Admin — headset on, watching the whole platform from the control room. */
export function Admin() {
  return (
    <g>
      <Body shirt="#1e293b" pants="#0f172a" />
      <rect x="-54" y="-152" width="20" height="58" rx="10" fill="#1e293b" transform="rotate(26 -54 -152)" />
      <rect x="34" y="-152" width="20" height="58" rx="10" fill="#1e293b" transform="rotate(-26 34 -152)" />
      {/* hair + headset */}
      <path d="M-32 -204 a32 24 0 0 1 64 0 v-6 a32 26 0 0 0 -64 0 Z" fill={HAIR} />
      <path d="M-33 -214 a33 33 0 0 1 66 0" fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
      <rect x="-42" y="-216" width="14" height="24" rx="6" fill="#0f172a" />
      <rect x="28" y="-216" width="14" height="24" rx="6" fill="#0f172a" />
      <path d="M28 -196 q-12 6 -18 12" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ plants */

export function Sprig({ tone }: { tone: string }) {
  const blades = [
    { len: 70, bend: -46 },
    { len: 88, bend: -18 },
    { len: 88, bend: 18 },
    { len: 70, bend: 46 },
  ];
  return (
    <g>
      {blades.map(({ len, bend }, i) => {
        const side = bend < 0 ? -1 : 1;
        const w = 6;
        return (
          <path
            key={i}
            d={`M0 0 C ${bend * 0.15 - w * side} ${-len * 0.45} ${bend * 0.65 - w * 0.5 * side} ${-len * 0.85} ${bend} ${-len} C ${bend * 0.6 + w * side} ${-len * 0.8} ${w * side} ${-len * 0.4} 0 0 Z`}
            fill={tone}
          />
        );
      })}
    </g>
  );
}
