"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function EnergyCore() {
  const shell = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (shell.current) {
      shell.current.rotation.y += dt * 0.25;
      shell.current.rotation.x += dt * 0.1;
    }
    if (ring1.current) ring1.current.rotation.z += dt * 0.6;
    if (ring2.current) ring2.current.rotation.z -= dt * 0.4;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh>
        <icosahedronGeometry args={[1.05, 20]} />
        <MeshDistortMaterial
          color="#facc15"
          emissive="#f59e0b"
          emissiveIntensity={0.9}
          roughness={0.25}
          metalness={0.3}
          distort={0.38}
          speed={2.2}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.1, 0.012, 16, 160]} />
        <meshBasicMaterial color="#fde047" transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.7, -0.4, 0.2]}>
        <torusGeometry args={[2.45, 0.008, 16, 160]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}

/** Jagged lightning arcs that regenerate every few frames. */
function Arcs({ count = 5 }: { count?: number }) {
  const SEG = 14;
  const lines = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SEG * 3), 3));
        const mat = new THREE.LineBasicMaterial({
          color: i % 2 ? "#67e8f9" : "#fde68a",
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });
        return new THREE.Line(geo, mat);
      }),
    [count],
  );
  const timer = useRef(0);

  useFrame((_, dt) => {
    timer.current += dt;
    lines.forEach((line) => {
      const m = line.material as THREE.LineBasicMaterial;
      m.opacity = Math.max(0, m.opacity - dt * 3.5);
    });
    if (timer.current < 0.09) return;
    timer.current = 0;
    const line = lines[Math.floor(Math.random() * lines.length)];
    const pos = line.geometry.getAttribute("position") as THREE.BufferAttribute;
    const dir = new THREE.Vector3().randomDirection();
    const start = dir.clone().multiplyScalar(1.1);
    const end = dir
      .clone()
      .add(new THREE.Vector3().randomDirection().multiplyScalar(0.6))
      .normalize()
      .multiplyScalar(2.4 + Math.random() * 0.8);
    for (let s = 0; s < SEG; s++) {
      const t = s / (SEG - 1);
      const p = start.clone().lerp(end, t);
      if (s > 0 && s < SEG - 1) p.add(new THREE.Vector3().randomDirection().multiplyScalar(0.18));
      pos.setXYZ(s, p.x, p.y, p.z);
    }
    pos.needsUpdate = true;
    (line.material as THREE.LineBasicMaterial).opacity = 1;
  });

  return (
    <group>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
}

function ParticleField({ count = 1600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const a = new THREE.Color("#facc15");
    const b = new THREE.Color("#22d3ee");
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5;
      const v = new THREE.Vector3().randomDirection().multiplyScalar(r);
      positions.set([v.x, v.y * 0.6, v.z], i * 3);
      const c = a.clone().lerp(b, Math.random());
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.03;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.15, 0.05);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.35, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.2, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={60} color="#fde047" />
      <pointLight position={[-4, -2, 2]} intensity={40} color="#22d3ee" />
      <Rig>
        <EnergyCore />
        <Arcs />
        <Sparkles count={60} scale={6} size={3} speed={0.5} color="#fde68a" />
      </Rig>
      <ParticleField />
    </Canvas>
  );
}
