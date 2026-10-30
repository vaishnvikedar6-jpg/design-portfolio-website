import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Graceful WebGL check
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * 3D Open Storybook with dimensional cover, ivory pages and gold edges
 */
function OpenStorybook3D({ position = [0, -1.8, 0], scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[-0.22, 0, 0]}>
      {/* Wooden Desk Surface below the book */}
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[26, 0.4, 18]} />
        <meshStandardMaterial color="#2d1b14" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Book Hardcover Spine & Base in Blush/Plum Leather */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[13.4, 0.22, 9.4]} />
        <meshStandardMaterial color="#a82e63" roughness={0.5} />
      </mesh>

      {/* Gold Gilded Filigree Trim along cover edges */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[13.55, 0.16, 9.55]} />
        <meshStandardMaterial color="#e8d39a" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Left Open Page Block (Warm Ivory Parchment) */}
      <group position={[-3.3, 0.08, 0]} rotation={[0, 0, 0.04]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6.2, 0.16, 8.8]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.75} />
        </mesh>
        {/* Gold gilded edge trim on left block */}
        <mesh position={[-3.11, 0, 0]}>
          <boxGeometry args={[0.04, 0.17, 8.82]} />
          <meshStandardMaterial color="#e8d39a" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Right Open Page Block (Warm Ivory Parchment) */}
      <group position={[3.3, 0.08, 0]} rotation={[0, 0, -0.04]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6.2, 0.16, 8.8]} />
          <meshStandardMaterial color="#fffdf7" roughness={0.75} />
        </mesh>
        {/* Gold gilded edge trim on right block */}
        <mesh position={[3.11, 0, 0]}>
          <boxGeometry args={[0.04, 0.17, 8.82]} />
          <meshStandardMaterial color="#e8d39a" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Center Spine Groove / Shadow */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.12, 8.85]} />
        <meshStandardMaterial color="#e2d4c0" roughness={0.9} />
      </mesh>

      {/* Crimson Satin Bookmark Ribbon trailing out */}
      <mesh position={[0.2, 0.12, 4.4]} rotation={[0.1, 0.2, 0]}>
        <boxGeometry args={[0.35, 0.02, 1.6]} />
        <meshStandardMaterial color="#c4407b" roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Miniature Stylized Fairy Tree (framing borders, never blocking center)
 */
function MiniatureTree({
  position = [0, 0, 0],
  scale = 1,
  canopyColor = '#fbcfe8',
  isBlossom = true,
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Curved Trunk */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.18, 0.38, 2.4, 12]} />
        <meshStandardMaterial color="#5c3826" roughness={0.85} />
      </mesh>

      {/* Layered Fluffy Cloud Canopies */}
      <mesh position={[0, 2.5, 0]}>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={canopyColor} roughness={0.5} />
      </mesh>
      <mesh position={[-0.6, 2.8, 0.3]}>
        <dodecahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color={canopyColor} roughness={0.52} />
      </mesh>
      <mesh position={[0.65, 2.7, -0.25]}>
        <dodecahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color={canopyColor} roughness={0.52} />
      </mesh>
      <mesh position={[0.08, 3.3, 0.08]}>
        <dodecahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color={isBlossom ? '#f472b6' : '#86efac'}
          roughness={0.45}
        />
      </mesh>
    </group>
  );
}

/**
 * Miniature Fairy Cottage (placed in the right background)
 */
function MiniatureCottage({ position = [0, 0, 0], scale = 0.8, rotation = [0, 0, 0] }) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Grassy knoll base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.8, 2.2, 0.3, 16]} />
        <meshStandardMaterial color="#8bb580" roughness={0.8} />
      </mesh>

      {/* Cobblestone Wall Body */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[1.2, 1.35, 1.8, 16]} />
        <meshStandardMaterial color="#ede4d8" roughness={0.8} />
      </mesh>

      {/* Conical Flower-Thatch Roof in Plum Pink */}
      <mesh position={[0, 2.35, 0]}>
        <coneGeometry args={[1.75, 1.5, 16]} />
        <meshStandardMaterial color="#de5d95" roughness={0.55} />
      </mesh>

      {/* Round Glowing Amber Dormer Window with Light */}
      <group position={[0, 1.15, 1.25]}>
        <mesh>
          <torusGeometry args={[0.3, 0.04, 10, 20]} />
          <meshStandardMaterial color="#6b3f20" />
        </mesh>
        <mesh>
          <circleGeometry args={[0.27, 16]} />
          <meshBasicMaterial color="#ffd166" />
        </mesh>
        <pointLight intensity={1.4} distance={4} color="#ffd166" />
      </group>

      {/* Wooden Heart Door */}
      <group position={[0.75, 0.55, 1.0]} rotation={[0, 0.45, 0]}>
        <mesh>
          <boxGeometry args={[0.55, 1.0, 0.08]} />
          <meshStandardMaterial color="#6ee7b7" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.16, 0.05]}>
          <circleGeometry args={[0.07, 12]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
      </group>

      {/* Tiny Stone Chimney */}
      <mesh position={[-0.7, 2.6, -0.3]}>
        <cylinderGeometry args={[0.18, 0.2, 0.9, 8]} />
        <meshStandardMaterial color="#88817a" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Miniature Turquoise Pond with Lily Pads (bottom-left perimeter)
 */
function MiniaturePond({ position = [0, 0, 0], scale = 0.85 }) {
  const waterRef = useRef();

  useFrame((state) => {
    if (!waterRef.current) return;
    waterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Water Disc */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Mossy Rock Border */}
      {Array.from({ length: 14 }).map((_, i) => {
        const ang = (i / 14) * Math.PI * 2;
        const rx = Math.cos(ang) * (1.75 + (i % 3) * 0.08);
        const rz = Math.sin(ang) * (1.75 + (i % 2) * 0.1);
        return (
          <mesh key={i} position={[rx, 0.06, rz]} scale={[0.26, 0.16, 0.26]}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#86a873' : '#6b7280'}
              roughness={0.85}
            />
          </mesh>
        );
      })}

      {/* Floating Lily Pads & Blooming Lotus */}
      {[
        [-0.5, 0.03, 0.4],
        [0.6, 0.03, -0.3],
        [-0.2, 0.03, -0.7],
      ].map((pos, idx) => (
        <group key={idx} position={pos} rotation={[-Math.PI / 2, 0, idx * 1.5]}>
          <mesh>
            <circleGeometry args={[0.28, 14]} />
            <meshStandardMaterial color="#4ade80" roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.15, 8]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Miniature Wishing Well (Right background / Chapter 7)
 */
function MiniatureWishingWell({ position = [0, 0, 0], scale = 0.55 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stone Circular Well Basin */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.75, 0.85, 0.9, 16]} />
        <meshStandardMaterial color="#88817a" roughness={0.85} />
      </mesh>
      {/* Water inside well */}
      <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 16]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.4} />
      </mesh>
      {/* Wooden roof pillars */}
      <mesh position={[-0.55, 1.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#5c3826" roughness={0.8} />
      </mesh>
      <mesh position={[0.55, 1.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#5c3826" roughness={0.8} />
      </mesh>
      {/* Pitched Roof in plum pink */}
      <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.0, 0.7, 4]} />
        <meshStandardMaterial color="#de5d95" roughness={0.6} />
      </mesh>
      {/* Wishing well warm ambient light */}
      <pointLight position={[0, 0.9, 0]} intensity={1.2} distance={3.5} color="#ffd166" />
    </group>
  );
}

/**
 * Miniature Fairy Mushrooms with Glowing Spots
 */
function MiniatureMushroom({
  position = [0, 0, 0],
  scale = 0.5,
  capColor = '#f472b6',
  stemColor = '#fffdf7',
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stem */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 0.7, 12]} />
        <meshStandardMaterial color={stemColor} roughness={0.6} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.55, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial
          color={capColor}
          roughness={0.25}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glowing polka dots */}
      {[
        [-0.18, 0.96, 0.32],
        [0.26, 0.92, 0.24],
        [-0.28, 0.88, -0.16],
        [0.14, 1.04, -0.2],
        [0, 1.12, 0],
      ].map((dot, idx) => (
        <mesh key={idx} position={dot}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* Gentle glow light */}
      <pointLight position={[0, 0.5, 0]} intensity={0.4} distance={2} color={capColor} />
    </group>
  );
}

/**
 * Miniature Hanging Golden Lantern
 */
function MiniatureLantern({ position = [0, 0, 0], scale = 0.35 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.3, 0.3, 8]} />
        <meshStandardMaterial color="#4a2e18" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.38, 8]} />
        <meshBasicMaterial color="#ffeb99" />
      </mesh>
      <pointLight position={[0, 0.1, 0]} intensity={1.8} distance={4.5} color="#ffd166" />
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.08, 8]} />
        <meshStandardMaterial color="#4a2e18" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Animated 3D Butterfly with Flapping Wings
 */
function AnimatedButterfly3D({
  position = [0, 0, 0],
  scale = 0.25,
  color = '#60a5fa',
  flightRadius = 1.2,
  speed = 1.8,
  phase = 0,
}) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed + phase;
    const flap = Math.sin(state.clock.elapsedTime * 16) * 0.72;

    if (leftWingRef.current) leftWingRef.current.rotation.y = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flap;

    if (groupRef.current) {
      groupRef.current.position.x = position[0] + Math.cos(time * 0.6) * flightRadius;
      groupRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.25;
      groupRef.current.position.z = position[2] + Math.sin(time * 0.6) * flightRadius;
      groupRef.current.rotation.y = -time * 0.6 + Math.PI / 2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.38, 8]} />
        <meshStandardMaterial color="#3e1a2e" />
      </mesh>
      {/* Left Wing */}
      <group position={[-0.03, 0, 0]}>
        <mesh ref={leftWingRef} position={[-0.26, 0, 0]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
      {/* Right Wing */}
      <group position={[0.03, 0, 0]}>
        <mesh ref={rightWingRef} position={[0.26, 0, 0]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshStandardMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 3D Bioluminescent Firefly Swarm rising from the pages
 */
function StorybookFireflySwarm({ count = 30 }) {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute along perimeter and upper air
      const angle = (i / count) * Math.PI * 2;
      const radius = 5 + Math.random() * 4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.5 + Math.random() * 5;
      pos[i * 3 + 2] = Math.sin(angle) * (radius * 0.65);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(time * 1.6 + i) * 0.003;
      positions[i * 3] += Math.cos(time * 0.8 + i) * 0.0025;
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
        size={0.14}
        color="#fef08a"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Storybook Camera Controller
 * Reacts smoothly to scroll position and mouse parallax without blocking DOM interaction
 */
function StorybookCameraController({ mouse, scrollProgress }) {
  const { camera } = useThree();

  useFrame(() => {
    // Smooth camera coordinates following storybook progression
    // 0 = Ch. 2 Meet Vaishnavi (wide framing of open book)
    // 0.25 = Ch. 3 Projects (slight tilt down towards pop-up)
    // 0.5 = Ch. 4 Skills
    // 0.75 = Ch. 5 Journey / Ch. 6 Gallery
    // 1.0 = Ch. 7 Wishing Garden (focalizing on wishing well and cottage)
    const targetX =
      mouse.current.x * 0.5 + Math.sin(scrollProgress.current * Math.PI * 1.4) * 0.9;
    const targetY = 1.8 - scrollProgress.current * 1.1 + mouse.current.y * 0.35;
    const targetZ = 8.5 - scrollProgress.current * 1.8;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;

    const lookTargetX = Math.sin(scrollProgress.current * Math.PI) * 0.5;
    const lookTargetY = 0.2 - scrollProgress.current * 0.3;
    camera.lookAt(lookTargetX, lookTargetY, 0);
  });

  return null;
}

/**
 * MASTER PERSISTENT 3D STORYBOOK WORLD
 * Renders the open book, perimeter miniature garden, and atmospheric effects
 */
export default function StorybookWorld3D() {
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
    <div className="storybook-3d-world-canvas-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.8, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <StorybookCameraController mouse={mouse} scrollProgress={scrollProgress} />

        {/* Environmental Fairytale Lighting */}
        <ambientLight intensity={1.4} color="#fff8f2" />
        <directionalLight position={[6, 9, 5]} intensity={2.2} color="#fef08a" castShadow />
        <pointLight position={[-6, 3, 2]} intensity={1.6} color="#f472b6" />
        <pointLight position={[6, 2, -2]} intensity={1.5} color="#67e8f9" />

        {/* Dreamy Soft Fog */}
        <fog attach="fog" args={['#fff8f5', 10, 30]} />

        {/* 1. Open 3D Storybook on Desk */}
        <OpenStorybook3D position={[0, -2.1, 0]} scale={1.05} />

        {/* 2. Left Framing Trees (Strictly outside central reading area) */}
        <MiniatureTree
          position={[-7.5, -0.6, -1.2]}
          scale={1.25}
          canopyColor="#fbcfe8"
          isBlossom={true}
        />
        <MiniatureTree
          position={[-8.8, -0.4, -3.2]}
          scale={1.05}
          canopyColor="#86efac"
          isBlossom={false}
        />

        {/* 3. Right Framing Trees & Miniature Cottage */}
        <MiniatureCottage
          position={[7.2, 0.1, -2.5]}
          scale={0.8}
          rotation={[0, -0.4, 0]}
        />
        <MiniatureTree
          position={[8.5, -0.4, -2.0]}
          scale={1.15}
          canopyColor="#fbcfe8"
          isBlossom={true}
        />

        {/* 4. Miniature Wishing Well (Right midground / Chapter 7) */}
        <MiniatureWishingWell position={[6.6, -1.4, 1.2]} scale={0.5} />

        {/* 5. Miniature Turquoise Pond with Water Lilies (Left corner) */}
        <MiniaturePond position={[-6.4, -1.5, 1.8]} scale={0.85} />

        {/* 6. Miniature Fairy Mushrooms along the bottom perimeter */}
        <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.2}>
          <MiniatureMushroom position={[-5.2, -1.6, 2.5]} scale={0.5} capColor="#f472b6" />
        </Float>
        <MiniatureMushroom position={[-4.5, -1.7, 3.0]} scale={0.38} capColor="#c084fc" />
        <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.18}>
          <MiniatureMushroom position={[4.8, -1.6, 2.6]} scale={0.48} capColor="#f472b6" />
        </Float>
        <MiniatureMushroom position={[5.6, -1.7, 2.1]} scale={0.36} capColor="#fbbf24" />

        {/* 7. Hanging Lanterns on branches */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <MiniatureLantern position={[-5.8, 0.8, -0.5]} scale={0.35} />
        </Float>
        <MiniatureLantern position={[5.8, 0.3, -1.8]} scale={0.32} />

        {/* 8. 4 Animated 3D Butterflies fluttering around the perimeter */}
        <AnimatedButterfly3D
          position={[-3.5, 0.8, 1.8]}
          scale={0.24}
          color="#60a5fa"
          speed={1.6}
          flightRadius={0.9}
          phase={0}
        />
        <AnimatedButterfly3D
          position={[3.8, 1.2, 1.5]}
          scale={0.22}
          color="#f472b6"
          speed={1.9}
          flightRadius={0.8}
          phase={1.8}
        />
        <AnimatedButterfly3D
          position={[-1.8, 2.2, 0.8]}
          scale={0.2}
          color="#c084fc"
          speed={1.5}
          flightRadius={0.7}
          phase={3.2}
        />
        <AnimatedButterfly3D
          position={[2.0, 1.9, 1.0]}
          scale={0.21}
          color="#ffd166"
          speed={1.7}
          flightRadius={0.75}
          phase={4.5}
        />

        {/* 9. Glowing Firefly Swarm */}
        <StorybookFireflySwarm count={32} />
      </Canvas>
    </div>
  );
}

