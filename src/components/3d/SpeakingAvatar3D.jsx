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
  Heart,
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
// 1. HIGH-QUALITY REALISTIC 3D HUMAN FEMALE AVATAR PRESENTER
// Rigged GLB Model with ARKit/Oculus Visemes, Blinking, Gestures & MoCap
// =========================================================================
function RealisticHumanAvatar3D({ isSpeaking, isMuted, activeAnimName, mouse }) {
  const avatarGroupRef = useRef();

  // Load rigged human avatar and mocap animations
  const { scene, nodes } = useGLTF(asset('avatar_female_rpm.glb'));
  const { animations } = useGLTF(asset('animations.glb'));
  const { actions } = useAnimations(animations, avatarGroupRef);

  // Blinking cadence state
  const blinkTimer = useRef(0);
  const currentActionRef = useRef(null);

  // Apply delicate blush pink/cream styling to outfit and realistic PBR materials
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Soften roughness for a luxurious silk/fabric finish
          child.material.roughness = Math.min(child.material.roughness ?? 0.6, 0.62);
          child.material.metalness = Math.max(child.material.metalness ?? 0.05, 0.06);

          // Tint outfit to bespoke pastel blush pink / cream
          if (
            child.name === 'Wolf3D_Outfit_Top' ||
            child.name === 'Wolf3D_Outfit_Bottom' ||
            child.name.toLowerCase().includes('outfit')
          ) {
            child.material = child.material.clone();
            child.material.color.set('#fde2eb');
          }

          // Ensure skin has natural warm dewy tones
          if (child.name === 'Wolf3D_Skin' || child.name === 'Wolf3D_Head') {
            child.material.roughness = 0.54;
          }
        }
      }
    });
  }, [scene]);

  // Coordinated Skeletal MoCap Animations: Idle vs. Natural Talking Gestures
  useEffect(() => {
    if (!actions) return;

    const targetAnimName = isSpeaking ? (activeAnimName || 'Talking_1') : 'Idle';
    const targetAction = actions[targetAnimName] || actions['Idle'];

    if (targetAction && currentActionRef.current !== targetAction) {
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(0.4);
      }
      targetAction.reset().fadeIn(0.4).play();
      currentActionRef.current = targetAction;
    }
  }, [actions, isSpeaking, activeAnimName]);

  // Frame-by-Frame Lip Sync, Natural Blinking, Smiling & Head Tracking
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

      // 1. Natural Human Blinking (~3.2s intervals, 0.16s smooth eyelid motion)
      blinkTimer.current += delta;
      let blinkVal = 0;
      if (blinkTimer.current > 3.2) {
        const blinkPhase = (blinkTimer.current - 3.2) / 0.16;
        if (blinkPhase <= 1) {
          blinkVal = Math.sin(blinkPhase * Math.PI);
        } else {
          blinkTimer.current = Math.random() * 0.7; // slight natural cadence variation
        }
      }
      setMorph('eyeBlinkLeft', blinkVal, 0.38);
      setMorph('eyeBlinkRight', blinkVal, 0.38);

      // 2. Friendly and Confident Natural Smile
      setMorph('mouthSmileLeft', 0.24, 0.08);
      setMorph('mouthSmileRight', 0.24, 0.08);
      setMorph('browInnerUp', 0.12, 0.08);

      // 3. Multi-viseme Speech Lip Sync
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

    // 4. Natural Head & Neck Mouse Tracking
    if (nodes.Head) {
      const targetRotY = (mouse.current?.x || 0) * 0.22;
      const targetRotX = -(mouse.current?.y || 0) * 0.14;
      nodes.Head.rotation.y = THREE.MathUtils.lerp(nodes.Head.rotation.y, targetRotY, 0.06);
      nodes.Head.rotation.x = THREE.MathUtils.lerp(nodes.Head.rotation.x, targetRotX, 0.06);
    }
    if (nodes.Neck) {
      const targetRotY = (mouse.current?.x || 0) * 0.1;
      const targetRotX = -(mouse.current?.y || 0) * 0.08;
      nodes.Neck.rotation.y = THREE.MathUtils.lerp(nodes.Neck.rotation.y, targetRotY, 0.06);
      nodes.Neck.rotation.x = THREE.MathUtils.lerp(nodes.Neck.rotation.x, targetRotX, 0.06);
    }
  });

  return (
    <group ref={avatarGroupRef} position={[0, -1.42, 0]} scale={1.14} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload models for immediate responsiveness
useGLTF.preload(asset('avatar_female_rpm.glb'));
useGLTF.preload(asset('animations.glb'));

// Fallback spinner while GLB streams in
function AvatarLoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#fcdbe4" wireframe />
    </mesh>
  );
}

// =========================================================================
// 2. MAIN SPEAKING AVATAR 3D HERO COMPONENT
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
      // Restart at current segment with updated volume
      startSpeechSequence(currentSegmentIndex);
    }
  };

  const activeSegment = INTRO_SCRIPT_SEGMENTS[currentSegmentIndex] || INTRO_SCRIPT_SEGMENTS[0];

  return (
    <div className="speaking-hero-container">
      {/* View Mode Toggle: 3D Speaking Avatar vs. Portrait Photo */}
      <div className="avatar-view-toggle-bar">
        <button
          type="button"
          className={`avatar-tab-btn ${activeTab === 'avatar' ? 'active' : ''}`}
          onClick={() => setActiveTab('avatar')}
          aria-label="Switch to 3D Speaking Avatar"
        >
          <Bot size={14} /> <span>3D AI Avatar</span>
          <span className="live-sparkle-dot" />
        </button>
        <button
          type="button"
          className={`avatar-tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
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
           1. 3D SPEAKING AI GIRL PRESENTER STAGE
           ========================================================================= */
        <InteractiveCard3D className="speaking-avatar-glass-card" depth={18} glowColor="rgba(222, 93, 149, 0.28)">
          <div className="avatar-canvas-wrap">
            {isWebGLAvailable() ? (
              <Canvas
                camera={{ position: [0, 0.22, 1.48], fov: 36 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                shadows
                style={{ width: '100%', height: '390px' }}
              >
                <ambientLight intensity={1.4} color="#fff4f8" />
                <directionalLight
                  position={[2, 3.5, 3]}
                  intensity={1.9}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                {/* Soft blush pink fill light */}
                <directionalLight position={[-2.5, 1.8, 2]} intensity={0.9} color="#fae8f0" />
                {/* Dreamy pink hair and shoulder rim highlight */}
                <pointLight position={[0, 2.2, -2]} intensity={1.1} color="#ffccd8" />
                <pointLight position={[0, 0.3, 1.1]} intensity={0.5} color="#ffeef5" />

                <Suspense fallback={<AvatarLoadingFallback />}>
                  <RealisticHumanAvatar3D
                    isSpeaking={isPlaying}
                    isMuted={isMuted}
                    activeAnimName={activeSegment.animation}
                    mouse={mouse}
                  />
                </Suspense>
              </Canvas>
            ) : (
              <div className="avatar-fallback-art">
                <img src={asset('hero-photo.png')} alt="Vaishnavi Kedar" width="360" height="360" />
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

            {/* Top 6 Drishti Award Badge Floating on Stage */}
            <div className="hero-3d-badge avatar-badge-pos">
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
              2. VOICE CONTROLS & SYNCHRONIZED SUBTITLES
              ========================================================================= */}
          <div className="avatar-controls-panel">
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
        </InteractiveCard3D>
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
