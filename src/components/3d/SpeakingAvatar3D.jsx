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
// Dark brown side-parted bob, light pastel pink blazer, white inner top, gold earrings
// MeshPhysicalMaterial with Sheen for tailored fabric, clearcoat for glossy hair & eyes
// =========================================================================
function ExactReferencePresenter3D({ isSpeaking, isMuted, activeAnimName, mouse }) {
  const avatarGroupRef = useRef();

  // Load rigged human presenter and mocap animations
  const { scene, nodes } = useGLTF(asset('avatar_vaishnavi_presenter.glb'));
  const { animations } = useGLTF(asset('animations.glb'));
  const { actions } = useAnimations(animations, avatarGroupRef);

  const blinkTimer = useRef(0);
  const currentActionRef = useRef(null);

  // Exact Visual Styling matching the uploaded reference image:
  // - Dark brown bob hairstyle with side partition
  // - Light pastel pink tailored blazer with sheen micro-fiber fabric rolloff
  // - White inner crewneck top
  // - Natural dewy human skin & friendly soft smile
  // - Hide extraneous accessories (e.g. glasses)
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

        if (child.material) {
          // 1. Hair: Elegant dark brown bob with side partition & silky anisotropic sheen
          if (child.name === 'Wolf3D_Hair') {
            const origNormal = child.material.normalMap;
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#2e1e17'), // Rich dark brunette matching reference
              roughness: 0.46,
              metalness: 0.05,
              clearcoat: 0.35,
              clearcoatRoughness: 0.25,
              normalMap: origNormal,
            });
          }

          // 2. Blazer: Tailored light pastel pink blazer with luxury sheen fabric rolloff
          if (child.name === 'Wolf3D_Outfit_Top') {
            const origNormal = child.material.normalMap;
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#f7c8d8'), // Soft pastel pink blazer
              roughness: 0.68,
              metalness: 0.02,
              sheen: 0.75,
              sheenColor: new THREE.Color('#fff0f5'),
              sheenRoughness: 0.45,
              normalMap: origNormal,
            });
          }

          // 3. Trousers / Bottom: Elegant blush cream tailored trousers
          if (child.name === 'Wolf3D_Outfit_Bottom') {
            child.material = child.material.clone();
            child.material.color.set('#fae8f0');
            child.material.roughness = 0.72;
          }

          // 4. Face & Skin: Soft natural human complexion with warm subsurface rolloff
          if (child.name === 'Wolf3D_Head' || child.name === 'Wolf3D_Body') {
            child.material.roughness = 0.52;
            child.material.metalness = 0.0;
          }

          // 5. Eyes: Clear corneal specular reflection & depth
          if (child.name === 'EyeLeft' || child.name === 'EyeRight') {
            child.material.roughness = 0.08;
            child.material.metalness = 0.0;
          }
        }
      }
    });
  }, [scene]);

  // Attach small elegant gold hoop earrings directly to head bone so they move 100% with head motions
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
  }, [nodes.Head]);

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
      // Charming subtle head tilt (-0.06 rad z) matching reference photo
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
    <group ref={avatarGroupRef} position={[0.10, -0.96, 0]} scale={0.96} dispose={null}>
      {/* Skinned Human Mesh with Arms, Hands, Bob Hair, Blazer */}
      <primitive object={scene} />

      {/* Crisp White Crewneck Inner Top Collar (visible inside the blazer lapels) */}
      <mesh position={[0, 1.34, 0.065]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[0.13, 0.14]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Soft Ground Contact Shadow Plane */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <shadowMaterial opacity={0.28} />
      </mesh>
    </group>
  );
}

// =========================================================================
// CAMERA CONTROLLER: EYE-LEVEL HEAD FOCUS & 3/4 BODY VIEW WITHOUT CROPPING
// =========================================================================
function PresenterCameraController() {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1024;

    if (isMobile) {
      // Mobile: Head and shoulders framed centered with safe clearance above hair
      camera.position.set(0.08, 0.44, 1.95);
      camera.lookAt(0.10, 0.48, 0);
    } else if (isTablet) {
      // Tablet: Head to waist view
      camera.position.set(0.10, 0.34, 2.22);
      camera.lookAt(0.10, 0.40, 0);
    } else {
      // Desktop: Head to mid-thigh 3/4 body view with generous top padding
      camera.position.set(0.10, 0.26, 2.44);
      camera.lookAt(0.10, 0.38, 0);
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

// Preload models
useGLTF.preload(asset('avatar_vaishnavi_presenter.glb'));
useGLTF.preload(asset('animations.glb'));

// Clean loading placeholder while model streams in
function PresenterLoadingFallback() {
  return (
    <div className="seamless-loading-state" aria-hidden="true">
      <div className="loading-flower-spinner" />
      <span>Welcoming Vaishnavi's Presenter...</span>
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
  const [showAutoStartHint, setShowAutoStartHint] = useState(false);
  const [hasStartedIntroOnce, setHasStartedIntroOnce] = useState(false);

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

  // Synchronized Segment Sequence Handler
  const startSpeechSequence = useCallback(
    (startIndex = 0) => {
      setHasStartedIntroOnce(true);
      setShowAutoStartHint(false);

      if (typeof window === 'undefined') return;

      clearTimeout(segmentTimerRef.current);
      setCurrentSegmentIndex(startIndex);
      setIsPlaying(true);

      // Animation & subtitle timing works reliably even if speech synthesis is unavailable or muted
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

      // Automatically end speaking after final segment
      const totalRemainingDur = INTRO_SCRIPT_SEGMENTS.slice(startIndex).reduce(
        (sum, s) => sum + s.duration,
        0
      );
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentSegmentIndex(0);
      }, totalRemainingDur);

      // If Web Speech API is available, play audio voice
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();

        const textToSpeak = INTRO_SCRIPT_SEGMENTS.slice(startIndex)
          .map((s) => s.text)
          .join(' ');

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.voice = getPreferredVoice();
        utterance.pitch = 1.05; // Slightly youthful, friendly pitch
        utterance.rate = 0.95; // Clear, articulate cadence
        utterance.volume = isMuted ? 0 : 1;

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
          // If audio gets blocked, animation continues smoothly with subtitles
        };

        utteranceRef.current = utterance;
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // Fallback graceful
        }
      }
    },
    [getPreferredVoice, isMuted, isPlaying]
  );

  // Automatic Introduction on Website Load + One-time Audio Interaction Listener
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      window.speechSynthesis.onvoiceschanged = () => {};
    } else {
      setSpeechSupported(false);
    }

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // One-time interaction trigger: when the user first clicks, taps, or scrolls, automatically start speech if not yet started
    const triggerAudioOnFirstGesture = () => {
      if (!hasStartedIntroOnce) {
        startSpeechSequence(0);
      }
      window.removeEventListener('pointerdown', triggerAudioOnFirstGesture);
      window.removeEventListener('keydown', triggerAudioOnFirstGesture);
    };

    window.addEventListener('pointerdown', triggerAudioOnFirstGesture, { once: true });
    window.addEventListener('keydown', triggerAudioOnFirstGesture, { once: true });

    // Show auto-start prompt if not yet triggered after 2 seconds
    const hintTimer = setTimeout(() => {
      if (!hasStartedIntroOnce && !isPlaying) {
        setShowAutoStartHint(true);
      }
    }, 2200);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', triggerAudioOnFirstGesture);
      window.removeEventListener('keydown', triggerAudioOnFirstGesture);
      clearTimeout(hintTimer);
      clearTimeout(segmentTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasStartedIntroOnce, isPlaying, startSpeechSequence]);

  const togglePlay = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
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
          <Bot size={13} /> <span>3D Virtual Presenter</span>
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
          <Camera size={13} /> <span>Portrait Photo</span>
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
                camera={{ position: [0.10, 0.26, 2.44], fov: 34 }}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: 'high-performance',
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.08,
                }}
                dpr={[1, 1.5]}
                shadows
                style={{ width: '100%', height: '100%' }}
              >
                <PresenterCameraController />

                {/* Studio 3-Point Lighting with ACES Filmic Tone Mapping */}
                <hemisphereLight skyColor="#ffffff" groundColor="#ffd9e2" intensity={1.1} />
                <ambientLight intensity={1.4} color="#fff6f8" />
                <directionalLight
                  position={[2.5, 3.8, 3]}
                  intensity={2.2}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                {/* Soft blush pink fill light */}
                <directionalLight position={[-3, 1.8, 2.2]} intensity={1.0} color="#fae8f0" />
                {/* Hair and shoulder rim highlight */}
                <pointLight position={[0, 2.6, -2.2]} intensity={1.4} color="#ffd4e2" />
                <pointLight position={[0.1, 0.4, 1.6]} intensity={0.5} color="#ffffff" />

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

            {/* Subtle One-Time Auto-Start Audio Prompt */}
            {showAutoStartHint && !isPlaying && (
              <div
                className="auto-start-audio-pill"
                onClick={() => startSpeechSequence(0)}
                role="button"
                tabIndex={0}
              >
                <Sparkles size={13} />
                <span>Tap to hear voice introduction</span>
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

            {/* Synchronized Subtitles Capsule */}
            <div className="avatar-subtitles-capsule" role="region" aria-live="polite">
              <div className="subtitles-header">
                <span className="subtitles-label">
                  <MessageCircle size={11} /> AI Speech Subtitles
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
          </div>
        </InteractiveCard3D>
      )}
    </div>
  );
}
