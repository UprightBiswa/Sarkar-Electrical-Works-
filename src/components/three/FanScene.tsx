"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/** A stylised ceiling fan built from primitives — spins up, with "air flow" rings below. */
function CeilingFan() {
  const rotor = useRef<THREE.Group>(null);
  const speed = useRef(0);
  useFrame((state, dt) => {
    // ease the speed up, and react a little to the pointer
    const target = 9 + state.pointer.x * 4;
    speed.current = THREE.MathUtils.lerp(speed.current, target, 0.02);
    if (rotor.current) rotor.current.rotation.y += dt * speed.current;
  });

  const metal = { color: "#1a2540", metalness: 0.85, roughness: 0.25 };
  return (
    <group position={[0, 0.9, 0]}>
      {/* canopy + downrod */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.2, 48]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 16]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {/* motor housing */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.36, 64]} />
        <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.61, 0.025, 16, 96]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>
      <group ref={rotor} position={[0, 0.42, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <mesh position={[0.95, 0, 0]}>
              <boxGeometry args={[0.5, 0.06, 0.12]} />
              <meshStandardMaterial {...metal} />
            </mesh>
            <RoundedBox args={[2.1, 0.035, 0.46]} radius={0.015} position={[2.05, -0.02, 0]} rotation={[0.12, 0, 0]}>
              <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.35} />
            </RoundedBox>
          </group>
        ))}
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function AirFlow() {
  const rings = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const p = (t * 0.45 + i / rings.length) % 1;
      m.position.y = 0.9 - p * 2.6;
      m.scale.setScalar(1 + p * 1.6);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.45;
    });
  });
  return (
    <>
      {rings.map((i) => (
        <mesh key={i} ref={(el) => void (refs.current[i] = el)} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.012, 8, 128]} />
          <meshBasicMaterial color={i % 2 ? "#22d3ee" : "#fde047"} transparent opacity={0.4} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

export default function FanScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.4, 7.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <pointLight position={[-3, 0, 3]} intensity={30} color="#22d3ee" />
      <pointLight position={[3, -1, 2]} intensity={25} color="#facc15" />
      <hemisphereLight args={["#e2e8f0", "#0c1222", 1.2]} />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group rotation={[0.25, 0, 0]}>
          <CeilingFan />
        </group>
      </Float>
      <AirFlow />
      <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={10} blur={2.6} far={4} color="#000" />
    </Canvas>
  );
}
