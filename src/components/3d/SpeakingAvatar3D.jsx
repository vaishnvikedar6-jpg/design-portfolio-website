import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Camera,
  Bot,
  MessageCircle,
} from 'lucide-react';
import { isWebGLAvailable } from './HeroScene3D';
import InteractiveCard3D from './InteractiveCard3D';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

// =========================================================================
// INTRODUCTION SCRIPT & SEGMENTS (Synced with vaishnavi_intro_voice.mp3)
// =========================================================================
export const INTRO_SCRIPT_SEGMENTS = [
  {
    id: 1,
    text: "Hey there! Welcome to Vaishnavi's creative world!",
    startTime: 0.0,
    endTime: 3.65,
    animation: 'Talking_1',
    gesture: 'wave',
  },
  {
    id: 2,
    text: "I'm here to introduce Vaishnavi Kedar, a Computer Engineering student who loves creativity, technology, Data Analytics and UI/UX Design.",
    startTime: 3.65,
    endTime: 13.87,
    animation: 'Talking_2',
    gesture: 'explain',
  },
  {
    id: 3,
    text: "She enjoys transforming ideas into meaningful digital experiences and building solutions that make a difference.",
    startTime: 13.87,
    endTime: 20.71,
    animation: 'Talking_0',
    gesture: 'heart',
  },
  {
    id: 4,
    text: "From innovative projects like AyushLink to creative design experiments, she's always exploring something new.",
    startTime: 20.71,
    endTime: 27.65,
    animation: 'Talking_1',
    gesture: 'point',
  },
  {
    id: 5,
    text: "So, come along and explore her journey, projects and achievements!",
    startTime: 27.65,
    endTime: 32.38,
    animation: 'Talking_2',
    gesture: 'welcome',
  },
];

export const TOTAL_INTRO_DURATION = 32.38;

// =========================================================================
// PROCEDURAL CANVAS TEXTURES FOR DUAL CURVED CODE & DESIGN MONITORS
// =========================================================================
function createCodeScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  // Dark IDE Background
  ctx.fillStyle = '#14171f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Window Top Title Bar
  ctx.fillStyle = '#1b1e28';
  ctx.fillRect(0, 0, canvas.width, 42);

  // Window Controls (Red, Yellow, Green Dots)
  const dots = ['#ff5f56', '#ffbd2e', '#27c93f'];
  dots.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(26 + i * 22, 21, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // Active Editor Tab
  ctx.fillStyle = '#14171f';
  ctx.fillRect(110, 8, 160, 34);
  ctx.fillStyle = '#de5d95';
  ctx.fillRect(110, 39, 160, 3);
  ctx.font = 'bold 15px "JetBrains Mono", Menlo, monospace';
  ctx.fillStyle = '#f8f9fc';
  ctx.fillText('Vaishnavi.tsx', 130, 29);

  ctx.fillStyle = '#8a93a8';
  ctx.font = '14px "JetBrains Mono", Menlo, monospace';
  ctx.fillText('AyushLink.ts', 290, 29);

  // Line Numbers Sidebar
  ctx.fillStyle = '#10131a';
  ctx.fillRect(0, 42, 60, canvas.height - 42);

  // Code Lines
  const codeLines = [
    { num: '1', tokens: [{ text: 'import', color: '#ff7b72' }, { text: ' { UIUX, Analytics } ', color: '#d2a8ff' }, { text: 'from', color: '#ff7b72' }, { text: " '@engineering';", color: '#a5d6ff' }] },
    { num: '2', tokens: [] },
    { num: '3', tokens: [{ text: 'export const ', color: '#ff7b72' }, { text: 'VaishnaviKedar ', color: '#79c0ff' }, { text: '= {', color: '#f0f6fc' }] },
    { num: '4', tokens: [{ text: '  role: ', color: '#7ee787' }, { text: "'Computer Engineer & Designer',", color: '#a5d6ff' }] },
    { num: '5', tokens: [{ text: '  passions: ', color: '#7ee787' }, { text: "['UI/UX', 'Full-Stack', '3D Web'],", color: '#a5d6ff' }] },
    { num: '6', tokens: [{ text: '  flagship: ', color: '#7ee787' }, { text: "'AyushLink Healthcare Platform',", color: '#a5d6ff' }] },
    { num: '7', tokens: [{ text: '  achievements: ', color: '#7ee787' }, { text: "'Top 6 / 193+ Drishti Finalist',", color: '#a5d6ff' }] },
    { num: '8', tokens: [{ text: '  buildExperience: ', color: '#d2a8ff' }, { text: '() => ({', color: '#f0f6fc' }] },
    { num: '9', tokens: [{ text: '    impact: ', color: '#ffa657' }, { text: "'Thoughtful Digital Solutions',", color: '#a5d6ff' }] },
    { num: '10', tokens: [{ text: '    status: ', color: '#ffa657' }, { text: "'Open to Collaborations ✨'", color: '#7ee787' }] },
    { num: '11', tokens: [{ text: '  })', color: '#f0f6fc' }] },
    { num: '12', tokens: [{ text: '};', color: '#f0f6fc' }] },
  ];

  ctx.font = '16px "JetBrains Mono", Consolas, monospace';
  codeLines.forEach((line, idx) => {
    const y = 82 + idx * 34;
    // Line Number
    ctx.fillStyle = '#484f58';
    ctx.fillText(line.num.padStart(2, ' '), 18, y);

    // Code Tokens
    let x = 80;
    line.tokens.forEach((token) => {
      ctx.fillStyle = token.color;
      ctx.fillText(token.text, x, y);
      x += ctx.measureText(token.text).width;
    });
  });

  // Glowing Mini-map on Right
  ctx.fillStyle = '#10131a';
  ctx.fillRect(canvas.width - 110, 42, 110, canvas.height - 42);
  for (let i = 0; i < 22; i++) {
    ctx.fillStyle = i % 3 === 0 ? 'rgba(222, 93, 149, 0.45)' : 'rgba(121, 192, 255, 0.28)';
    const w = 40 + (Math.sin(i * 1.5) + 1) * 24;
    ctx.fillRect(canvas.width - 95, 60 + i * 18, w, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createDesignScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  // Dark Modern Figma Canvas
  ctx.fillStyle = '#18151f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Toolbar
  ctx.fillStyle = '#221e2c';
  ctx.fillRect(0, 0, canvas.width, 44);

  ctx.fillStyle = '#de5d95';
  ctx.beginPath();
  ctx.arc(28, 22, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8f0f5';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('AyushLink — Design System & Prototype', 52, 28);

  ctx.fillStyle = '#8c8299';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('Frame 1 • 100%', canvas.width - 120, 27);

  // Center Mockup Card 1: AyushLink Platform Card
  ctx.fillStyle = '#262132';
  ctx.roundRect(60, 75, 420, 440, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(222, 93, 149, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Card Header Banner
  ctx.fillStyle = 'rgba(222, 93, 149, 0.18)';
  ctx.roundRect(80, 95, 380, 90, 10);
  ctx.fill();
  ctx.fillStyle = '#ff8cb8';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('AyushLink Healthcare', 100, 134);
  ctx.fillStyle = '#e8d8e2';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('Smart Patient-Doctor Interface & Tele-Consult', 100, 160);

  // Analytics Metric Badges
  const badges = [
    { label: 'Top 6 Finalist', val: 'Drishti 2024', color: '#ff6b9d' },
    { label: 'Active Tele-med', val: 'Real-Time WebRTC', color: '#20c997' },
    { label: 'UX Usability', val: '98.6% Score', color: '#fcc419' },
  ];
  badges.forEach((b, idx) => {
    const by = 210 + idx * 82;
    ctx.fillStyle = '#1d1927';
    ctx.roundRect(80, by, 380, 68, 8);
    ctx.fill();

    ctx.fillStyle = b.color;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText(b.val, 100, by + 30);
    ctx.fillStyle = '#a89db5';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(b.label, 100, by + 52);
  });

  // Center Mockup Card 2: Interactive Waveform / Analytics
  ctx.fillStyle = '#262132';
  ctx.roundRect(510, 75, 450, 440, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(121, 192, 255, 0.35)';
  ctx.stroke();

  ctx.fillStyle = '#79c0ff';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText('User Engagement & Flow Analytics', 535, 118);

  // Vibrant Pink/Purple Gradient Graph Line
  ctx.beginPath();
  ctx.moveTo(540, 380);
  const points = [
    [540, 360], [600, 310], [660, 340], [720, 240], [780, 270], [840, 180], [920, 150]
  ];
  points.forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.strokeStyle = '#de5d95';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Glow under graph
  ctx.lineTo(920, 420);
  ctx.lineTo(540, 420);
  ctx.closePath();
  ctx.fillStyle = 'rgba(222, 93, 149, 0.15)';
  ctx.fill();

  // Graph Data Nodes
  points.forEach(([px, py]) => {
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#de5d95';
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// =========================================================================
// 1. CREATIVE WORKSPACE: MODERN STANDING DESK WITH DUAL CODE MONITORS
// (Exact match to the creative workspace shown in the user's reference reel)
// =========================================================================
function CreativeWorkspaceDesk() {
  const codeTexture = useMemo(() => createCodeScreenTexture(), []);
  const designTexture = useMemo(() => createDesignScreenTexture(), []);

  return (
    <group position={[-0.26, 0, -0.15]} rotation={[0, 0.18, 0]}>
      {/* 1. SOLID WALNUT WOOD DESKTOP */}
      <mesh position={[0, 0.94, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.42, 0.04, 0.68]} />
        <meshStandardMaterial
          color="#3e281e" // Warm natural walnut wood
          roughness={0.36}
          metalness={0.04}
        />
      </mesh>

      {/* Desktop Edge Bevel Trim */}
      <mesh position={[0, 0.92, 0.34]} castShadow>
        <boxGeometry args={[1.42, 0.015, 0.01]} />
        <meshStandardMaterial color="#22150f" roughness={0.4} />
      </mesh>

      {/* 2. DUAL MOTORIZED TELESCOPING LEGS (Matte Slate Metal) */}
      {/* Left Leg */}
      <group position={[-0.48, 0, 0]}>
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[0.07, 0.90, 0.07]} />
          <meshStandardMaterial color="#1e2229" roughness={0.35} metalness={0.7} />
        </mesh>
        {/* Foot Base */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 0.038, 0.52]} />
          <meshStandardMaterial color="#16191f" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.48, 0, 0]}>
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[0.07, 0.90, 0.07]} />
          <meshStandardMaterial color="#1e2229" roughness={0.35} metalness={0.7} />
        </mesh>
        {/* Foot Base */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 0.038, 0.52]} />
          <meshStandardMaterial color="#16191f" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* 3. DUAL GAS-SPRING ERGONOMIC MONITOR ARM */}
      <mesh position={[0, 1.08, -0.26]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.32, 16]} />
        <meshStandardMaterial color="#1a1d22" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.97, -0.26]} castShadow>
        <boxGeometry args={[0.09, 0.05, 0.08]} />
        <meshStandardMaterial color="#111317" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Left Articulating Arm */}
      <mesh position={[-0.15, 1.22, -0.20]} rotation={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.26, 0.024, 0.024]} />
        <meshStandardMaterial color="#1a1d22" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Right Articulating Arm */}
      <mesh position={[0.15, 1.22, -0.20]} rotation={[0, -0.35, 0]} castShadow>
        <boxGeometry args={[0.26, 0.024, 0.024]} />
        <meshStandardMaterial color="#1a1d22" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 4. DUAL CURVED ULTRA-WIDE MONITORS */}
      {/* MONITOR 1 (LEFT): LIVE VS CODE EDITOR */}
      <group position={[-0.30, 1.28, -0.10]} rotation={[0, 0.19, 0]}>
        {/* Bezel Outer Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.35, 0.02]} />
          <meshStandardMaterial color="#13151a" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.56, 0.33]} />
          <meshBasicMaterial map={codeTexture} toneMapped={false} />
        </mesh>
        {/* Soft Ambient Screen Glow */}
        <pointLight position={[0, 0, 0.1]} intensity={0.65} color="#79c0ff" distance={1.2} />
      </group>

      {/* MONITOR 2 (RIGHT): FIGMA UI / DESIGN ANALYTICS */}
      <group position={[0.30, 1.28, -0.10]} rotation={[0, -0.19, 0]}>
        {/* Bezel Outer Frame */}
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.35, 0.02]} />
          <meshStandardMaterial color="#13151a" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.56, 0.33]} />
          <meshBasicMaterial map={designTexture} toneMapped={false} />
        </mesh>
        {/* Soft Ambient Screen Glow */}
        <pointLight position={[0, 0, 0.1]} intensity={0.65} color="#de5d95" distance={1.2} />
      </group>

      {/* 5. DESK ACCESSORIES (FELT PAD, KEYBOARD, MOUSE, CERAMIC MUG) */}
      {/* Dark Felt Desk Mat */}
      <mesh position={[0, 0.962, 0.06]} receiveShadow>
        <boxGeometry args={[0.90, 0.005, 0.38]} />
        <meshStandardMaterial color="#1a1d24" roughness={0.82} />
      </mesh>

      {/* Mechanical Keyboard */}
      <mesh position={[-0.08, 0.972, 0.10]} castShadow>
        <boxGeometry args={[0.32, 0.014, 0.12]} />
        <meshStandardMaterial color="#262930" roughness={0.5} />
      </mesh>

      {/* Wireless Ergonomic Mouse */}
      <mesh position={[0.22, 0.974, 0.10]} castShadow>
        <boxGeometry args={[0.065, 0.018, 0.095]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* Designer Pastel Pink Ceramic Coffee Mug */}
      <mesh position={[-0.52, 0.998, 0.12]} castShadow>
        <cylinderGeometry args={[0.038, 0.032, 0.076, 20]} />
        <meshStandardMaterial color="#f7c5d5" roughness={0.35} />
      </mesh>

      {/* Minimalist Potted Succulent Plant on Left Desk Corner */}
      <group position={[-0.54, 0.98, -0.18]}>
        <mesh position={[0, 0.025, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.028, 0.05, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Succulent Leaves */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.034, 12, 12]} />
          <meshStandardMaterial color="#40c057" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 2. EXACT REFERENCE 3D DIGITAL HUMAN FEMALE PRESENTER
// Dark brown side-parted bob, light pastel pink blazer, white inner top, gold earrings
// MeshPhysicalMaterial with Sheen for tailored fabric, clearcoat for glossy hair & eyes
// =========================================================================
function ExactReferencePresenter3D({ isSpeaking, activeAnimName, mouse }) {
  const avatarGroupRef = useRef();

  // Load rigged human presenter and mocap animations
  const { scene, nodes } = useGLTF(asset('avatar_vaishnavi_presenter.glb'));
  const { animations } = useGLTF(asset('animations.glb'));
  const { actions } = useAnimations(animations, avatarGroupRef);

  const blinkTimer = useRef(0);
  const currentActionRef = useRef(null);

  // Exact Visual Styling: Dark pink blazer, long hair, dark slate trousers
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Hide glasses - reference character has no glasses
        if (child.name === 'Wolf3D_Glasses') {
          child.visible = false;
          return;
        }

        // 1. Long Hair: Elongate hair mesh down past the shoulders into long locks
        if (child.name === 'Wolf3D_Hair') {
          if (!child.userData.extended && child.geometry?.attributes?.position) {
            child.userData.extended = true;
            const pos = child.geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
              const y = pos.getY(i);
              // Smoothly stretch lower portion of hair downward over shoulders
              if (y < 1.68) {
                const factor = Math.min(1.0, (1.68 - y) / (1.68 - 1.45));
                // Extend tips down to chest level (long hair)
                const newY = y - factor * 0.26;
                pos.setY(i, newY);
                // Curve naturally over shoulders
                const z = pos.getZ(i);
                if (z > 0.01) {
                  pos.setZ(i, z + factor * 0.035);
                }
              }
            }
            pos.needsUpdate = true;
            child.geometry.computeVertexNormals();
          }

          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#24150f'), // Rich deep brunette
            roughness: 0.42,
            metalness: 0.06,
            clearcoat: 0.45,
            clearcoatRoughness: 0.22,
            normalMap: child.material?.normalMap,
          });
        }

        // 2. Bodice / Kurti: Light pink Indo-Western midi dress top
        if (child.name === 'Wolf3D_Outfit_Top') {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#f29bbd'), // Elegant, vibrant light pastel pink
            roughness: 0.44,
            metalness: 0.03,
            sheen: 0.85,
            sheenColor: new THREE.Color('#ffe8f2'), // Soft luminous dewy silk sheen
            sheenRoughness: 0.35,
            clearcoat: 0.08,
            normalMap: child.material?.normalMap,
          });
        }

        // 3. Trousers / Midi Skirt Base: Seamless matching light pink
        if (child.name === 'Wolf3D_Outfit_Bottom') {
          child.material = child.material.clone();
          child.material.color.set('#f4a3c3'); // Matching light pink
          child.material.roughness = 0.48;
          child.material.metalness = 0.02;
        }

        // 4. Footwear: Elegant light pink & gold embellished juttis
        if (child.name === 'Wolf3D_Outfit_Footwear') {
          child.material = child.material.clone();
          child.material.color.set('#f7bcd5');
          child.material.roughness = 0.35;
        }

        // 5. Face & Skin: Soft natural human complexion with warm subsurface rolloff
        if (child.name === 'Wolf3D_Head' || child.name === 'Wolf3D_Body') {
          child.material.roughness = 0.50;
          child.material.metalness = 0.0;
        }

        // 6. Eyes: Clear corneal specular reflection & depth
        if (child.name === 'EyeLeft' || child.name === 'EyeRight') {
          child.material.roughness = 0.08;
          child.material.metalness = 0.0;
        }
      }
    });
  }, [scene]);

  // Attach small elegant gold hoop earrings directly to head bone
  useEffect(() => {
    if (!nodes.Head) return;
    if (nodes.Head.getObjectByName('LeftEarringGold')) return;

    const earMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'),
      metalness: 0.94,
      roughness: 0.16,
    });
    const earGeo = new THREE.TorusGeometry(0.012, 0.0032, 12, 24);

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.name = 'LeftEarringGold';
    leftEar.position.set(-0.088, -0.018, -0.015);
    leftEar.rotation.set(0, 0, 0.12);
    nodes.Head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.name = 'RightEarringGold';
    rightEar.position.set(0.088, -0.018, -0.015);
    rightEar.rotation.set(0, 0, -0.12);
    nodes.Head.add(rightEar);

    // Attach supplementary lush long hair strands flowing down past shoulders
    if (!nodes.Head.getObjectByName('LongHairTresses')) {
      const hairGroup = new THREE.Group();
      hairGroup.name = 'LongHairTresses';

      const hairMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#24150f'),
        roughness: 0.42,
        metalness: 0.06,
        clearcoat: 0.45,
        clearcoatRoughness: 0.22,
      });

      // Left flowing lock cascading down over left shoulder
      const leftCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.088, 0.04, 0.02),
        new THREE.Vector3(-0.096, -0.06, 0.04),
        new THREE.Vector3(-0.086, -0.16, 0.065),
        new THREE.Vector3(-0.068, -0.28, 0.08),
        new THREE.Vector3(-0.052, -0.38, 0.085),
      ]);
      const leftGeo = new THREE.TubeGeometry(leftCurve, 20, 0.022, 8, false);
      hairGroup.add(new THREE.Mesh(leftGeo, hairMat));

      // Right flowing lock cascading down over right shoulder
      const rightCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.088, 0.04, 0.02),
        new THREE.Vector3(0.096, -0.06, 0.04),
        new THREE.Vector3(0.086, -0.16, 0.065),
        new THREE.Vector3(0.068, -0.28, 0.08),
        new THREE.Vector3(0.052, -0.38, 0.085),
      ]);
      const rightGeo = new THREE.TubeGeometry(rightCurve, 20, 0.022, 8, false);
      hairGroup.add(new THREE.Mesh(rightGeo, hairMat));

      // Back cascading locks
      const backLeftCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.06, 0.06, -0.07),
        new THREE.Vector3(-0.07, -0.10, -0.085),
        new THREE.Vector3(-0.06, -0.24, -0.095),
        new THREE.Vector3(-0.04, -0.38, -0.10),
      ]);
      const backLeftGeo = new THREE.TubeGeometry(backLeftCurve, 16, 0.026, 8, false);
      hairGroup.add(new THREE.Mesh(backLeftGeo, hairMat));

      const backRightCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.06, 0.06, -0.07),
        new THREE.Vector3(0.07, -0.10, -0.085),
        new THREE.Vector3(0.06, -0.24, -0.095),
        new THREE.Vector3(0.04, -0.38, -0.10),
      ]);
      const backRightGeo = new THREE.TubeGeometry(backRightCurve, 16, 0.026, 8, false);
      hairGroup.add(new THREE.Mesh(backRightGeo, hairMat));

      nodes.Head.add(hairGroup);
    }
  }, [nodes.Head]);

  // Attach delicate gold pendant necklace to neck bone
  useEffect(() => {
    if (!nodes.Neck) return;
    if (nodes.Neck.getObjectByName('IndoWesternNecklace')) return;

    const necklaceGroup = new THREE.Group();
    necklaceGroup.name = 'IndoWesternNecklace';

    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'),
      metalness: 0.94,
      roughness: 0.16,
    });

    // Dainty gold chain around neckline
    const chainGeo = new THREE.TorusGeometry(0.062, 0.0028, 8, 24);
    const chain = new THREE.Mesh(chainGeo, goldMat);
    chain.position.set(0, 0.015, -0.01);
    chain.rotation.set(Math.PI / 2 - 0.2, 0, 0);
    necklaceGroup.add(chain);

    // Small radiant gold teardrop pendant
    const pendant = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.012, 12), goldMat);
    pendant.position.set(0, -0.042, 0.054);
    pendant.rotation.set(Math.PI, 0, 0);
    necklaceGroup.add(pendant);

    nodes.Neck.add(necklaceGroup);
  }, [nodes.Neck]);

  // Attach flowing Light Pink Indo-Western Midi Dress Skirt to hips bone (Hips)
  useEffect(() => {
    if (!nodes.Hips) return;
    if (nodes.Hips.getObjectByName('IndoWesternMidiSkirt')) return;

    const skirtGroup = new THREE.Group();
    skirtGroup.name = 'IndoWesternMidiSkirt';

    const dressFabricMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f29bbd'), // Light pastel pink georgette
      roughness: 0.44,
      metalness: 0.03,
      sheen: 0.85,
      sheenColor: new THREE.Color('#ffe8f2'),
      sheenRoughness: 0.35,
      side: THREE.DoubleSide,
    });

    const goldBorderMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd700'),
      metalness: 0.92,
      roughness: 0.22,
    });

    // 1. Flowing flared A-line midi skirt drape down to mid-calf
    const skirtGeo = new THREE.CylinderGeometry(0.165, 0.35, 0.54, 32, 1, true);
    const skirtMesh = new THREE.Mesh(skirtGeo, dressFabricMat);
    skirtMesh.position.set(0, -0.22, 0);
    skirtMesh.castShadow = true;
    skirtMesh.receiveShadow = true;
    skirtGroup.add(skirtMesh);

    // 2. Delicate gold zari embroidered border band along midi skirt hem (flat horizontal ring)
    const hemRingGeo = new THREE.TorusGeometry(0.352, 0.005, 8, 32);
    const hemRing = new THREE.Mesh(hemRingGeo, goldBorderMat);
    hemRing.position.set(0, -0.49, 0);
    hemRing.rotation.set(Math.PI / 2, 0, 0);
    skirtGroup.add(hemRing);

    // 3. Embroidered gold waistband / belt accentuating the waistline (flat horizontal ring)
    const waistRingGeo = new THREE.TorusGeometry(0.166, 0.005, 8, 32);
    const waistRing = new THREE.Mesh(waistRingGeo, goldBorderMat);
    waistRing.position.set(0, 0.045, 0);
    waistRing.rotation.set(Math.PI / 2, 0, 0);
    skirtGroup.add(waistRing);

    nodes.Hips.add(skirtGroup);
  }, [nodes.Hips]);

  // Smooth MoCap Animation Transitions (Idle vs Talking Gestures)
  useEffect(() => {
    if (!actions) return;

    const targetAnimName = isSpeaking ? (activeAnimName || 'Talking_1') : 'Idle';
    const targetAction = actions[targetAnimName] || actions['Idle'];

    if (targetAction && currentActionRef.current !== targetAction) {
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(0.45);
      }
      targetAction.reset().fadeIn(0.45).play();
      currentActionRef.current = targetAction;
    }
  }, [actions, isSpeaking, activeAnimName]);

  // Frame-by-Frame Speech Lip-Sync, Natural Blinking, Smile & Head Tracking
  useFrame((state, delta) => {
    const headMesh = nodes.Wolf3D_Head;
    const teethMesh = nodes.Wolf3D_Teeth;

    if (headMesh && headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      const dict = headMesh.morphTargetDictionary;
      const infl = headMesh.morphTargetInfluences;
      const teethDict = teethMesh?.morphTargetDictionary;
      const teethInfl = teethMesh?.morphTargetInfluences;

      const setMorph = (name, targetVal, lerpSpeed = 0.2) => {
        if (dict[name] !== undefined) {
          infl[dict[name]] = THREE.MathUtils.lerp(infl[dict[name]] || 0, targetVal, lerpSpeed);
          if (teethDict && teethDict[name] !== undefined && teethInfl) {
            teethInfl[teethDict[name]] = infl[dict[name]];
          }
        }
      };

      // 1. Natural Human Blinking (~3.4s interval, 0.16s smooth eyelid motion)
      blinkTimer.current += delta;
      let blinkVal = 0;
      if (blinkTimer.current > 3.4) {
        const blinkPhase = (blinkTimer.current - 3.4) / 0.16;
        if (blinkPhase <= 1) {
          blinkVal = Math.sin(blinkPhase * Math.PI);
        } else {
          blinkTimer.current = Math.random() * 0.7;
        }
      }
      setMorph('eyeBlinkLeft', blinkVal, 0.38);
      setMorph('eyeBlinkRight', blinkVal, 0.38);

      // 2. Soft, Friendly, Confident Smile & Arched Brows (Exact Match to Reference)
      setMorph('mouthSmileLeft', 0.28, 0.08);
      setMorph('mouthSmileRight', 0.28, 0.08);
      setMorph('browInnerUp', 0.14, 0.08);

      // 3. Realistic Speech Viseme Synchronization
      if (isSpeaking) {
        const t = state.clock.elapsedTime * 14;
        const jaw = Math.max(0, Math.sin(t) * 0.45 + Math.sin(t * 2.1) * 0.2 + 0.12);
        const aa = Math.max(0, Math.sin(t * 1.3) * 0.55 + 0.15);
        const O = Math.max(0, Math.sin(t * 0.85 + 1.2) * 0.38 + 0.1);
        const E = Math.max(0, Math.sin(t * 1.6 + 0.5) * 0.35 + 0.08);
        const U = Math.max(0, Math.sin(t * 0.65 + 2.0) * 0.28);

        setMorph('jawOpen', jaw, 0.26);
        setMorph('viseme_aa', aa, 0.25);
        setMorph('viseme_O', O, 0.22);
        setMorph('viseme_E', E, 0.22);
        setMorph('viseme_U', U, 0.2);
      } else {
        setMorph('jawOpen', 0, 0.16);
        setMorph('viseme_aa', 0, 0.16);
        setMorph('viseme_O', 0, 0.16);
        setMorph('viseme_E', 0, 0.16);
        setMorph('viseme_U', 0, 0.16);
      }
    }

    // 4. Natural Head & Neck Mouse Tracking (Facing slightly forward-left toward visitor)
    if (nodes.Head) {
      const targetRotY = (mouse.current?.x || 0) * 0.20 - 0.08;
      const targetRotX = -(mouse.current?.y || 0) * 0.12;
      nodes.Head.rotation.y = THREE.MathUtils.lerp(nodes.Head.rotation.y, targetRotY, 0.06);
      nodes.Head.rotation.x = THREE.MathUtils.lerp(nodes.Head.rotation.x, targetRotX, 0.06);
      nodes.Head.rotation.z = THREE.MathUtils.lerp(nodes.Head.rotation.z, -0.05, 0.04);
    }
    if (nodes.Neck) {
      const targetRotY = (mouse.current?.x || 0) * 0.08 - 0.04;
      const targetRotX = -(mouse.current?.y || 0) * 0.06;
      nodes.Neck.rotation.y = THREE.MathUtils.lerp(nodes.Neck.rotation.y, targetRotY, 0.06);
      nodes.Neck.rotation.x = THREE.MathUtils.lerp(nodes.Neck.rotation.x, targetRotX, 0.06);
    }
  });

  return (
    <group
      ref={avatarGroupRef}
      position={[0.34, 0, 0.08]}
      rotation={[0, -0.22, 0]}
      scale={0.97}
      dispose={null}
    >
      {/* Skinned Human Mesh with Arms, Hands, Bob Hair, Blazer, Dark Pants, White Sneakers */}
      <primitive object={scene} />
    </group>
  );
}

// =========================================================================
// CAMERA CONTROLLER: FULL WORKSPACE COCKPIT VIEW & RESPONSIVE EYE-LEVEL
// =========================================================================
function PresenterCameraController() {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    if (isMobile) {
      // Mobile: Centered on character at eye level with safe top headroom
      camera.position.set(0.30, 1.25, 2.05);
      camera.lookAt(0.30, 1.20, 0);
    } else if (isTablet) {
      // Tablet: Desk and 3/4 character
      camera.position.set(0.08, 1.08, 2.75);
      camera.lookAt(0.08, 0.98, 0);
    } else {
      // Desktop: Wide studio angle showing both the standing desk workspace and the full character!
      camera.position.set(0.04, 1.05, 2.95);
      camera.lookAt(0.04, 0.94, 0);
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

// Preload models
useGLTF.preload(asset('avatar_vaishnavi_presenter.glb'));
useGLTF.preload(asset('animations.glb'));

// =========================================================================
// 3. MAIN FLOATING 3D PRESENTER HERO COMPONENT
// =========================================================================
export default function SpeakingAvatar3D({ openCaseStudy }) {
  const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' | 'photo'
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [showAutoStartHint, setShowAutoStartHint] = useState(false);
  const [hasStartedIntroOnce, setHasStartedIntroOnce] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const audioRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Initialize and Bind vaishnavi_intro_voice.mp3
  useEffect(() => {
    const audio = new Audio(asset('vaishnavi_intro_voice.mp3'));
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      const dur = audio.duration || TOTAL_INTRO_DURATION;
      setProgressPercent(Math.min(100, (cur / dur) * 100));

      const segIdx = INTRO_SCRIPT_SEGMENTS.findIndex(
        (s) => cur >= s.startTime && cur < s.endTime
      );
      if (segIdx !== -1) {
        setCurrentSegmentIndex(segIdx);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSegmentIndex(0);
      setProgressPercent(0);
    };

    const handleError = () => {
      // Fallback if audio error occurs
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Mouse Parallax Listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // One-time interaction trigger: start introduction on first visitor click/tap
    const triggerAudioOnFirstGesture = () => {
      if (!hasStartedIntroOnce && activeTab === 'avatar') {
        playIntroAudio();
      }
      window.removeEventListener('pointerdown', triggerAudioOnFirstGesture);
      window.removeEventListener('keydown', triggerAudioOnFirstGesture);
    };

    window.addEventListener('pointerdown', triggerAudioOnFirstGesture, { once: true });
    window.addEventListener('keydown', triggerAudioOnFirstGesture, { once: true });

    const hintTimer = setTimeout(() => {
      if (!hasStartedIntroOnce && !isPlaying) {
        setShowAutoStartHint(true);
      }
    }, 2400);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', triggerAudioOnFirstGesture);
      window.removeEventListener('keydown', triggerAudioOnFirstGesture);
      clearTimeout(hintTimer);
    };
  }, [hasStartedIntroOnce, isPlaying, activeTab]);

  const playIntroAudio = () => {
    setHasStartedIntroOnce(true);
    setShowAutoStartHint(false);

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser restricts autoplay, user can click Meet Vaishnavi button
          setIsPlaying(false);
          setShowAutoStartHint(true);
        });
    }
  };

  const pauseIntroAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseIntroAudio();
    } else {
      playIntroAudio();
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = isMuted;
      audioRef.current.play().then(() => setIsPlaying(true));
      setCurrentSegmentIndex(0);
      setProgressPercent(0);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  const activeSegment = INTRO_SCRIPT_SEGMENTS[currentSegmentIndex] || INTRO_SCRIPT_SEGMENTS[0];

  return (
    <div className="seamless-presenter-wrapper">
      {/* View Mode Toggle: 3D Studio Workspace vs Portrait Photo */}
      <div className="presenter-toggle-pills">
        <button
          type="button"
          className={`presenter-tab-pill ${activeTab === 'avatar' ? 'active' : ''}`}
          onClick={() => setActiveTab('avatar')}
          aria-label="Switch to 3D Virtual Human Workspace"
        >
          <Bot size={13} /> <span>3D Studio Workspace</span>
          <span className="live-sparkle-dot" />
        </button>
        <button
          type="button"
          className={`presenter-tab-pill ${activeTab === 'photo' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('photo');
            pauseIntroAudio();
          }}
          aria-label="Switch to Portrait Photograph"
        >
          <Camera size={13} /> <span>Portrait Photo</span>
        </button>
      </div>

      {activeTab === 'avatar' ? (
        /* =========================================================================
           1. 3D CREATIVE WORKSPACE & FEMALE PRESENTER (MATCHES REFERENCE REEL)
           Modern Standing Desk + Dual Code Monitors + High-Quality Digital Human
           ========================================================================= */
        <div className="seamless-hero-presenter-stage">
          {/* Transparent 3D Canvas Stage */}
          <div className="presenter-canvas-container">
            {isWebGLAvailable() ? (
              <Canvas
                camera={{ position: [0.02, 1.10, 2.76], fov: 36 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.12,
                }}
                dpr={[1, 1.5]}
                shadows
                style={{ width: '100%', height: '100%' }}
              >
                <PresenterCameraController />

                {/* Studio 3-Point Lighting with ACES Filmic Tone Mapping */}
                <hemisphereLight skyColor="#ffffff" groundColor="#ffd9e2" intensity={1.15} />
                <ambientLight intensity={1.3} color="#fff6f8" />
                <directionalLight
                  position={[2.8, 4.2, 3.2]}
                  intensity={2.4}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                {/* Soft blush pink fill light */}
                <directionalLight position={[-3.2, 2.0, 2.4]} intensity={1.1} color="#fae8f0" />
                {/* Hair and desk rim highlight */}
                <pointLight position={[0.2, 2.8, -2.2]} intensity={1.6} color="#ffd4e2" />
                <pointLight position={[0.1, 0.6, 1.8]} intensity={0.6} color="#ffffff" />

                <Suspense fallback={null}>
                  {/* Creative Workspace: Modern Standing Desk with Dual Code Monitors */}
                  <CreativeWorkspaceDesk />

                  {/* Exact Reference Presenter: Standing beside the desk with speaking gestures */}
                  <ExactReferencePresenter3D
                    isSpeaking={isPlaying}
                    activeAnimName={activeSegment.animation}
                    mouse={mouse}
                  />

                  {/* Soft Ground Contact Shadows beneath Desk Feet and Character Shoes */}
                  <ContactShadows
                    position={[0, 0.01, 0]}
                    opacity={0.42}
                    scale={5.8}
                    blur={2.4}
                    far={2.5}
                    color="#3a1c2a"
                  />
                </Suspense>
              </Canvas>
            ) : (
              <div className="avatar-fallback-art">
                <img src={asset('hero-photo.png')} alt="Vaishnavi Kedar" width="460" height="540" />
              </div>
            )}

            {/* Speaking Status Pill */}
            <div className={`avatar-status-badge ${isPlaying ? 'speaking' : 'ready'}`}>
              <span className="status-indicator-circle" />
              <span>{isPlaying ? 'Speaking: Introducing Vaishnavi' : 'Virtual Human Presenter'}</span>
              {isPlaying && (
                <div className="audio-wave-mini" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            {/* Subtle One-Time Auto-Start Audio Prompt */}
            {showAutoStartHint && !isPlaying && (
              <div
                className="auto-start-audio-pill"
                onClick={playIntroAudio}
                role="button"
                tabIndex={0}
              >
                <Sparkles size={13} />
                <span>Tap to hear voice introduction 🔊</span>
              </div>
            )}
          </div>

          {/* =========================================================================
              2. MINIMAL PINK & WHITE CONTROLS & SUBTITLES (FLOATING BELOW PRESENTER)
              ========================================================================= */}
          <div className="presenter-floating-deck">
            <div className="avatar-voice-actions">
              <button
                type="button"
                className={`meet-vaishnavi-btn ${isPlaying ? 'is-active' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause speech introduction' : 'Meet Vaishnavi Voice Introduction'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause Intro' : 'Meet Vaishnavi (Voice Intro)'}</span>
                <span className="meet-sparkle">
                  <Sparkles size={13} />
                </span>
              </button>

              <button
                type="button"
                className="icon-circle-btn"
                onClick={handleReplay}
                title="Replay speech introduction from start"
                aria-label="Replay introduction"
              >
                <RotateCcw size={14} />
              </button>

              <button
                type="button"
                className={`icon-circle-btn ${isMuted ? 'muted' : ''}`}
                onClick={toggleMute}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
                aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Synchronized Subtitles Capsule with Progress Track */}
            <div className="avatar-subtitles-capsule" role="region" aria-live="polite">
              <div className="subtitles-header">
                <span className="subtitles-label">
                  <MessageCircle size={11} /> AI Studio Subtitles
                </span>
                <span className="subtitles-counter">
                  {currentSegmentIndex + 1} / {INTRO_SCRIPT_SEGMENTS.length}
                </span>
              </div>
              <p className="subtitles-live-text">“{activeSegment.text}”</p>
              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '3px',
                  background: 'rgba(222, 93, 149, 0.15)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginTop: '4px',
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #de5d95, #fa5252)',
                    borderRadius: '999px',
                    transition: 'width 0.15s linear',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           2. ORIGINAL EDITORIAL PHOTO PORTRAIT
           ========================================================================= */
        <InteractiveCard3D className="hero-photo-editorial-card" depth={16} glowColor="rgba(222, 93, 149, 0.25)">
          <div className="hero-photo-wrap">
            <img
              src={asset('hero-photo.png')}
              alt="Vaishnavi Kedar — UI/UX Designer & Full-Stack Developer"
              width="480"
              height="580"
              loading="eager"
              decoding="async"
              className="hero-portrait-img"
            />
            <div className="hero-photo-gradient-overlay" />
          </div>
        </InteractiveCard3D>
      )}
    </div>
  );
}
