"use client";

/**
 * Decorative animated backdrops for the dashboards and the admin portal.
 * Each variant is plain inline SVG so it costs nothing to load and stays
 * crisp at any size — deliberately quieter than the login-page videos, since
 * real content sits on top of these.
 */
import dynamic from "next/dynamic";

const AdminNetworkScene = dynamic(() => import("./AdminNetworkScene"));
import { PilotJobScene, ProviderFleetScene } from "./PortalScenes";
import AdminBrandScene from "./AdminBrandScene";

export type Scene =
  | "pilot-dashboard"
  | "provider-dashboard"
  | "admin-login"
  | "admin-dashboard";

const TINTS: Record<Scene, string> = {
  "pilot-dashboard": "from-emerald-50 via-sky-50 to-emerald-100",
  "provider-dashboard": "from-emerald-50 via-emerald-100 to-teal-50",
  "admin-login": "from-slate-900 via-slate-800 to-emerald-950",
  "admin-dashboard": "from-slate-50 via-emerald-50 to-slate-100",
};

export default function SceneBackground({ scene }: { scene: Scene }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className={`absolute inset-0 bg-gradient-to-br ${TINTS[scene]}`} />
      <div className={scene === "admin-login" ? "" : "opacity-90"}>
      {scene === "pilot-dashboard" && <PilotJobScene />}
      {scene === "provider-dashboard" && <ProviderFleetScene />}
      {scene === "admin-login" && <AdminNetworkScene dark />}
      {scene === "admin-dashboard" && <AdminBrandScene />}
      </div>
    </div>
  );
}
