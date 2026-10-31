import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from './HeroScene3D';
import {
  Code2,
  Smartphone,
  Palette,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Terminal,
  HeartPulse,
  Eye,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
const externalProps = { target: '_blank', rel: 'noopener noreferrer' };

// =========================================================================
// 1. DATA DEFINITIONS: 4 ARCHED DOORS MATCHING SPECIFICATION & PALETTE
// =========================================================================
export const DOORS_DATA = [
  {
    id: 'web-dev',
    category: 'WEB DEVELOPMENT',
    title: 'Web Systems & Cloud Infrastructure',
    tagline: 'High-availability architectures, zero-downtime pipelines & production web systems',
    color: '#1E2C3D', // Muted navy blue
    accentColor: '#162230',
    glowColor: '#4A7CA8',
    frameColor: '#FAF4ED',
    goldColor: '#E6CA7E',
    number: '01',
    description:
      'Engineered cloud deployments and production web applications built with Docker, Jenkins CI/CD pipelines, Python Flask, Gunicorn, and React.',
    projects: [
      {
        id: 'coursereg-cicd',
        title: 'Course Registration CI/CD Platform',
        badge: 'Live on Render',
        excerpt:
          'Enterprise academic registration engine with real-time seat tracking, database-enforced capacity constraints, and zero-downtime automated deployment orchestrated with Flask, Docker, Jenkins & Render.',
        tags: ['CI/CD Pipeline', 'Docker & Jenkins', 'Flask 3.1 & Gunicorn', 'Live on Render'],
        primaryLink: 'https://course-registration-dashboard.onrender.com/',
        primaryLabel: 'Launch Live Platform',
        githubLink: 'https://github.com/vaishnvikedar6-jpg',
        image: 'coursereg-cicd.jpg',
      },
      {
        id: 'cyberguard',
        title: 'CyberGuard Security Suite',
        badge: 'Oasis Infobyte Internship',
        excerpt:
          'Modern cybersecurity and vulnerability assessment landing interface designed with responsive system tokens and high-contrast accessibility.',
        tags: ['Web Security', 'Frontend Engineering', 'Responsive Design'],
        primaryLink: 'https://vaishnvikedar6-jpg.github.io/OIBSIP/Level1_Task1/',
        primaryLabel: 'View Live Site',
        githubLink: 'https://github.com/vaishnvikedar6-jpg',
      },
      {
        id: '3d-portfolio',
        title: 'Immersive 3D Creative Portfolio',
        badge: 'Creative Engineering',
        excerpt:
          'Bespoke creative developer portfolio built with real-time Three.js shaders, React Three Fiber, physics-based 3D tilt, and cinematic editorial typography.',
        tags: ['Three.js', 'React Three Fiber', 'GSAP', 'WebGL'],
        primaryLink: '#home',
        primaryLabel: 'Explore 3D Home',
      },
    ],
  },
  {
    id: 'app-dev',
    category: 'APP DEVELOPMENT',
    title: 'Mobile Architecture & Offline Systems',
    tagline: 'Resilient mobile apps, offline telemetry & seamless user onboarding',
    color: '#5E4B6E', // Dusty lavender / muted purple
    accentColor: '#4A3959',
    glowColor: '#9C7BB8',
    frameColor: '#FAF4ED',
    goldColor: '#E6CA7E',
    number: '02',
    description:
      'Purpose-built mobile applications designed for high-stress, low-connectivity environments and consumer micro-experiences.',
    projects: [
      {
        id: 'ayushlink',
        title: 'AYUSHLINK-FINAL',
        badge: 'Offline-First Health',
        excerpt:
          'Offline-first medical record & patient clinic dashboard designed for low-connectivity regions. Connect with care, records, and support — online or offline, anywhere you are.',
        tags: ['React', 'Offline-First PWA', 'Healthcare Telemetry', 'SQLite Cache'],
        primaryLink: 'https://github.com/vaishnvikedar6-jpg/Ayushlink-Final',
        primaryLabel: 'View Repository',
        githubLink: 'https://github.com/vaishnvikedar6-jpg/Ayushlink-Final',
        image: 'ayushlink.jpg',
      },
      {
        id: 'smoothiefy',
        title: 'Smoothiefy Quick-Commerce App',
        badge: 'Mobile UI Concept',
        excerpt:
          'Playful smoothie and frozen dessert ordering interface featuring dynamic drink customizers, quick cart checkout, and joyful micro-interactions.',
        tags: ['Mobile UX', 'Quick Commerce', 'Figma Prototyping', 'Micro-interactions'],
        primaryLink: '#work',
        primaryLabel: 'Inspect Mobile Flows',
        image: 'smoothiefy-1.png',
      },
    ],
  },
  {
    id: 'ui-ux',
    category: 'UI/UX DESIGN',
    title: 'Human-Centered Product Design',
    tagline: 'Research-backed interfaces, transit safety innovations & design systems',
    color: '#3E5748', // Soft sage green
    accentColor: '#2D4236',
    glowColor: '#6DA382',
    frameColor: '#FAF4ED',
    goldColor: '#E6CA7E',
    number: '03',
    description:
      'Award-winning product prototypes crafted with empathy, user psychology, meticulous design tokens, and rigorous designathon verification.',
    projects: [
      {
        id: 'avira',
        title: 'AVIRA Women Transit Safety Companion',
        badge: 'Top 6 of 193+ · Drishti Finalist',
        excerpt:
          'Designed to relieve quiet anxiety during late commutes: real-time route safety scoring, proactive 10-second "Avira Pulse" check-ins, and instant emergency dispatch workflows.',
        tags: ['Drishti Finalist', 'Figma Prototype', 'Transit Safety', 'Design Systems'],
        primaryLink:
          'https://www.figma.com/proto/4z78d3naEOI0XzCR0oc4J7/AVIRA?node-id=18-5970&p=f&t=HTtdusOLcz7s1fXC-1&scaling=scale-down&content-scaling=fixed&page-id=12%3A790&starting-point-node-id=18%3A5970',
        primaryLabel: 'Interactive Figma Prototype',
        caseStudyId: 'avira',
        image: 'avira-1.png',
      },
      {
        id: 'civic-fix',
        title: 'Civic Fix Smart Civic Reporter',
        badge: 'PixelVerse UI/UX Hackathon',
        excerpt:
          'Citizen issue-reporting app making reporting potholes and broken utilities fast, trackable, and verifiable with voice and photo inputs.',
        tags: ['Civic Tech', 'Accessibility', 'Mobile Prototype'],
        primaryLink: 'https://www.figma.com/proto/7ua1fjJwYSe9NK58SMV0k3/civic_fix?node-id=29-104',
        primaryLabel: 'Figma Prototype',
        caseStudyId: 'civic-fix',
        image: 'civic-fix-1.png',
      },
      {
        id: 'aura',
        title: 'Aura Women Wellness Companion',
        badge: 'Wellness UI Concept',
        excerpt:
          'Serene, empathetic wellness app tailored for women cycle and mental well-being tracking, utilizing calming plum tones and friendly micro-interactions.',
        tags: ['Wellness UX', 'Mobile UI', 'Figma'],
        primaryLink:
          'https://www.figma.com/proto/Ampa8dUqHSzoXFItj7pm28/Untitled?node-id=1-3&starting-point-node-id=1%3A3',
        primaryLabel: 'Explore in Figma',
        image: 'aura-1.png',
      },
    ],
  },
  {
    id: 'graphic-design',
    category: 'GRAPHIC DESIGN',
    title: 'Brand Identity & Visual Editorial',
    tagline: 'High-fashion editorial layouts, typography systems & luxury aesthetics',
    color: '#8E4F42', // Muted terracotta orange
    accentColor: '#743C31',
    glowColor: '#DA7A65',
    frameColor: '#FAF4ED',
    goldColor: '#E6CA7E',
    number: '04',
    description:
      'High-fashion editorial layouts, luxury cosmetic branding, visual systems, and typographic compositions crafted with botanical elegance.',
    projects: [
      {
        id: 'miss-beautiful',
        title: 'Miss Beautiful Luxury Editorial',
        badge: 'Web Editorial Design',
        excerpt:
          '“Precision in Every Touch” — high-fashion luxury cosmetic brand identity, typography systems, and web editorial layout.',
        tags: ['Luxury Branding', 'Editorial UI', 'Fashion Aesthetic'],
        primaryLink:
          'https://www.figma.com/proto/4z78d3naEOI0XzCR0oc4J7/AVIRA?node-id=12-790&t=FlMtIR4sxAwxxGSA-1',
        primaryLabel: 'View Project Prototype',
        image: 'miss-beautiful-1.png',
      },
      {
        id: 'design-artifacts',
        title: 'Curated Interface Artifacts & Typography Studies',
        badge: 'Design System & Typography',
        excerpt:
          'Dimensional collection of design systems, user flows, and product architectures crafted with empathy, precision, and botanical harmony.',
        tags: ['Design Systems', 'Typography', 'Figma Tokens'],
        primaryLink: '#work',
        primaryLabel: 'Inspect Gallery',
      },
    ],
  },
];

// =========================================================================
// 2. PROCEDURAL 3D GEOMETRY BUILDERS
// =========================================================================

/**
 * Builds an arched door 2D shape with a flat bottom, vertical sides, and semicircular top arch
 */
function createArchShape(width, straightHeight) {
  const shape = new THREE.Shape();
  const halfW = width / 2;
  const radius = halfW;

  shape.moveTo(-halfW, 0);
  shape.lineTo(-halfW, straightHeight);
  // absarc(x, y, radius, startAngle, endAngle, clockwise)
  shape.absarc(0, straightHeight, radius, Math.PI, 0, true);
  shape.lineTo(halfW, 0);
  shape.closePath();
  return shape;
}

/**
 * Builds an outer arch frame with the inner doorway cut out
 */
function createArchFrameShape(innerWidth, innerStraightHeight, frameThickness) {
  const shape = new THREE.Shape();
  const outerWidth = innerWidth + frameThickness * 2;
  const outerHalfW = outerWidth / 2;
  const innerHalfW = innerWidth / 2;
  const outerRadius = outerHalfW;
  const innerRadius = innerHalfW;

  // Outer boundary
  shape.moveTo(-outerHalfW, 0);
  shape.lineTo(-outerHalfW, innerStraightHeight);
  shape.absarc(0, innerStraightHeight, outerRadius, Math.PI, 0, true);
  shape.lineTo(outerHalfW, 0);
  shape.closePath();

  // Inner cutout hole
  const hole = new THREE.Path();
  hole.moveTo(-innerHalfW, 0);
  hole.lineTo(-innerHalfW, innerStraightHeight);
  hole.absarc(0, innerStraightHeight, innerRadius, Math.PI, 0, true);
  hole.lineTo(innerHalfW, 0);
  hole.closePath();

  shape.holes.push(hole);
  return shape;
}

/**
 * Generates an artistic engraved brass nameplate texture
 */
function createNameplateTexture(text, subtext) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Rich brushed brass metallic gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 160);
  grad.addColorStop(0, '#faebb7');
  grad.addColorStop(0.25, '#d4af37');
  grad.addColorStop(0.5, '#fff6d4');
  grad.addColorStop(0.75, '#b8860b');
  grad.addColorStop(1, '#e5c158');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 160);

  // Beveled border molding
  ctx.strokeStyle = '#5a4003';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 148);
  ctx.strokeStyle = '#fffceb';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 480, 128);

  // Corner brass rivets
  const rivets = [
    [24, 24],
    [488, 24],
    [24, 136],
    [488, 136],
  ];
  rivets.forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#3a2802';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rx - 1, ry - 1, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff9d6';
    ctx.fill();
  });

  // Typography with embossed drop shadow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 40px "Playfair Display", Georgia, serif';
  ctx.fillStyle = 'rgba(58, 40, 2, 0.65)';
  ctx.fillText(text.toUpperCase(), 256 + 1.5, 72 + 1.5);

  ctx.fillStyle = '#1c1102';
  ctx.fillText(text.toUpperCase(), 256, 72);

  if (subtext) {
    ctx.font = 'bold 18px "DM Sans", sans-serif';
    ctx.fillStyle = '#3a2802';
    ctx.fillText(subtext.toUpperCase(), 256, 116);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// =========================================================================
// 3. INDIVIDUAL 3D ARCHED DOOR COMPONENT
// =========================================================================
function ArchedDoor3D({ door, index, isActive, onSelect, hoveredDoor, setHoveredDoor }) {
  const hingeGroupRef = useRef();
  const rootGroupRef = useRef();
  const portalLightRef = useRef();

  const isHovered = hoveredDoor === door.id;
  const isOpened = isActive;

  // Door dimensions
  const doorWidth = 1.15;
  const straightHeight = 1.85;
  const doorRadius = doorWidth / 2; // 0.575
  const totalDoorHeight = straightHeight + doorRadius; // 2.425
  const halfW = doorWidth / 2;
  const frameThickness = 0.12;

  // 1. Door Leaf Extruded Geometry
  const doorGeometry = useMemo(() => {
    const shape = createArchShape(doorWidth, straightHeight);
    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [doorWidth, straightHeight]);

  // 2. Door Frame Extruded Geometry
  const frameGeometry = useMemo(() => {
    const shape = createArchFrameShape(doorWidth, straightHeight, frameThickness);
    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [doorWidth, straightHeight, frameThickness]);

  // 3. Chamber Backplane (Interior portal background behind the door)
  const chamberGeometry = useMemo(() => {
    const shape = createArchShape(doorWidth - 0.02, straightHeight - 0.01);
    return new THREE.ShapeGeometry(shape, 24);
  }, [doorWidth, straightHeight]);

  // 4. Gold Nameplate Texture
  const nameplateTexture = useMemo(
    () => createNameplateTexture(door.category, `SECTOR ${door.number}`),
    [door.category, door.number]
  );

  // Materials
  const materials = useMemo(() => {
    return {
      doorMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(door.color),
        roughness: 0.38,
        metalness: 0.12,
      }),
      grooveMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(door.accentColor),
        roughness: 0.45,
        metalness: 0.18,
      }),
      frameMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color(door.frameColor),
        roughness: 0.35,
        metalness: 0.08,
      }),
      goldMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E8CA72'),
        roughness: 0.18,
        metalness: 0.88,
      }),
      brassTrimMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4AF37'),
        roughness: 0.25,
        metalness: 0.75,
      }),
      chamberMat: new THREE.MeshBasicMaterial({
        color: new THREE.Color(door.accentColor),
        side: THREE.DoubleSide,
      }),
      portalGlowMat: new THREE.MeshBasicMaterial({
        color: new THREE.Color(door.glowColor),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      }),
    };
  }, [door]);

  // Spacing and Perspective Placement: 4 doors in an elegant gentle arc
  const basePosition = useMemo(() => {
    const xOffsets = [-2.65, -0.88, 0.88, 2.65];
    const zOffsets = [-0.18, 0.02, 0.02, -0.18];
    const yRotations = [0.08, 0.02, -0.02, -0.08];
    return {
      x: xOffsets[index] ?? 0,
      y: 0,
      z: zOffsets[index] ?? 0,
      rotY: yRotations[index] ?? 0,
    };
  }, [index]);

  // Frame-by-frame smooth hinge rotation & perspective hover
  useFrame((state, delta) => {
    if (!hingeGroupRef.current || !rootGroupRef.current) return;

    // Calculate target hinge angle:
    // When opened: swings open into the room at -76 degrees (-1.33 rad)
    // When hovered (unopened): cracks open slightly (-0.09 rad ~ 5 degrees) as an invitation
    // When closed: 0 rad
    const targetHingeY = isOpened ? -1.33 : isHovered ? -0.09 : 0;
    hingeGroupRef.current.rotation.y = THREE.MathUtils.damp(
      hingeGroupRef.current.rotation.y,
      targetHingeY,
      7,
      delta
    );

    // Root Group subtle hover elevation
    const targetZ = isOpened ? basePosition.z + 0.12 : isHovered ? basePosition.z + 0.15 : basePosition.z;
    const targetY = isOpened ? basePosition.y + 0.04 : isHovered ? basePosition.y + 0.05 : basePosition.y;

    rootGroupRef.current.position.z = THREE.MathUtils.damp(
      rootGroupRef.current.position.z,
      targetZ,
      6,
      delta
    );
    rootGroupRef.current.position.y = THREE.MathUtils.damp(
      rootGroupRef.current.position.y,
      targetY,
      6,
      delta
    );

    // Dynamic portal light intensity
    if (portalLightRef.current) {
      const targetIntensity = isOpened ? 3.5 : isHovered ? 1.2 : 0.2;
      portalLightRef.current.intensity = THREE.MathUtils.damp(
        portalLightRef.current.intensity,
        targetIntensity,
        5,
        delta
      );
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={[basePosition.x, basePosition.y, basePosition.z]}
      rotation={[0, basePosition.rotY, 0]}
    >
      {/* 1. ARCHED DOOR FRAME (Fixed in place) */}
      <mesh
        geometry={frameGeometry}
        material={materials.frameMat}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Decorative Outer Gold Molding Trim at Top Arch */}
      <mesh position={[0, straightHeight, 0.061]}>
        <ringGeometry args={[doorRadius + 0.005, doorRadius + 0.025, 32, 1, 0, Math.PI]} />
        <primitive object={materials.brassTrimMat} attach="material" />
      </mesh>

      {/* Threshold Step at Bottom of Frame */}
      <mesh position={[0, -0.01, 0.06]} material={materials.frameMat} receiveShadow>
        <boxGeometry args={[doorWidth + frameThickness * 2 + 0.08, 0.03, 0.16]} />
      </mesh>

      {/* 2. PORTAL CHAMBER (Behind the door) */}
      <group position={[0, 0, -0.04]}>
        {/* Interior Chamber Backdrop (Full Arch) */}
        <mesh geometry={chamberGeometry} material={materials.chamberMat} />

        {/* Luminous Core Glow Aura (Arched matching doorway) */}
        <mesh geometry={chamberGeometry} position={[0, 0, 0.005]} scale={[0.92, 0.92, 1]}>
          <primitive object={materials.portalGlowMat} attach="material" />
        </mesh>

        {/* Portal Point Light */}
        <pointLight
          ref={portalLightRef}
          position={[0, 1.3, 0.3]}
          color={door.glowColor}
          intensity={0.2}
          distance={3.5}
          decay={2}
        />

        {/* Drifting Sakura Petals inside open chamber */}
        {isOpened && (
          <group position={[0, 1.0, 0.1]}>
            <Float speed={3} rotationIntensity={1.2} floatIntensity={0.8}>
              <mesh position={[-0.2, 0.2, 0.05]} scale={[0.1, 0.1, 1]}>
                <circleGeometry args={[0.5, 5]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
              </mesh>
              <mesh position={[0.25, -0.3, 0.08]} scale={[0.08, 0.08, 1]}>
                <circleGeometry args={[0.5, 5]} />
                <meshBasicMaterial color="#fcc2d7" transparent opacity={0.85} />
              </mesh>
            </Float>
          </group>
        )}
      </group>

      {/* 3. DOOR LEAF (Hinged at the left edge: x = -halfW) */}
      <group
        ref={hingeGroupRef}
        position={[-halfW, 0, 0.02]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(door.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredDoor(door.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredDoor(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Door Body (Offset back by +halfW so left edge rests exactly on hinge pivot) */}
        <group position={[halfW, 0, 0]}>
          <mesh
            geometry={doorGeometry}
            material={materials.doorMat}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          />

          {/* VERTICAL GROOVES / INSET RECESSED PANELS */}
          {[-0.32, 0, 0.32].map((xOffset, i) => (
            <group key={i} position={[xOffset, 0.95, 0.085]}>
              <mesh material={materials.grooveMat} castShadow>
                <boxGeometry args={[0.24, 1.55, 0.015]} />
              </mesh>
            </group>
          ))}

          {/* TOP ARCH GROOVE ACCENT */}
          <mesh position={[0, straightHeight, 0.085]}>
            <ringGeometry args={[0.22, 0.44, 24, 1, 0, Math.PI]} />
            <primitive object={materials.grooveMat} attach="material" />
          </mesh>

          {/* ENGRAVED GOLD NAMEPLATE */}
          <group position={[0, 1.56, 0.09]}>
            {/* Brass Plate Foundation */}
            <mesh material={materials.brassTrimMat} castShadow>
              <boxGeometry args={[0.62, 0.18, 0.016]} />
            </mesh>
            {/* Engraved Typography Surface */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.60, 0.16]} />
              <meshStandardMaterial
                map={nameplateTexture}
                roughness={0.25}
                metalness={0.65}
              />
            </mesh>
          </group>

          {/* LUXURY GOLD HANDLE & HARDWARE */}
          <group position={[halfW - 0.12, 1.0, 0.085]}>
            {/* Polished Gold Backplate */}
            <mesh material={materials.goldMat} castShadow>
              <boxGeometry args={[0.05, 0.22, 0.015]} />
            </mesh>
            {/* Escutcheon Keyhole / Pin */}
            <mesh position={[0, -0.04, 0.012]} material={materials.goldMat}>
              <cylinderGeometry args={[0.008, 0.008, 0.02, 12]} />
            </mesh>
            {/* Gold Doorknob / Lever */}
            <mesh
              position={[-0.015, 0.03, 0.03]}
              rotation={[0, 0, Math.PI / 8]}
              material={materials.goldMat}
              castShadow
            >
              <cylinderGeometry args={[0.016, 0.016, 0.08, 16]} />
            </mesh>
            {/* Spherical Apex Knob Cap */}
            <mesh position={[-0.015, 0.07, 0.03]} material={materials.goldMat}>
              <sphereGeometry args={[0.022, 16, 16]} />
            </mesh>
          </group>

          {/* GOLD CYLINDER HINGES (Left edge) */}
          <mesh position={[-halfW + 0.01, 1.95, 0.04]} material={materials.goldMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.09, 12]} />
          </mesh>
          <mesh position={[-halfW + 0.01, 0.45, 0.04]} material={materials.goldMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.09, 12]} />
          </mesh>
        </group>
      </group>

      {/* 4. SOFT CONTACT SHADOW ON FLOOR */}
      <mesh position={[0, -0.02, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.55, 0.35]} />
        <meshBasicMaterial color="#3e1a2e" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// =========================================================================
// 4. CAMERA CONTROLLER WITH SMOOTH DOLLY & PERSPECTIVE
// =========================================================================
function DoorsCameraController({ activeDoorId, mouse }) {
  useFrame((state, delta) => {
    const activeIndex = DOORS_DATA.findIndex((d) => d.id === activeDoorId);

    let targetCamX = 0;
    let targetCamY = 1.28;
    let targetCamZ = 5.35; // Majestic wide perspective showing all 4 doors
    let targetLookX = 0;
    let targetLookY = 1.2;

    if (activeIndex !== -1) {
      const xOffsets = [-2.65, -0.88, 0.88, 2.65];
      // Focus active door while keeping background doors visible
      targetCamX = xOffsets[activeIndex] * 0.65 + mouse.current.x * 0.15;
      targetCamY = 1.25 + mouse.current.y * 0.1;
      targetCamZ = 4.25; // Gentle dolly forward
      targetLookX = xOffsets[activeIndex] * 0.85;
      targetLookY = 1.22;
    } else {
      // Gentle parallax with mouse
      targetCamX = mouse.current.x * 0.45;
      targetCamY = 1.28 + mouse.current.y * 0.22;
    }

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetCamX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 4, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamZ, 4, delta);

    state.camera.lookAt(targetLookX, targetLookY, 0);
  });

  return null;
}

// =========================================================================
// 5. MAIN CINEMATIC 3D DOORS SECTION EXPORT
// =========================================================================
export default function CinematicDoors3D({ openCaseStudy, LINKS }) {
  const [activeDoorId, setActiveDoorId] = useState(null); // Show panoramic view of all 4 doors first!
  const [hoveredDoor, setHoveredDoor] = useState(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const activeDoor = useMemo(() => {
    return DOORS_DATA.find((d) => d.id === activeDoorId) || null;
  }, [activeDoorId]);

  const handleSelectDoor = (doorId) => {
    if (activeDoorId === doorId) {
      // Toggle close
      setActiveDoorId(null);
    } else {
      setActiveDoorId(doorId);
    }
  };

  return (
    <div className="cinematic-doors-wrapper" id="doors-container">
      {/* Editorial Section Header */}
      <div className="doors-header-block">
        <div className="doors-eyebrow">
          <Sparkles size={16} aria-hidden="true" /> ARCHITECTURAL 3D PORTALS
        </div>
        <h2 className="doors-main-title serif">
          Magic happens behind the <span className="pink-italic">doors.</span>
        </h2>
        <p className="doors-lead-text">
          Step into each tall arched doorway to enter a bespoke creative chamber. Actual 3D physical
          geometry, real hinge-based rotation, and genuine production projects.
        </p>

        {/* Interactive Door Filter Navigation Pills */}
        <div className="doors-nav-pills" role="tablist" aria-label="Portal categories">
          {DOORS_DATA.map((door) => {
            const isSelected = activeDoorId === door.id;
            return (
              <button
                key={door.id}
                role="tab"
                aria-selected={isSelected}
                className={`door-pill-btn ${isSelected ? 'active' : ''}`}
                style={{
                  '--pill-accent': door.glowColor,
                }}
                onClick={() => handleSelectDoor(door.id)}
              >
                <span className="door-pill-indicator" style={{ background: door.color }} />
                <span className="door-pill-text">{door.category}</span>
                {isSelected && <span className="door-pill-open-badge">OPEN</span>}
              </button>
            );
          })}
          {activeDoorId && (
            <button
              className="door-pill-btn close-all"
              onClick={() => setActiveDoorId(null)}
              title="Close all doors"
            >
              <RotateCcw size={14} /> Close All
            </button>
          )}
        </div>
      </div>

      {/* Real-time 3D Three.js Arched Doors Stage */}
      <div className="doors-3d-stage">
        {webGLSupported ? (
          <Canvas
            camera={{ position: [0, 1.25, 4.6], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            shadows
            style={{ width: '100%', height: '520px' }}
          >
            <ambientLight intensity={1.4} />
            <directionalLight
              position={[5, 8, 6]}
              intensity={2.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-camera-near={0.5}
              shadow-camera-far={20}
              shadow-camera-left={-4}
              shadow-camera-right={4}
              shadow-camera-top={4}
              shadow-camera-bottom={-4}
            />
            <pointLight position={[-4, 3, 2]} intensity={1.2} color="#f8cde5" />
            <pointLight position={[4, 2, 2]} intensity={1.2} color="#e8d39a" />

            <DoorsCameraController activeDoorId={activeDoorId} mouse={mouse} />

            {/* 4 Arched 3D Doors */}
            {DOORS_DATA.map((door, idx) => (
              <ArchedDoor3D
                key={door.id}
                door={door}
                index={idx}
                isActive={activeDoorId === door.id}
                hoveredDoor={hoveredDoor}
                setHoveredDoor={setHoveredDoor}
                onSelect={handleSelectDoor}
              />
            ))}
          </Canvas>
        ) : (
          <div className="webgl-fallback-doors">
            <p>Interactive 3D Doors are ready to explore.</p>
          </div>
        )}

        {/* Interactive Floating Hint */}
        <div className="doors-stage-hint" aria-hidden="true">
          <span>
            {activeDoor
              ? `✨ Exploring ${activeDoor.category} · Click door or 'Close Portal' to return to overview`
              : 'Click any 3D door to swing open on its hinge & reveal the projects inside'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          6. "MAGIC BEHIND THE DOOR" DYNAMIC PROJECT DRAWER
          ========================================================================= */}
      {activeDoor && (
        <div
          className="door-chamber-reveal"
          style={{
            '--chamber-accent': activeDoor.glowColor,
            '--chamber-bg': activeDoor.color,
          }}
        >
          <div className="chamber-header">
            <div className="chamber-left">
              <span className="chamber-badge" style={{ background: activeDoor.color }}>
                {activeDoor.category} · SECTOR {activeDoor.number}
              </span>
              <h3 className="chamber-title serif">{activeDoor.title}</h3>
              <p className="chamber-tagline">{activeDoor.tagline}</p>
            </div>
            <div className="chamber-right">
              <button
                className="chamber-close-btn"
                onClick={() => setActiveDoorId(null)}
                aria-label="Close portal"
              >
                Close Portal ×
              </button>
            </div>
          </div>

          <div className="chamber-projects-grid">
            {activeDoor.projects.map((proj) => (
              <div key={proj.id} className="chamber-project-card">
                {proj.image && (
                  <div className="chamber-img-wrap">
                    <img
                      src={asset(proj.image)}
                      alt={proj.title}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="chamber-card-content">
                  <div className="chamber-card-meta">
                    <span className="chamber-card-badge">{proj.badge}</span>
                  </div>
                  <h4 className="chamber-card-title serif">{proj.title}</h4>
                  <p className="chamber-card-excerpt">{proj.excerpt}</p>
                  <div className="chamber-card-tags">
                    {proj.tags.map((t) => (
                      <span key={t} className="chamber-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="chamber-actions">
                    {proj.caseStudyId && openCaseStudy ? (
                      <button
                        className="pill pill-primary pill-sm"
                        onClick={(e) => openCaseStudy(proj.caseStudyId, e.currentTarget)}
                      >
                        Case Study <ArrowRight size={14} />
                      </button>
                    ) : null}

                    {proj.primaryLink && !proj.primaryLink.startsWith('#') ? (
                      <a
                        href={proj.primaryLink}
                        {...externalProps}
                        className="pill pill-primary pill-sm"
                      >
                        {proj.primaryLabel} <ArrowUpRight size={14} />
                      </a>
                    ) : proj.primaryLink ? (
                      <a href={proj.primaryLink} className="pill pill-primary pill-sm">
                        {proj.primaryLabel} <ArrowRight size={14} />
                      </a>
                    ) : null}

                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        {...externalProps}
                        className="pill pill-outline pill-sm"
                      >
                        GitHub <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
