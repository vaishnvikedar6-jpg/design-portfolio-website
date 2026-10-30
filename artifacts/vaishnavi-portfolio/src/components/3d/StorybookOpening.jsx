import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, BookOpen, Volume2, VolumeX } from 'lucide-react';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

/**
 * Harmonious Web Audio Arpeggio for the storybook opening
 */
function playStorybookChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A4, C#5, E5, A5, C#6 golden harp arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + idx * 0.11 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.11 + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.11);
      osc.stop(ctx.currentTime + idx * 0.11 + 0.9);
    });
  } catch (e) {
    // Graceful fallback
  }
}

export default function StorybookOpening({ onEnter = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    // If visitor already passed the opening in this session, stay open
    if (sessionStorage.getItem('storybookOpened') === 'true') {
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

  const handleOpenBook = (targetId = 'home') => {
    if (soundEnabled) {
      playStorybookChime();
    }
    setIsOpening(true);

    setTimeout(() => {
      sessionStorage.setItem('storybookOpened', 'true');
      setIsOpen(true);
      if (onEnter) onEnter();

      if (targetId && targetId !== 'home') {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1100);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playStorybookChime();
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

  // 3D Parallax offset
  const bookTransform = `perspective(1200px) rotateX(${12 + mouse.y * -6}deg) rotateY(${mouse.x * 6}deg) scale(${isOpening ? 1.25 : 1})`;

  return (
    <div
      ref={containerRef}
      className={`storybook-opening-overlay ${isOpening ? 'opening-in-progress' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Chapter I: The Magical Opening — Vaishnavi's Storybook"
    >
      {/* Dimmed Warm Desk Environment Backdrop */}
      <div className="storybook-desk-backdrop" style={{ backgroundImage: `url(${asset('enchanted-village-bg.jpg')})` }}>
        <div className="desk-vignette" />
        <div className="desk-candle-glow" />
      </div>

      {/* Floating Golden Sparks / Fairy Dust */}
      <div className="storybook-sparkles-wrap" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`storybook-sparkle-dot dot-${i % 3}`}
            style={{
              left: `${(i * 4.3 + 6) % 92}%`,
              top: `${(i * 6.7 + 8) % 88}%`,
              animationDelay: `${(i % 5) * -1.1}s`,
              animationDuration: `${3.2 + (i % 4) * 1.4}s`,
              transform: `translate3d(${mouse.x * (i % 2 === 0 ? 22 : -18)}px, ${mouse.y * (i % 2 === 0 ? 16 : -14)}px, 0)`,
            }}
          />
        ))}
      </div>

      {/* Immediate Skip Button in Top Right */}
      <button
        className="storybook-skip-floating"
        onClick={() => handleOpenBook('home')}
        aria-label="Skip storybook opening"
      >
        <span>Skip intro</span>
        <ArrowRight size={14} />
      </button>

      {/* Center 3D Book Container */}
      <div className="storybook-3d-scene" style={{ transform: bookTransform }}>
        <div className={`storybook-hardcover ${isOpening ? 'cover-turning' : ''}`}>
          {/* Back Cover & Gilded Spine */}
          <div className="storybook-back-cover" />
          <div className="storybook-gilded-pages-side" />

          {/* Front Cover Front Facing Face */}
          <div className="storybook-front-face">
            {/* Gold foil filigree corner ornaments */}
            <div className="filigree-corner top-left" />
            <div className="filigree-corner top-right" />
            <div className="filigree-corner bottom-left" />
            <div className="filigree-corner bottom-right" />

            {/* Embossed Gold Border */}
            <div className="storybook-inner-border" />

            {/* Header Crest */}
            <div className="storybook-crest">
              <Sparkles size={16} className="crest-sparkle" />
              <span>CHAPTER I · THE AWAKENING</span>
              <Sparkles size={16} className="crest-sparkle" />
            </div>

            <p className="storybook-prologue">An Interactive Digital Portfolio</p>
            <h1 className="storybook-title serif">VAISHNAVI'S<br /><span className="gold-italic">ENCHANTED</span><br />STORYBOOK</h1>
            <p className="storybook-author">Curated by Vaishnavi Kedar</p>
            <p className="storybook-discipline">Computer Engineering • UI/UX Design • Full-Stack Development</p>
            <p className="storybook-subtext">“Step inside a living garden crafted with empathy, code, and botanical harmony.”</p>

            {/* Book Ribbon Bookmark */}
            <div className="storybook-satin-ribbon" />

            {/* Actions */}
            <div className="storybook-cover-actions">
              <button
                className="storybook-btn-primary"
                onClick={() => handleOpenBook('home')}
                autoFocus
              >
                <BookOpen size={18} />
                <span>Open the Storybook</span>
                <Sparkles size={16} />
              </button>

              <button
                className="storybook-btn-secondary"
                onClick={() => handleOpenBook('work')}
              >
                <span>Jump to Projects</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="storybook-bottom-bar">
              <button
                className="storybook-audio-pill"
                onClick={toggleSound}
                aria-label="Toggle magical sound"
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{soundEnabled ? 'Chimes active' : 'Sound optional'}</span>
              </button>
            </div>
          </div>

          {/* Inside Page Reveal that becomes visible as cover opens */}
          <div className="storybook-inside-spread">
            <div className="inside-glow-burst" />
            <div className="inside-page-illustration">
              <Sparkles size={32} className="burst-sparkle" />
              <p className="serif">Entering the Living Garden Clearing...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

