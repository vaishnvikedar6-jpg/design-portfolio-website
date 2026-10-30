import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

/**
 * Web Audio gentle magical chime for the sound toggle
 */
function playMagicalChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 fairy sparkle arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.75);
    });
  } catch (e) {
    // Audio optional / graceful fallback
  }
}

export default function FairyGate({ onEnter = () => {} } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if user already passed the gate in this session
    if (sessionStorage.getItem('fairyGatePassed') === 'true') {
      setIsOpen(true);
      if (onEnter) onEnter();
    }

    const handleMouseMove = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [onEnter]);

  const handleOpenGate = (targetSection = 'home') => {
    if (soundEnabled) {
      playMagicalChime();
    }
    setIsOpening(true);
    setTimeout(() => {
      sessionStorage.setItem('fairyGatePassed', 'true');
      setIsOpen(true);
      if (onEnter) onEnter();

      if (targetSection === 'work') {
        const el = document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 950);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playMagicalChime();
  };

  if (isOpen) {
    return (
      <button
        className="sound-toggle-floating"
        onClick={toggleSound}
        aria-label={soundEnabled ? 'Mute fairytale chimes' : 'Enable fairytale chimes'}
        title={soundEnabled ? 'Mute magical ambience' : 'Turn on magical chime'}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
      </button>
    );
  }

  // 3D Parallax offset values
  const bgTransform = `perspective(1000px) rotateX(${mouse.y * -4.5}deg) rotateY(${mouse.x * 4.5}deg) scale(1.08)`;
  const cardTransform = `perspective(1000px) rotateX(${mouse.y * -3}deg) rotateY(${mouse.x * 3}deg) translateZ(30px)`;

  return (
    <div
      ref={containerRef}
      className={`fairy-gate-overlay ${isOpening ? 'gate-opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Vaishnavi's Enchanted Realm"
    >
      {/* 3D Enchanted Forest Waterfall Backdrop with Mouse Parallax */}
      <div className="fairy-gate-3d-bg-wrap" style={{ transform: bgTransform }}>
        <img
          src={asset('fairy-gate-forest.jpg')}
          alt="Enchanted forest with magical waterfall, fireflies and golden god-rays"
          className="fairy-gate-forest-img"
          fetchPriority="high"
        />
        {/* Soft magical lighting layers */}
        <div className="fairy-gate-sunbeam-overlay" />
        <div className="fairy-gate-vignette-overlay" />

        {/* Floating Fairy Dust Orbs drifting in front of the waterfall */}
        <div className="fairy-gate-orbs-layer">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`gate-sparkle-orb orb-${i % 3}`}
              style={{
                left: `${(i * 5.2 + 8) % 92}%`,
                top: `${(i * 7.8 + 12) % 86}%`,
                animationDelay: `${(i % 5) * -1.2}s`,
                animationDuration: `${3.5 + (i % 4) * 1.5}s`,
                transform: `translate3d(${mouse.x * (i % 2 === 0 ? 25 : -20)}px, ${mouse.y * (i % 2 === 0 ? 18 : -15)}px, 0)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Left & Right Floral Arch Gates */}
      <div className="gate-door gate-door-left">
        <div className="gate-filigree" />
      </div>
      <div className="gate-door gate-door-right">
        <div className="gate-filigree" />
      </div>

      {/* Center 3D Glass Welcome Card */}
      <div className="fairy-gate-card-wrapper" style={{ transform: cardTransform }}>
        <div className="fairy-gate-card">
          <div className="gate-badge">
            <Sparkles size={14} className="sparkle-spin" />
            <span>VAISHNAVI'S ENCHANTED REALM</span>
            <Sparkles size={14} className="sparkle-spin" />
          </div>

          <p className="gate-greeting">Welcome to my little world</p>
          <h1 className="gate-title serif">VAISHNAVI</h1>
          <p className="gate-subtitle">Developer • Designer • Dreamer</p>
          <p className="gate-quote">“Where imagination meets thoughtful design.”</p>

          <div className="gate-actions">
            <button
              className="gate-btn-primary"
              onClick={() => handleOpenGate('home')}
              autoFocus
            >
              <span>Enter the Enchanted Forest</span>
              <ArrowRight size={17} />
            </button>

            <button
              className="gate-btn-secondary"
              onClick={() => handleOpenGate('work')}
            >
              Explore My Work
            </button>
          </div>

          {/* Audio Toggle & Skip Hint */}
          <div className="gate-footer-controls">
            <button
              className="gate-audio-toggle"
              onClick={toggleSound}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? 'Chimes active' : 'Sound optional'}</span>
            </button>

            <button
              className="gate-skip-btn"
              onClick={() => handleOpenGate('home')}
            >
              Skip intro ↷
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
