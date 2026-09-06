"use client";

/**
 * Admin dashboard backdrop: the RythuNova wordmark pops in at the centre with
 * a colour flowing through it, and three drones circle it at a distance. A
 * handful of elements, so it stays cheap to run behind a page full of real
 * content.
 */

/** Wordmark size. Everything else is sized in em against it. */
const FONT_SIZE = "clamp(2.8rem, 9.5vw, 7rem)";

/**
 * Orbit radius, in em of the wordmark. "RythuNova" is roughly 5.3em wide, so
 * anything under ~2.7em would fly straight through the letters — this keeps a
 * clear gap at every screen size, since the radius scales with the text.
 */
const ORBIT = "3.9em";
const ORBIT_SECONDS = 22;

const WORD = "RythuNova";

function Drone() {
  return (
    <svg viewBox="-46 -13 92 26" style={{ width: "0.72em", height: "auto" }} aria-hidden>
      <line x1="-38" y1="0" x2="38" y2="0" stroke="#047857" strokeWidth="4" />
      <rect x="-15" y="-9" width="30" height="14" rx="6" fill="#10b981" />
      <ellipse cx="-38" cy="0" rx="16" ry="4" fill="#10b981" />
      <ellipse cx="38" cy="0" rx="16" ry="4" fill="#10b981" />
    </svg>
  );
}

export default function AdminBrandScene() {
  // Three drones evenly spaced around the circle, achieved by starting each
  // one a third of the way through the same orbit.
  const drones = [0, 1, 2];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontSize: FONT_SIZE }}>
      {/* Wordmark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="brand-word select-none bg-clip-text text-transparent"
          style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {WORD}
        </span>
      </div>

      {/* Drones circling the wordmark, clear of the letters */}
      {drones.map((i) => (
        <div
          key={i}
          className="animate-orbit absolute left-1/2 top-1/2 h-0 w-0"
          style={{ animationDelay: `${(-ORBIT_SECONDS / drones.length) * i}s` }}
        >
          <div style={{ transform: `translate(-50%, calc(-50% - ${ORBIT}))` }}>
            <div
              className="animate-orbit-rev"
              style={{ animationDelay: `${(-ORBIT_SECONDS / drones.length) * i}s` }}
            >
              <Drone />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
