"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SceneObject {
  id: string;
  type: "box" | "sphere" | "torus" | "plane" | "particles";
  position?: [number, number, number];
  args?: number[];
  material?: { color?: string; metalness?: number; roughness?: number };
  animation?: { type: "rotate" | "float" | "none"; axis?: "x" | "y" | "z"; speed?: number };
  count?: number;
  spread?: number;
  color?: string;
}

export interface SceneGraph {
  background?: string;
  camera?: { position?: [number, number, number]; fov?: number };
  lights?: { type: "ambient" | "point" | "directional"; position?: [number, number, number]; intensity?: number; color?: string }[];
  objects?: SceneObject[];
}

function AnimatedMesh({ obj }: { obj: SceneObject }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current || !obj.animation || obj.animation.type === "none") return;
    const speed = obj.animation.speed ?? 0.3;
    if (obj.animation.type === "rotate") {
      const axis = obj.animation.axis ?? "y";
      ref.current.rotation[axis] += delta * speed;
    } else if (obj.animation.type === "float") {
      ref.current.position.y = (obj.position?.[1] ?? 0) + Math.sin(Date.now() * 0.001 * speed) * 0.4;
    }
  });

  const geometry = () => {
    switch (obj.type) {
      case "box":
        return <boxGeometry args={(obj.args as [number, number, number]) ?? [1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={(obj.args as [number, number, number]) ?? [1, 32, 32]} />;
      case "torus":
        return <torusGeometry args={(obj.args as [number, number, number, number]) ?? [1, 0.3, 16, 100]} />;
      case "plane":
        return <planeGeometry args={(obj.args as [number, number]) ?? [5, 5]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  return (
    <mesh ref={ref} position={obj.position ?? [0, 0, 0]}>
      {geometry()}
      <meshStandardMaterial
        color={obj.material?.color ?? "#8b5cf6"}
        metalness={obj.material?.metalness ?? 0.5}
        roughness={obj.material?.roughness ?? 0.3}
      />
    </mesh>
  );
}

function Particles({ obj }: { obj: SceneObject }) {
  const count = obj.count ?? 300;
  const spread = obj.spread ?? 10;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={obj.color ?? "#22d3ee"} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

export function SceneRenderer({ scene }: { scene: SceneGraph }) {
  return (
    <Canvas
      camera={{ position: scene.camera?.position ?? [0, 2, 8], fov: scene.camera?.fov ?? 50 }}
      style={{ background: scene.background ?? "#050505" }}
    >
      {(scene.lights ?? [{ type: "ambient", intensity: 0.5 }]).map((light, i) =>
        light.type === "ambient" ? (
          <ambientLight key={i} intensity={light.intensity ?? 0.5} />
        ) : light.type === "point" ? (
          <pointLight key={i} position={light.position ?? [5, 5, 5]} intensity={light.intensity ?? 1} color={light.color} />
        ) : (
          <directionalLight key={i} position={light.position ?? [5, 5, 5]} intensity={light.intensity ?? 1} color={light.color} />
        )
      )}
      <Environment preset="city" />
      {(scene.objects ?? []).map((obj) =>
        obj.type === "particles" ? <Particles key={obj.id} obj={obj} /> : <AnimatedMesh key={obj.id} obj={obj} />
      )}
      <OrbitControls enableDamping />
    </Canvas>
  );
}
