// The actual drone-farming animation the user picked (downloaded from
// LottieFiles as an MP4, since the site blocks scripted access to its JSON
// export). Served from /public, muted+looped+inline so it autoplays without
// a play button, and paused for anyone with prefers-reduced-motion set.
"use client";

import { useEffect, useRef } from "react";

export default function HeroIllustration() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) videoRef.current?.pause();
  }, []);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-emerald-50 sm:h-80">
      <video
        ref={videoRef}
        src="/hero-drone.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
