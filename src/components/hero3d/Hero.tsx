"use client";

import dynamic from "next/dynamic";
import { useCanRender3D } from "@/lib/use-can-render-3d";
import StaticHero from "./StaticHero";

// The 3D scene (three.js + fiber, a few hundred KB) is only ever fetched if
// useCanRender3D() says yes — dynamic+ssr:false keeps it out of the initial
// bundle entirely for everyone else, not just visually hidden.
const DroneScene = dynamic(() => import("./DroneScene"), { ssr: false, loading: () => null });

export default function Hero() {
  const canRender3D = useCanRender3D();

  if (!canRender3D) {
    return <StaticHero />;
  }

  return (
    <div className="h-64 w-full overflow-hidden rounded-2xl sm:h-80">
      <DroneScene />
    </div>
  );
}
