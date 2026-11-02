import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
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
  Trophy,
  MessageCircle,
} from 'lucide-react';
import { isWebGLAvailable } from './HeroScene3D';
import InteractiveCard3D from './InteractiveCard3D';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

// =========================================================================
// INTRODUCTION SCRIPT & SEGMENTS
// =========================================================================
export const INTRO_SCRIPT_SEGMENTS = [
  {
    id: 1,
    text: "Hey there! Welcome to Vaishnavi's creative world!",
    duration: 3800,
    animation: 'Talking_1',
    gesture: 'wave',
  },
  {
    id: 2,
    text: "I'm here to introduce Vaishnavi Kedar, a Computer Engineering student who loves creativity, technology, Data Analytics and UI/UX Design.",
    duration: 7200,
    animation: 'Talking_2',
    gesture: 'explain',
  },
  {
    id: 3,
    text: "She enjoys transforming ideas into meaningful digital experiences and building solutions that make a difference.",
    duration: 6400,
    animation: 'Talking_0',
    gesture: 'heart',
  },
  {
    id: 4,
    text: "From innovative projects like AyushLink to creative design experiments, she's always exploring something new.",
    duration: 6800,
    animation: 'Talking_1',
    gesture: 'point',
  },
  {
    id: 5,
    text: "So, come along and explore her journey, projects and achievements!",
    duration: 4800,
    animation: 'Talking_2',
    gesture: 'welcome',
  },
];

export const FULL_SCRIPT_TEXT = INTRO_SCRIPT_SEGMENTS.map((s) => s.text).join(' ');

// =========================================================================
// 1. EXACT REFERENCE 3D DIGITAL HUMAN FEMALE PRESENTER
// Short dark brown bob, light pastel pink blazer, white inner top, gold earrings
// =========================================================================
function ExactReferencePresenter3D({ isSpeaking, isMuted, activeAnimName, mouse }) {
  const avatarGroupRef = useRef();

  // Load avatar matching short side-part bob hairstyle and tailored blazer
  const { scene, nodes } = useGLTF(asset('avatar_vaishnavi_presenter.glb'));
  const { animations } = useGLTF(asset('animations.glb'));
  const { actions } = useAnimations(animations, avatarGroupRef);

  const blinkTimer = useRef(0);
  const currentActionRef = useRef(null);

  // Exact Visual Styling matching the uploaded reference image:
  // - Dark brown bob hairstyle with side partition
  // - Light pastel pink tailored blazer
  // - White inner crewneck top
  // - Natural dewy human skin & friendly soft smile
  // - Hide extraneous accessories (e.g. glasses)
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Hide glasses - reference has no glasses
        if (child.name === 'Wolf3D_Glasses') {
          child.visible = false;
          return;
        }

        if (child.material) {
          // 1. Hair: Elegant dark brown / rich brunette bob with side partition
          if (child.name === 'Wolf3D_Hair') {
            const origNormal = child.material.normalMap;
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#32221b'), // Dark chestnut brown matching reference
              roughness: 0.52,
              metalness: 0.08,
              normalMap: origNormal,
              roughnessMap: child.material.roughnessMap,
            });
          }

          // 2. Blazer: Tailored light pastel pink blazer
          if (child.name === 'Wolf3D_Outfit_Top') {
            const origNormal = child.material.normalMap;
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#f8c8dc'), // Light pastel pink blazer
              roughness: 0.65,
              metalness: 0.04,
              normalMap: origNormal,
            });
          }

          // 3. Trousers / Bottom: Elegant blush cream tailored trousers
          if (child.name === 'Wolf3D_Outfit_Bottom') {
            child.material = child.material.clone();
            child.material.color.set('#fae8f0');
            child.material.roughness = 0.72;
          }

          // 4. Face & Skin: Soft natural human complexion with dewy glow
          if (child.name === 'Wolf3D_Head' || child.name === 'Wolf3D_Body') {
            child.material.roughness = 0.54;
            child.material.metalness = 0.03;
          }
        }
      }
    });
  }, [scene]);

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

    // 4. Natural Head & Neck Mouse Tracking (Subtle natural head tilt as in reference)
    if (nodes.Head) {
      const targetRotY = (mouse.current?.x || 0) * 0.22;
      const targetRotX = -(mouse.current?.y || 0) * 0.14;
      // Slight default head tilt (-0.06 rad z) matching the charming pose in the reference photo
      nodes.Head.rotation.y = THREE.MathUtils.lerp(nodes.Head.rotation.y, targetRotY, 0.06);
      nodes.Head.rotation.x = THREE.MathUtils.lerp(nodes.Head.rotation.x, targetRotX, 0.06);
      nodes.Head.rotation.z = THREE.MathUtils.lerp(nodes.Head.rotation.z, -0.06, 0.04);
    }
    if (nodes.Neck) {
      const targetRotY = (mouse.current?.x || 0) * 0.1;
      const targetRotX = -(mouse.current?.y || 0) * 0.08;
      nodes.Neck.rotation.y = THREE.MathUtils.lerp(nodes.Neck.rotation.y, targetRotY, 0.06);
      nodes.Neck.rotation.x = THREE.MathUtils.lerp(nodes.Neck.rotation.x, targetRotX, 0.06);
    }
  });

  return (
    <group ref={avatarGroupRef} position={[0, -1.35, 0]} scale={1.24} dispose={null}>
      {/* Skinned Human Mesh with Arms, Hands, Bob Hair, Blazer */}
      <primitive object={scene} />

      {/* Crisp White Crewneck Inner Top Collar (visible inside the blazer lapels) */}
      <mesh position={[0, 1.34, 0.065]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[0.13, 0.14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Small Elegant Gold Hoop Earrings (matching the reference photo) */}
      {nodes.Head && (
        <group position={[0, 1.58, 0]}>
          {/* Left Earring */}
          <mesh position={[-0.088, -0.02, -0.015]} rotation={[0, 0, 0.1]}>
            <torusGeometry args={[0.012, 0.0032, 12, 24]} />
            <meshStandardMaterial color="#ffd700" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Right Earring */}
          <mesh position={[0.088, -0.02, -0.015]} rotation={[0, 0, -0.1]}>
            <torusGeometry args={[0.012, 0.0032, 12, 24]} />
            <meshStandardMaterial color="#ffd700" metalness={0.92} roughness={0.18} />
          </mesh>
        </group>
      )}

      {/* Soft Ground Contact Shadow Plane */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <shadowMaterial opacity={0.28} />
      </mesh>
    </group>
  );
}

// Preload models
useGLTF.preload(asset('avatar_vaishnavi_presenter.glb'));
useGLTF.preload(asset('animations.glb'));

// Clean loading placeholder while model streams in
function PresenterLoadingFallback() {
  return (
    <div className="seamless-loading-state" aria-hidden="true">
      <div className="loading-flower-spinner" />
      <span>Summoning Vaishnavi's Presenter...</span>
    </div>
  );
}

// =========================================================================
// 2. MAIN FLOATING 3D PRESENTER HERO COMPONENT (NO BOX, SEAMLESS IN HERO)
// =========================================================================
export default function SpeakingAvatar3D({ openCaseStudy }) {
  const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' | 'photo'
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const utteranceRef = useRef(null);
  const segmentTimerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Web Speech API Voice Selection
  const getPreferredVoice = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer clear, warm, friendly female English voices
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        /(female|natural|google|samantha|zira|sonia|victoria|karen|eva|jenny)/i.test(v.name)
    );
    return preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0];
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      const updateVoices = () => {
        setVoicesLoaded(true);
      };
      window.speechSynthesis.onvoiceschanged = updateVoices;
      updateVoices();
    } else {
      setSpeechSupported(false);
    }

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(segmentTimerRef.current);
    };
  }, []);

  // Synchronized Segment Sequence Handler
  const startSpeechSequence = useCallback(
    (startIndex = 0) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      clearTimeout(segmentTimerRef.current);

      setCurrentSegmentIndex(startIndex);
      setIsPlaying(true);

      const textToSpeak = INTRO_SCRIPT_SEGMENTS.slice(startIndex)
        .map((s) => s.text)
        .join(' ');

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.voice = getPreferredVoice();
      utterance.pitch = 1.05; // Slightly youthful, friendly pitch
      utterance.rate = 0.95; // Clear, articulate cadence

      if (isMuted) {
        utterance.volume = 0;
      } else {
        utterance.volume = 1;
      }

      // Word boundary event for tight subtitle synchronization
      utterance.onboundary = (event) => {
        if (event.name === 'sentence' || event.name === 'word') {
          const charIndex = event.charIndex;
          let accumulated = 0;
          for (let i = startIndex; i < INTRO_SCRIPT_SEGMENTS.length; i++) {
            accumulated += INTRO_SCRIPT_SEGMENTS[i].text.length + 1;
            if (charIndex < accumulated) {
              setCurrentSegmentIndex(i);
              break;
            }
          }
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentSegmentIndex(0);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Timed fallback in case boundary events are not supported on this platform
      let cumulativeTime = 0;
      for (let i = startIndex; i < INTRO_SCRIPT_SEGMENTS.length; i++) {
        const segIndex = i;
        const dur = INTRO_SCRIPT_SEGMENTS[segIndex].duration;
        setTimeout(() => {
          if (isPlaying) {
            setCurrentSegmentIndex(segIndex);
          }
        }, cumulativeTime);
        cumulativeTime += dur;
      }
    },
    [getPreferredVoice, isMuted, isPlaying]
  );

  const togglePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      clearTimeout(segmentTimerRef.current);
      setIsPlaying(false);
    } else {
      startSpeechSequence(0);
    }
  };

  const handleReplay = () => {
    startSpeechSequence(0);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isPlaying && utteranceRef.current) {
      startSpeechSequence(currentSegmentIndex);
    }
  };

  const activeSegment = INTRO_SCRIPT_SEGMENTS[currentSegmentIndex] || INTRO_SCRIPT_SEGMENTS[0];

  return (
    <div className="seamless-presenter-wrapper">
      {/* View Mode Toggle: 3D Virtual Presenter vs. Portrait Photo */}
      <div className="presenter-toggle-pills">
        <button
          type="button"
          className={`presenter-tab-pill ${activeTab === 'avatar' ? 'active' : ''}`}
          onClick={() => setActiveTab('avatar')}
          aria-label="Switch to 3D Virtual Human Presenter"
        >
          <Bot size={14} /> <span>3D Virtual Presenter</span>
          <span className="live-sparkle-dot" />
        </button>
        <button
          type="button"
          className={`presenter-tab-pill ${activeTab === 'photo' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('photo');
            if (isPlaying && window.speechSynthesis) {
              window.speechSynthesis.cancel();
              setIsPlaying(false);
            }
          }}
          aria-label="Switch to Portrait Photograph"
        >
          <Camera size={14} /> <span>Portrait Photo</span>
        </button>
      </div>

      {activeTab === 'avatar' ? (
        /* =========================================================================
           1. FULL-SIZE SEAMLESS 3D PRESENTER (NO BOX, TRANSPARENT STAGE)
           Standing directly in hero section with arms & hands gesturing freely
           ========================================================================= */
        <div className="seamless-hero-presenter-stage">
          {/* Transparent 3D Canvas - 75% to 90% of Hero Height */}
          <div className="presenter-canvas-container">
            {isWebGLAvailable() ? (
              <Canvas
                camera={{ position: [0, 0.28, 1.82], fov: 33 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                shadows
                style={{ width: '100%', height: '100%' }}
              >
                {/* Cinematic Studio 3-Point Lighting */}
                <ambientLight intensity={1.5} color="#fff6f8" />
                <directionalLight
                  position={[2.5, 3.8, 3]}
                  intensity={2.1}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                {/* Soft blush pink fill light */}
                <directionalLight position={[-3, 1.8, 2.2]} intensity={1.0} color="#fae8f0" />
                {/* Hair and shoulder rim highlight */}
                <pointLight position={[0, 2.6, -2.2]} intensity={1.3} color="#ffd4e2" />
                <pointLight position={[0, 0.2, 1.4]} intensity={0.6} color="#ffffff" />

                <Suspense fallback={null}>
                  <ExactReferencePresenter3D
                    isSpeaking={isPlaying}
                    isMuted={isMuted}
                    activeAnimName={activeSegment.animation}
                    mouse={mouse}
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

            {/* Top 6 Drishti Award Floating Badge */}
            <div className="hero-3d-badge presenter-award-badge">
              <div className="badge-trophy-icon">
                <Trophy size={16} />
              </div>
              <div>
                <strong>Top 6 of 193+</strong>
                <span>Drishti UI/UX Finalist</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. VOICE CONTROLS & SYNCHRONIZED SUBTITLES (FLOATING BELOW PRESENTER)
              ========================================================================= */}
          <div className="presenter-floating-deck">
            <div className="avatar-voice-actions">
              <button
                type="button"
                className={`meet-vaishnavi-btn ${isPlaying ? 'is-active' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause speech introduction' : 'Meet Vaishnavi Voice Introduction'}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                <span>{isPlaying ? 'Pause Introduction' : 'Meet Vaishnavi (Voice Intro)'}</span>
                <span className="meet-sparkle">
                  <Sparkles size={14} />
                </span>
              </button>

              <button
                type="button"
                className="icon-circle-btn"
                onClick={handleReplay}
                title="Replay speech introduction from start"
                aria-label="Replay introduction"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                className={`icon-circle-btn ${isMuted ? 'muted' : ''}`}
                onClick={toggleMute}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
                aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>

            {/* Synchronized Subtitles Capsule */}
            <div className="avatar-subtitles-capsule" role="region" aria-live="polite">
              <div className="subtitles-header">
                <span className="subtitles-label">
                  <MessageCircle size={12} /> AI Speech Subtitles
                </span>
                <span className="subtitles-counter">
                  {currentSegmentIndex + 1} / {INTRO_SCRIPT_SEGMENTS.length}
                </span>
              </div>
              <p className="subtitles-live-text">“{activeSegment.text}”</p>
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

            <div className="hero-3d-badge">
              <div className="badge-trophy-icon">
                <Trophy size={16} />
              </div>
              <div>
                <strong>Top 6 of 193+</strong>
                <span>Drishti UI/UX Finalist</span>
              </div>
            </div>
          </div>
        </InteractiveCard3D>
      )}
    </div>
  );
}
