import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// WebGL availability check
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

/**
 * 3D Fairy Mushroom with oversized pastel cap and glowing spots
 */
function FairyMushroom({ position = [0, 0, 0], scale = 1, capColor = '#f472b6', stemColor = '#fffdf7' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stem */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.16, 0.3, 0.9, 16]} />
        <meshStandardMaterial color={stemColor} roughness={0.6} />
      </mesh>

      {/* Mushroom Cap */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={capColor} roughness={0.25} metalness={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* Cap Underside Gills */}
      <mesh position={[0, 0.94, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.68, 20]} />
        <meshStandardMaterial color="#fff3ea" roughness={0.7} />
      </mesh>

      {/* Glowing Polka Dots */}
      {[
        [-0.22, 1.28, 0.42],
        [0.35, 1.22, 0.32],
        [-0.38, 1.18, -0.22],
        [0.18, 1.38, -0.28],
        [0, 1.5, 0],
      ].map((dotPos, idx) => (
        <mesh key={idx} position={dotPos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Subtle magical ground glow under mushroom */}
      <pointLight position={[0, 0.6, 0]} intensity={0.6} distance={2.8} color={capColor} />
    </group>
  );
}

/**
 * 3D Stylized Fairy Tree with curved trunk and layered fluffy canopy
 */
function FairyTree({ position = [0, 0, 0], scale = 1, canopyColor = '#fbcfe8', isBlossom = true }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Curved Trunk */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.26, 0.55, 3.0, 12]} />
        <meshStandardMaterial color="#6b4430" roughness={0.85} />
      </mesh>

      {/* Main Fluffy Canopy Layer 1 */}
      <mesh position={[0, 3.1, 0]}>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={canopyColor} roughness={0.48} />
      </mesh>

      {/* Canopy Cloud 2 */}
      <mesh position={[-0.75, 3.4, 0.4]}>
        <dodecahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color={canopyColor} roughness={0.5} />
      </mesh>

      {/* Canopy Cloud 3 */}
      <mesh position={[0.8, 3.3, -0.3]}>
        <dodecahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color={canopyColor} roughness={0.5} />
      </mesh>

      {/* Topmost Blossom Crown */}
      <mesh position={[0.1, 4.1, 0.1]}>
        <dodecahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color={isBlossom ? '#f472b6' : '#86efac'} roughness={0.42} />
      </mesh>
    </group>
  );
}

/**
 * 3D Fairy Cottage Facade with flower roof, glowing round window & chimney
 */
function FairyCottage({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Cottage Main Round Cobblestone Base */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[1.6, 1.85, 2.5, 20]} />
        <meshStandardMaterial color="#eee4d8" roughness={0.8} />
      </mesh>

      {/* Conical Flower-covered Thatch Roof */}
      <mesh position={[0, 3.25, 0]}>
        <coneGeometry args={[2.35, 2.0, 20]} />
        <meshStandardMaterial color="#de5d95" roughness={0.55} />
      </mesh>

      {/* Flower Trim along roof eaves */}
      {Array.from({ length: 14 }).map((_, i) => {
        const ang = (i / 14) * Math.PI * 2;
        const fx = Math.cos(ang) * 2.15;
        const fz = Math.sin(ang) * 2.15;
        return (
          <mesh key={i} position={[fx, 2.3, fz]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#fbcfe8' : '#fed7aa'} />
          </mesh>
        );
      })}

      {/* Round Glowing Amber Fairy Window */}
      <group position={[0, 1.6, 1.7]}>
        {/* Frame */}
        <mesh>
          <torusGeometry args={[0.42, 0.06, 12, 24]} />
          <meshStandardMaterial color="#7c4a2d" />
        </mesh>
        {/* Glowing glass pane */}
        <mesh>
          <circleGeometry args={[0.38, 20]} />
          <meshBasicMaterial color="#ffd166" />
        </mesh>
        {/* Window warm light */}
        <pointLight intensity={1.8} distance={5} color="#ffd166" />
      </group>

      {/* Wooden Cottage Door with Heart */}
      <group position={[1.05, 0.75, 1.35]} rotation={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 1.4, 0.09]} />
          <meshStandardMaterial color="#6ee7b7" roughness={0.7} />
        </mesh>
        {/* Heart emblem */}
        <mesh position={[0, 0.22, 0.06]}>
          <circleGeometry args={[0.09, 12]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
      </group>

      {/* Stone Chimney */}
      <mesh position={[-1.0, 3.6, -0.45]}>
        <cylinderGeometry args={[0.24, 0.27, 1.3, 10]} />
        <meshStandardMaterial color="#88817a" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * 3D Hanging Golden Lantern emitting warm light
 */
function FairyLantern({ position = [0, 0, 0], scale = 0.5 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Lantern Cap */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.38, 0.38, 8]} />
        <meshStandardMaterial color="#4a2e18" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Glowing Warm Amber Glass Core */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.24, 0.2, 0.48, 8]} />
        <meshBasicMaterial color="#ffeb99" />
      </mesh>

      {/* Real warm point light */}
      <pointLight position={[0, 0.12, 0]} intensity={2.2} distance={6} color="#ffd166" />

      {/* Base */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.1, 8]} />
        <meshStandardMaterial color="#4a2e18" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * 3D Turquoise Pond with floating lily pads and blooming lotus
 */
function FairyPond({ position = [0, 0, 0], scale = 1 }) {
  const waterRef = useRef();

  useFrame((state) => {
    if (!waterRef.current) return;
    waterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Pond Water Disc */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.12}
          metalness={0.25}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Mossy Rock Edge Stones */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const rx = Math.cos(angle) * (2.45 + (i % 3) * 0.1);
        const rz = Math.sin(angle) * (2.45 + (i % 2) * 0.12);
        return (
          <mesh key={i} position={[rx, 0.08, rz]} scale={[0.32, 0.2, 0.32]}>
            <dodecahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#86a873' : '#6b7280'} roughness={0.85} />
          </mesh>
        );
      })}

      {/* Lily Pads */}
      {[
        [-0.7, 0.04, 0.5],
        [0.8, 0.04, -0.4],
        [-0.3, 0.04, -0.9],
        [1.0, 0.04, 0.7],
      ].map((padPos, idx) => (
        <group key={idx} position={padPos} rotation={[-Math.PI / 2, 0, idx * 1.2]}>
          {/* Green Lily Pad */}
          <mesh>
            <circleGeometry args={[0.38, 16]} />
            <meshStandardMaterial color="#4ade80" roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Blooming Pink Water Lily / Lotus */}
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.16, 0.2, 8]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 3D Cobblestone Pathway Stones winding gracefully
 */
function CobblestonePath() {
  const stones = useMemo(() => {
    return [
      [-1.2, -1.55, 2.6, 0.44],
      [-0.4, -1.52, 2.0, 0.48],
      [0.5, -1.48, 1.4, 0.46],
      [1.6, -1.42, 0.8, 0.50],
      [2.7, -1.35, 0.0, 0.46],
      [3.6, -1.25, -1.0, 0.48],
      [4.3, -1.15, -2.1, 0.45],
    ];
  }, []);

  return (
    <group>
      {stones.map(([x, y, z, rad], idx) => (
        <mesh key={idx} position={[x, y, z]} rotation={[-Math.PI / 2, 0, idx * 0.4]} scale={[rad, rad * 0.75, 1]}>
          <circleGeometry args={[1, 14]} />
          <meshStandardMaterial color="#dfd4c5" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Animated 3D Butterfly with Flapping Wings
 */
function Butterfly3D({ position = [0, 0, 0], scale = 0.35, color = '#60a5fa' }) {
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const bodyRef = useRef();

  useFrame((state) => {
    const flap = Math.sin(state.clock.elapsedTime * 14) * 0.7;
    if (leftWingRef.current) leftWingRef.current.rotation.y = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flap;
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.12;
    }
  });

  return (
    <group ref={bodyRef} position={position} scale={[scale, scale, scale]}>
      {/* Center Body */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
        <meshStandardMaterial color="#3e1a2e" />
      </mesh>

      {/* Left Wing */}
      <group position={[-0.04, 0, 0]}>
        <mesh ref={leftWingRef} position={[-0.32, 0, 0]}>
          <planeGeometry args={[0.65, 0.65]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.92} />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[0.04, 0, 0]}>
        <mesh ref={rightWingRef} position={[0.32, 0, 0]}>
          <planeGeometry args={[0.65, 0.65]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.92} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 3D Firefly Swarm with bioluminescent glowing particles
 */
function FireflySwarm({ count = 35 }) {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = 0.5 + Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(time * 1.5 + i) * 0.004;
      positions[i * 3] += Math.cos(time * 0.8 + i) * 0.003;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#fef08a"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Camera controller reacting smoothly to scroll position and mouse parallax
 */
function StorybookCameraController({ mouse, scrollProgress }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetX = (mouse.current.x * 0.6) + Math.sin(scrollProgress.current * Math.PI * 1.5) * 1.0;
    const targetY = 1.4 - scrollProgress.current * 1.2 + (mouse.current.y * 0.4);
    const targetZ = 7.8 - scrollProgress.current * 2.0;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;

    const lookTargetX = Math.sin(scrollProgress.current * Math.PI) * 0.6;
    const lookTargetY = 0.4 - scrollProgress.current * 0.4;
    camera.lookAt(lookTargetX, lookTargetY, 0);
  });

  return null;
}

/**
 * MAIN PERSISTENT 3D FAIRY GARDEN WORLD
 */
export default function FairyGardenWorld3D() {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isWebGLAvailable());

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!supported) return null;

  return (
    <div className="fairy-garden-3d-world-canvas-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.4, 7.8], fov: 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <StorybookCameraController mouse={mouse} scrollProgress={scrollProgress} />

        {/* Dreamy Fairytale Environmental Fog */}
        <fog attach="fog" args={['#fff8f5', 9, 28]} />

        {/* Dreamy Fairy Garden Lighting */}
        <ambientLight intensity={1.5} color="#fff6ea" />
        <directionalLight position={[6, 9, 5]} intensity={2.2} color="#fef08a" castShadow />
        <pointLight position={[-4, 3, 2]} intensity={1.8} color="#f472b6" />
        <pointLight position={[4, 2, -2]} intensity={1.6} color="#67e8f9" />

        {/* 1. Fairy Cottage in the right background clearing */}
        <FairyCottage position={[4.8, -0.4, -3.8]} scale={1.3} rotation={[0, -0.35, 0]} />

        {/* 2. Stylized Fluffy Trees (Blossom & Emerald) */}
        <FairyTree position={[-5.5, -0.2, -2.0]} scale={1.35} canopyColor="#fbcfe8" isBlossom={true} />
        <FairyTree position={[-6.8, 0, -4.0]} scale={1.15} canopyColor="#86efac" isBlossom={false} />
        <FairyTree position={[6.8, -0.2, -2.5]} scale={1.25} canopyColor="#fbcfe8" isBlossom={true} />
        <FairyTree position={[-1.8, 0.4, -6.8]} scale={1.4} canopyColor="#f9a8d4" isBlossom={true} />
        <FairyTree position={[2.2, 0.4, -7.2]} scale={1.3} canopyColor="#bbf7d0" isBlossom={false} />

        {/* 3. Oversized Pastel Fairy Mushrooms with Glowing Spots */}
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
          <FairyMushroom position={[-4.6, -1.6, 2.2]} scale={1.15} capColor="#f472b6" />
        </Float>
        <FairyMushroom position={[-3.8, -1.7, 2.8]} scale={0.82} capColor="#c084fc" />
        <FairyMushroom position={[-5.3, -1.7, 1.4]} scale={0.7} capColor="#4ade80" />
        <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.2}>
          <FairyMushroom position={[3.6, -1.7, 2.4]} scale={1.1} capColor="#f472b6" />
        </Float>
        <FairyMushroom position={[4.5, -1.8, 1.8]} scale={0.85} capColor="#fbbf24" />

        {/* 4. Turquoise Pond with Lily Pads and Pink Water Lilies in Lower Left */}
        <FairyPond position={[-3.6, -1.6, 1.0]} scale={0.95} />

        {/* 5. Winding Cobblestone Pathway leading to the cottage */}
        <CobblestonePath />

        {/* 6. Hanging Golden Garden Lanterns */}
        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.35}>
          <FairyLantern position={[-3.8, 1.2, -0.6]} scale={0.5} />
        </Float>
        <Float speed={1.7} rotationIntensity={0.2} floatIntensity={0.3}>
          <FairyLantern position={[3.6, 0.3, -2.0]} scale={0.45} />
        </Float>
        <FairyLantern position={[1.4, -0.8, 1.2]} scale={0.4} />

        {/* 7. Animated 3D Butterflies */}
        <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
          <Butterfly3D position={[-1.8, 1.4, 2.0]} scale={0.38} color="#60a5fa" />
        </Float>
        <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.5}>
          <Butterfly3D position={[1.4, 1.8, 2.2]} scale={0.35} color="#f472b6" />
        </Float>
        <Float speed={2.8} rotationIntensity={0.5} floatIntensity={0.7}>
          <Butterfly3D position={[-0.2, 2.4, 1.0]} scale={0.32} color="#c084fc" />
        </Float>
        <Float speed={2.0} rotationIntensity={0.3} floatIntensity={0.4}>
          <Butterfly3D position={[2.8, 1.0, 1.5]} scale={0.34} color="#ffd166" />
        </Float>

        {/* 8. Glowing Fireflies & Floating Particles */}
        <FireflySwarm count={40} />
      </Canvas>
    </div>
  );
}
