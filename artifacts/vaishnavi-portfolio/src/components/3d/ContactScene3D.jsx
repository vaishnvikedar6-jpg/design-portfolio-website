import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from './HeroScene3D';

function createSakuraFlowerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const cx = 128;
  const cy = 128;

  ctx.save();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const grad = ctx.createRadialGradient(0, -45, 5, 0, -45, 70);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#fde2e9');
    grad.addColorStop(0.7, '#d6336c');
    grad.addColorStop(1, '#861b47');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-22, -30, -38, -70, -20, -98);
    ctx.bezierCurveTo(-10, -112, -3, -100, 0, -90);
    ctx.bezierCurveTo(3, -100, 10, -112, 20, -98);
    ctx.bezierCurveTo(38, -70, 22, -30, 0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();

  // Flower Center
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function FloralContactEnvelope({ texture, mouse }) {
  const groupRef = useRef();
  const flowerRef = useRef();
  const petalsRef = useRef([]);

  // Generate 6 orbital petals floating around the blossom
  const petals = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 1.35 + (i % 2) * 0.4,
      speed: 0.4 + (i % 3) * 0.2,
      scale: 0.35 + (i % 2) * 0.15,
      yOffset: ((i % 3) - 1) * 0.35,
    }));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const targetY = (mouse.current.x * Math.PI) / 8;
    const targetX = (-mouse.current.y * Math.PI) / 10;

    if (groupRef.current) {
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05 + delta * 0.15;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    }
    if (flowerRef.current) {
      flowerRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        {/* Luminous Center Sakura Blossom */}
        <mesh ref={flowerRef} position={[0, 0, 0]} scale={[1.8, 1.8, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={texture}
            transparent
            alphaTest={0.01}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Orbiting Sakura Petals */}
        {petals.map((p, idx) => (
          <mesh
            key={idx}
            position={[
              Math.cos(p.angle) * p.radius,
              Math.sin(p.angle) * p.radius * 0.65 + p.yOffset,
              Math.sin(p.angle) * 0.4,
            ]}
            rotation={[0.3, 0.4, p.angle]}
            scale={[p.scale, p.scale, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
              map={texture}
              transparent
              alphaTest={0.01}
              roughness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function ContactScene3D() {
  const mouse = useRef({ x: 0, y: 0 });
  const [supported, setSupported] = useState(true);
  const texture = useMemo(() => createSakuraFlowerTexture(), []);

  useEffect(() => {
    setSupported(isWebGLAvailable());

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!supported) return null;

  return (
    <div className="contact-3d-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-3, -3, 3]} intensity={2.0} color="#d6336c" />
        <FloralContactEnvelope texture={texture} mouse={mouse} />
      </Canvas>
    </div>
  );
}
