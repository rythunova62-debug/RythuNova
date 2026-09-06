"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

function Rotor({ position }: { position: [number, number, number] }) {
  const bladeRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (bladeRef.current) bladeRef.current.rotation.y += delta * 18;
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      <mesh ref={bladeRef} position={[0, 0.08, 0]}>
        <boxGeometry args={[0.9, 0.02, 0.06]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>
    </group>
  );
}

function Drone() {
  const groupRef = useRef<Group>(null);
  const armLength = 0.85;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = 1.4 + Math.sin(t * 1.2) * 0.12;
    groupRef.current.rotation.y = t * 0.35;
  });

  const armAngles = [45, 135, 225, 315];

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.5, 0.18, 0.5]} />
        <meshStandardMaterial color="#047857" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#065f46" />
      </mesh>

      {/* Arms + rotors */}
      {armAngles.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * armLength;
        const z = Math.sin(rad) * armLength;
        return (
          <group key={deg}>
            <mesh position={[x / 2, 0, z / 2]} rotation={[0, -rad, 0]}>
              <boxGeometry args={[armLength, 0.05, 0.05]} />
              <meshStandardMaterial color="#292524" />
            </mesh>
            <Rotor position={[x, 0.05, z]} />
          </group>
        );
      })}

      {/* Spray tank */}
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.2, 12]} />
        <meshStandardMaterial color="#a3e635" />
      </mesh>
    </group>
  );
}

function Field() {
  const rows = Array.from({ length: 14 }, (_, i) => i);
  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      {rows.map((i) => (
        <mesh key={i} position={[0, 0.01, -9 + i * 1.4]}>
          <planeGeometry args={[20, 0.5]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      ))}
    </group>
  );
}

export default function DroneScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3, 2.2, 3.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
    >
      <color attach="background" args={["#ecfdf5"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      <Drone />
      <Field />
    </Canvas>
  );
}
