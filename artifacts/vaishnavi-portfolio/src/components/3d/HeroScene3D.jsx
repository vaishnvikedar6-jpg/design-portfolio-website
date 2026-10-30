import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Graceful WebGL check
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

/**
 * Generates an artistic, high-res texture of a blooming Sakura blossom in elegant, radiant Plum Pink
 */
function createSakuraFlowerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const cx = 256;
  const cy = 256;

  // Draw 5 notched cherry blossom petals in elegant plum pink
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Elegant plum-pink gradient with dewy soft luster and rich berry depth
    const grad = ctx.createRadialGradient(0, -90, 8, 0, -90, 145);
    grad.addColorStop(0, '#ffffff'); // Dewy apex shine
    grad.addColorStop(0.2, '#fce4ee'); // Delicate plum-blush highlight
    grad.addColorStop(0.48, '#e06296'); // Radiant plum pink blossom
    grad.addColorStop(0.8, '#a82e63'); // Rich wild plum rose
    grad.addColorStop(1, '#5c1737'); // Deep velvety plum base

    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(168, 46, 99, 0.45)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    // Heart-notched sakura petal curve
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-45, -60, -75, -140, -40, -195);
    ctx.bezierCurveTo(-20, -225, -6, -200, 0, -180); // Center notch
    ctx.bezierCurveTo(6, -200, 20, -225, 40, -195);
    ctx.bezierCurveTo(75, -140, 45, -60, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Glossy glass-lacquer specular shine streak across the petal
    const shineGrad = ctx.createLinearGradient(-35, -180, 25, -50);
    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    shineGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.35)');
    shineGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
    shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGrad;
    ctx.beginPath();
    ctx.moveTo(-15, -40);
    ctx.bezierCurveTo(-38, -90, -48, -160, -22, -190);
    ctx.bezierCurveTo(-10, -170, -8, -100, -5, -40);
    ctx.closePath();
    ctx.fill();

    // Delicate inner petal vein highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(0, -165);
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();

  // Flower Center: Deep Plum & Wild Berry Core
  const centerGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32);
  centerGrad.addColorStop(0, '#fff4b8'); // Soft sparkling gold
  centerGrad.addColorStop(0.35, '#d44a82'); // Glowing plum ring
  centerGrad.addColorStop(0.75, '#8c2250'); // Deep wild plum
  centerGrad.addColorStop(1, '#420e27'); // Velvet blackberry
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();

  // Shiny Golden Pollen Stamens
  for (let s = 0; s < 22; s++) {
    const sAngle = (s / 22) * Math.PI * 2;
    const len = 35 + Math.random() * 25;
    const ex = cx + Math.cos(sAngle) * len;
    const ey = cy + Math.sin(sAngle) * len;

    ctx.strokeStyle = '#ffe399';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Golden anther tip with shine halo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(ex, ey, 3.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an organic single Sakura Petal texture in elegant plum pink
 */
function createSakuraPetalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const cx = 128;
  const cy = 220;

  const grad = ctx.createRadialGradient(cx, 110, 5, cx, 110, 115);
  grad.addColorStop(0, '#ffffff'); // Glistening apex reflection
  grad.addColorStop(0.25, '#fce4ee'); // Soft plum blush
  grad.addColorStop(0.65, '#d44a82'); // Vivid plum pink
  grad.addColorStop(1, '#721b44'); // Deep plum base

  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(168, 46, 99, 0.35)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx - 50, cy - 60, cx - 75, cy - 130, cx - 35, cy - 180);
  ctx.bezierCurveTo(cx - 15, cy - 200, cx - 5, cy - 185, cx, cy - 175);
  ctx.bezierCurveTo(cx + 5, cy - 185, cx + 15, cy - 200, cx + 35, cy - 180);
  ctx.bezierCurveTo(cx + 75, cy - 130, cx + 50, cy - 60, cx, cy);
  ctx.closePath();
  ctx.fill();

  // Glossy shine highlight curve
  const shineGrad = ctx.createLinearGradient(cx - 40, cy - 160, cx + 20, cy - 60);
  shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  shineGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.25)');
  shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = shineGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 60);
  ctx.bezierCurveTo(cx - 45, cy - 100, cx - 55, cy - 150, cx - 25, cy - 175);
  ctx.bezierCurveTo(cx - 12, cy - 160, cx - 10, cy - 100, cx - 8, cy - 60);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Appealing 3D Floating Sakura Flower with gentle natural wind sway & mouse parallax
 */
function Appealing3DFlower({ texture, scale = 1, rotationSpeed = 0.2, mouse }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Organic swaying & parallax
    const targetX = (mouse.current.x * Math.PI) / 12;
    const targetY = (mouse.current.y * Math.PI) / 14;

    meshRef.current.rotation.z += delta * rotationSpeed * 0.4;
    meshRef.current.rotation.y += (targetX - meshRef.current.rotation.y) * 0.04;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.12 - targetY * 0.04;
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, 1]}>
      <planeGeometry args={[2.2, 2.2]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        roughness={0.12}
        metalness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Single 3D Drifting Sakura Petal tumbling down smoothly with glistening shine
 */
function DriftingSakuraPetal({ texture, initialPos, speed, rotSpeed, scale }) {
  const meshRef = useRef();
  const yOffset = useRef(initialPos[1]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    yOffset.current -= delta * speed;
    if (yOffset.current < -6) {
      yOffset.current = 6;
    }

    meshRef.current.position.y = yOffset.current;
    meshRef.current.position.x = initialPos[0] + Math.sin(state.clock.elapsedTime * 0.7 + initialPos[2]) * 0.35;
    meshRef.current.position.z = initialPos[2] + Math.cos(state.clock.elapsedTime * 0.5 + initialPos[0]) * 0.25;

    meshRef.current.rotation.x += delta * rotSpeed.x;
    meshRef.current.rotation.y += delta * rotSpeed.y;
    meshRef.current.rotation.z += delta * rotSpeed.z;
  });

  return (
    <mesh
      ref={meshRef}
      position={[initialPos[0], initialPos[1], initialPos[2]]}
      scale={[scale, scale, 1]}
    >
      <planeGeometry args={[0.7, 0.7]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        roughness={0.15}
        metalness={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function HeroScene3D() {
  const mouse = useRef({ x: 0, y: 0 });
  const [supported, setSupported] = useState(true);

  const flowerTexture = useMemo(() => createSakuraFlowerTexture(), []);
  const petalTexture = useMemo(() => createSakuraPetalTexture(), []);

  useEffect(() => {
    setSupported(isWebGLAvailable());

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const petalsData = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 4,
      ],
      speed: 0.28 + Math.random() * 0.38,
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.8,
        y: (Math.random() - 0.5) * 0.9,
        z: (Math.random() - 0.5) * 0.6,
      },
      scale: 0.35 + Math.random() * 0.3,
    }));
  }, []);

  if (!supported) return null;

  return (
    <div className="hero-3d-canvas-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.3} color="#fff2f4" />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
        {/* Plum pink & warm gold sparkle lights catching petal gloss */}
        <pointLight position={[2, 2, 4]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={2.0} color="#e06296" />
        <pointLight position={[3, 3, 2]} intensity={1.8} color="#ffd166" />

        {/* Delicate Sakura Blossom accent floating gracefully top-right */}
        <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.9}>
          <group position={[2.2, 1.2, 0.2]}>
            <Appealing3DFlower texture={flowerTexture} scale={0.52} rotationSpeed={0.25} mouse={mouse} />
          </group>
        </Float>

        {/* Petite companion blossom floating lower-left */}
        <Float speed={2.3} rotationIntensity={0.5} floatIntensity={1.0}>
          <group position={[-2.3, -1.1, 0.1]}>
            <Appealing3DFlower texture={flowerTexture} scale={0.42} rotationSpeed={-0.2} mouse={mouse} />
          </group>
        </Float>

        {/* Small blossoming bud floating upper-left */}
        <Float speed={2.6} rotationIntensity={0.4} floatIntensity={1.1}>
          <group position={[-1.7, 1.7, -0.3]}>
            <Appealing3DFlower texture={flowerTexture} scale={0.3} rotationSpeed={0.3} mouse={mouse} />
          </group>
        </Float>

        {/* Drifting Petals Shower */}
        {petalsData.map((data, idx) => (
          <DriftingSakuraPetal
            key={idx}
            texture={petalTexture}
            initialPos={data.pos}
            speed={data.speed}
            rotSpeed={data.rotSpeed}
            scale={data.scale}
          />
        ))}
      </Canvas>
    </div>
  );
}
