"use client";

/**
 * A row of paddy plants along the bottom edge, drawn to match the crop row in
 * the provider login video so the pilot page reads as the same field.
 */

const GREEN = "#1f7a4d";
const GREEN_DARK = "#14603a";
const GOLD = "#e8b923";

type Leaf = {
  /** how far the blade reaches */
  len: number;
  /** how far the tip is pushed sideways (sign picks the side) */
  bend: number;
  /** half-width of the blade at its widest */
  width: number;
};

const LEAVES: Leaf[] = [
  { len: 145, bend: -118, width: 8 },
  { len: 185, bend: -72, width: 9 },
  { len: 215, bend: -26, width: 9 },
  { len: 215, bend: 26, width: 9 },
  { len: 185, bend: 72, width: 9 },
  { len: 145, bend: 118, width: 8 },
];

/** One plant: broad blades fanning out from the base, grain riding each blade. */
function Plant({ tone }: { tone: string }) {
  return (
    <g>
      <path d="M0 0 C -2 -60 2 -110 0 -160" stroke={tone} strokeWidth="6" fill="none" strokeLinecap="round" />
      {LEAVES.map(({ len, bend, width }, i) => {
        const side = bend < 0 ? -1 : 1;
        // Blade drawn out along one edge and back along the other, so it has
        // real thickness in the middle and tapers to a point at the tip.
        const d = [
          `M0 -6`,
          `C ${bend * 0.14 - width * side} ${-len * 0.45}`,
          `${bend * 0.64 - width * 0.55 * side} ${-len * 0.84}`,
          `${bend} ${-len}`,
          `C ${bend * 0.58 + width * 0.85 * side} ${-len * 0.8}`,
          `${bend * 0.1 + width * side} ${-len * 0.4}`,
          `0 -6`,
          "Z",
        ].join(" ");

        return (
          <g key={i}>
            <path d={d} fill={tone} />
            {/* Grain hanging off the upper half of the blade */}
            {[0.5, 0.65, 0.8, 0.93].map((t, j) => (
              <ellipse
                key={j}
                cx={bend * t * t + width * 0.9 * side}
                cy={-len * t}
                rx="6"
                ry="10.5"
                fill={GOLD}
                transform={`rotate(${bend * 0.2} ${bend * t * t} ${-len * t})`}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default function PaddyRow() {
  // Scales cycle rather than alternate so the row reads as a field with depth
  // instead of a repeating pair.
  const SCALES = [1, 0.78, 0.92, 0.84, 1.04, 0.88];

  const plants = Array.from({ length: 12 }, (_, i) => ({
    x: 20 + i * 116,
    s: SCALES[i % SCALES.length],
    tone: i % 2 === 0 ? GREEN : GREEN_DARK,
    delay: `${-(i % 5) * 0.85}s`,
  }));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34vh] min-h-[210px]" aria-hidden>
      <svg className="h-full w-full" viewBox="0 0 1280 250" preserveAspectRatio="xMidYMax slice">
        {plants.map((p) => (
          <g key={p.x} transform={`translate(${p.x} 258) scale(${p.s})`}>
            <g className="animate-sway" style={{ animationDelay: p.delay }}>
              <Plant tone={p.tone} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
