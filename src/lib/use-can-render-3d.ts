"use client";

import { useEffect, useState } from "react";

// Progressive enhancement gate for the 3D hero: on rural/low-end Android over
// patchy networks, loading three.js (a few hundred KB) and running WebGL is
// exactly the wrong trade — so this defaults to false (static hero) and only
// flips to true once we've positively confirmed the device/network can take it.
export function useCanRender3D(): boolean {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanRender(checkCapability());
  }, []);

  return canRender;
}

function checkCapability(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;

  // navigator.connection is Chrome/Android-only; absence just means "unknown", not "fast".
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && ["slow-2g", "2g", "3g"].includes(nav.connection.effectiveType)) {
    return false;
  }

  // deviceMemory is in GB, Chrome/Android-only.
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;

  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 4) {
    return false;
  }

  // No WebGL support at all — definitely can't render.
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
  } catch {
    return false;
  }

  return true;
}
