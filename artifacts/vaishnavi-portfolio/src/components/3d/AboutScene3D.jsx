import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from './HeroScene3D';

function createSakuraFlowerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const cx = 256;
  const cy = 256;

  ctx.save();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 * Math.PI) / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const grad = ctx.createRadialGradient(0, -90, 8, 0, -90, 145);
    grad.addColorStop(0, '#ffffff'); // Dewy apex shine
    grad.addColorStop(0.2, '#fce4ee'); // Plum blush highlight
    grad.addColorStop(0.48, '#e06296'); // Radiant plum pink
    grad.addColorStop(0.8, '#a82e63'); // Rich wild plum rose
    grad.addColorStop(1, '#5c1737'); // Deep velvety plum base

    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(168, 46, 99, 0.45)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-45, -60, -75, -140, -40, -195);
    ctx.bezierCurveTo(-20, -225, -6, -200, 0, -180);
    ctx.bezierCurveTo(6, -200, 20, -225, 40, -195);
    ctx.bezierCurveTo(75, -140, 45, -60, 0, 0);
    ctx.closePath();
    ctx.fill();

    // Glossy glass specular shine streak
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

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(0, -165);
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();

  const centerGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32);
  centerGrad.addColorStop(0, '#fff4b8');
  centerGrad.addColorStop(0.35, '#d44a82');
  centerGrad.addColorStop(0.75, '#8c2250');
  centerGrad.addColorStop(1, '#420e27');
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();

  for (let s = 0; s < 20; s++) {
    const sAngle = (s / 20) * Math.PI * 2;
    const len = 32 + Math.random() * 22;
    const ex = cx + Math.cos(sAngle) * len;
    const ey = cy + Math.sin(sAngle) * len;

    ctx.strokeStyle = '#ffe399';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function FloatingSakura({ texture, mouse }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mx = mouse.current.x * 0.3;
    const my = mouse.current.y * 0.3;

    meshRef.current.rotation.z += delta * 0.15;
    meshRef.current.rotation.y += (mx - meshRef.current.rotation.y) * 0.04;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.12 - my * 0.04;
  });

  return (
    <mesh ref={meshRef} scale={[0.85, 0.85, 1]}>
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

export default function AboutScene3D() {
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
    <div className="about-3d-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.3} color="#fff2f4" />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[2, 2, 3]} intensity={2.4} color="#ffffff" />
        <pointLight position={[-3, -3, 2]} intensity={1.8} color="#ff3b69" />
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <FloatingSakura texture={texture} mouse={mouse} />
        </Float>
      </Canvas>
    </div>
  );
}
