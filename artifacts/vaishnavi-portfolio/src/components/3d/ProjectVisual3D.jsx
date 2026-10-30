import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from './HeroScene3D';

function createCurvedPetalGeometry(width = 0.5, length = 1.0, curvature = 0.3) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.7, length * 0.25, width * 1.1, length * 0.7, 0, length);
  shape.bezierCurveTo(-width * 1.1, length * 0.7, -width * 0.7, length * 0.25, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, 16);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const progress = y / length;
    const z = Math.sin(progress * Math.PI) * curvature - (x * x) * curvature;
    pos.setZ(i, z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// 1. AYUSHLINK 3D VISUAL: Healthcare-themed dimensional dashboard with blooming petal telemetry
function HealthcareCross() {
  const meshRef = useRef();
  const petalGroupRef = useRef();
  const petalGeom = useMemo(() => createCurvedPetalGeometry(0.5, 0.9, 0.3), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    }
    if (petalGroupRef.current) {
      petalGroupRef.current.rotation.z += delta * 0.25;
    }
  });

  const emeraldPulse = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#20c997'),
        metalness: 0.3,
        roughness: 0.2,
        emissive: new THREE.Color('#0ca678'),
        emissiveIntensity: 0.35,
      }),
    []
  );

  const blushPetal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#fcd5df'),
        transmission: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        side: THREE.DoubleSide,
      }),
    []
  );

  const roseGold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d48b99'),
        metalness: 0.85,
        roughness: 0.2,
      }),
    []
  );

  return (
    <group>
      {/* Floating 3D Medical Cross with soft rounded edges */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.9}>
        <group ref={meshRef} scale={[0.62, 0.62, 0.62]}>
          <mesh material={emeraldPulse} position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 1.7, 0.45]} />
          </mesh>
          <mesh material={emeraldPulse} position={[0, 0, 0]}>
            <boxGeometry args={[1.7, 0.5, 0.45]} />
          </mesh>
          <mesh material={roseGold} position={[0, 0, 0]}>
            <boxGeometry args={[0.55, 0.55, 0.5]} />
          </mesh>
        </group>
      </Float>

      {/* Orbiting healing flower petals */}
      <group ref={petalGroupRef}>
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const r = 1.35;
          return (
            <mesh
              key={i}
              geometry={petalGeom}
              material={blushPetal}
              position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
              rotation={[Math.PI / 4, 0, angle]}
              scale={[0.4, 0.4, 0.4]}
            />
          );
        })}
      </group>
    </group>
  );
}

export function AyushLinkScene3D() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(isWebGLAvailable());
  }, []);

  if (!supported) return null;

  return (
    <div className="project-3d-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 3]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-2, -2, 2]} intensity={1.8} color="#20c997" />
        <HealthcareCross />
      </Canvas>
    </div>
  );
}

// 2. ANUVAAD 3D VISUAL: Multilingual AI Chatbot with blooming botanical speech orb
function AnuvaadOrb() {
  const orbRef = useRef();
  const petalRingRef = useRef();
  const petalGeom = useMemo(() => createCurvedPetalGeometry(0.5, 1.0, 0.35), []);

  useFrame((state, delta) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.35;
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
    }
    if (petalRingRef.current) {
      petalRingRef.current.rotation.z += delta * 0.2;
    }
  });

  const aiGlow = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d6336c'),
        roughness: 0.2,
        metalness: 0.3,
        emissive: new THREE.Color('#a61e4d'),
        emissiveIntensity: 0.4,
      }),
    []
  );

  const petalGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#fbe4ec'),
        transmission: 0.85,
        transparent: true,
        roughness: 0.15,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.0}>
        <mesh ref={orbRef} material={aiGlow} scale={[0.7, 0.7, 0.7]}>
          <icosahedronGeometry args={[1, 2]} />
        </mesh>
      </Float>

      {/* Orbiting speech blossom petals */}
      <group ref={petalRingRef}>
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const r = 1.3;
          return (
            <mesh
              key={i}
              geometry={petalGeom}
              material={petalGlass}
              position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
              rotation={[Math.PI / 3, 0, angle]}
              scale={[0.42, 0.42, 0.42]}
            />
          );
        })}
      </group>
    </group>
  );
}

export function AnuvaadScene3D() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(isWebGLAvailable());
  }, []);

  if (!supported) return null;

  return (
    <div className="project-3d-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 4, 3]} intensity={2.0} color="#fff6f8" />
        <pointLight position={[-2, -2, 2]} intensity={2} color="#d6336c" />
        <AnuvaadOrb />
      </Canvas>
    </div>
  );
}

// 3. PIPELINE / CI/CD 3D VISUAL: Developer pipeline & cloud infrastructure with floral node aesthetics
function PipelineVisual() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const nodeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d48b99'),
        metalness: 0.85,
        roughness: 0.2,
      }),
    []
  );

  const pipeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#3e1a2e'),
        roughness: 0.2,
        metalness: 0.6,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh material={pipeMat} scale={[0.8, 0.8, 0.8]}>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
        </mesh>
        <mesh position={[-1.2, 0.6, 0]} material={nodeMat} scale={[0.22, 0.22, 0.22]}>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>
        <mesh position={[0, 0.9, 0]} material={nodeMat} scale={[0.25, 0.25, 0.25]}>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>
        <mesh position={[1.2, 0.6, 0]} material={nodeMat} scale={[0.22, 0.22, 0.22]}>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>
      </Float>
    </group>
  );
}

export function PipelineScene3D() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(isWebGLAvailable());
  }, []);

  if (!supported) return null;

  return (
    <div className="project-3d-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 4, 3]} intensity={2.0} color="#fff6f8" />
        <PipelineVisual />
      </Canvas>
    </div>
  );
}
