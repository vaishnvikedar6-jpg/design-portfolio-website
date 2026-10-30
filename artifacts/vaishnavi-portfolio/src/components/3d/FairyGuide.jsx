import React, { useEffect, useRef, useState } from 'react';

export default function FairyGuide() {
  const [fairies, setFairies] = useState([
    { id: 'f1', name: 'Flora', x: 120, y: 240, scale: 0.85, glow: '#ffd166' },
    { id: 'f2', name: 'Blossom', x: 200, y: 280, scale: 0.7, glow: '#ffb3c6' },
    { id: 'f3', name: 'Petal', x: 80, y: 310, scale: 0.6, glow: '#f72585' },
  ]);

  const [sparkles, setSparkles] = useState([]);
  const [isGuiding, setIsGuiding] = useState(false);
  const [guideTargetName, setGuideTargetName] = useState(null);

  const fairyRefs = useRef(fairies);
  fairyRefs.current = fairies;

  const mousePos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth * 0.75 : 500, y: 250 });
  const animFrameRef = useRef(null);
  const sparkleIdCounter = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e) => {
      mousePos.current = {
        x: e.clientX + 30,
        y: e.clientY + 15,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastSparkleTime = performance.now();
    let tick = 0;

    const animateFairies = (now) => {
      tick++;

      setFairies((prevFairies) =>
        prevFairies.map((f, idx) => {
          const angle = tick * 0.04 + idx * ((Math.PI * 2) / 3);
          const orbitRadiusX = 30 + idx * 16;
          const orbitRadiusY = 20 + idx * 10;

          const targetX = mousePos.current.x + Math.cos(angle) * orbitRadiusX;
          const targetY = mousePos.current.y + Math.sin(angle * 1.3) * orbitRadiusY;

          const ease = 0.08 - idx * 0.015;
          const newX = f.x + (targetX - f.x) * ease;
          const newY = f.y + (targetY - f.y) * ease;

          return {
            ...f,
            x: newX,
            y: newY,
          };
        })
      );

      if (now - lastSparkleTime > 80) {
        lastSparkleTime = now;
        const lead = fairyRefs.current[0];
        if (lead) {
          const colors = ['#ffd166', '#ffb3c6', '#ffffff', '#e598a6', '#f72585'];
          const newSparkle = {
            id: ++sparkleIdCounter.current,
            x: lead.x + (Math.random() - 0.5) * 14,
            y: lead.y + (Math.random() - 0.5) * 14 + 10,
            size: 3 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
          };

          setSparkles((prev) => [...prev.slice(-20), newSparkle]);
        }
      }

      animFrameRef.current = requestAnimationFrame(animateFairies);
    };

    animFrameRef.current = requestAnimationFrame(animateFairies);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Intercept section links to have fairies guide you there
  useEffect(() => {
    const handleSectionLinkClick = (e) => {
      const link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const label = link.textContent?.trim() || targetId;
      setGuideTargetName(label);
      setIsGuiding(true);

      mousePos.current = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.35,
      };

      const burstColors = ['#ffd166', '#ffb3c6', '#ffffff', '#d6336c'];
      const bursts = Array.from({ length: 12 }).map(() => ({
        id: ++sparkleIdCounter.current,
        x: mousePos.current.x + (Math.random() - 0.5) * 70,
        y: mousePos.current.y + (Math.random() - 0.5) * 70,
        size: 4 + Math.random() * 6,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        opacity: 1,
      }));
      setSparkles((prev) => [...prev, ...bursts]);

      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 160);

      setTimeout(() => {
        setIsGuiding(false);
        setGuideTargetName(null);
      }, 1400);
    };

    document.addEventListener('click', handleSectionLinkClick, { capture: true });
    return () => document.removeEventListener('click', handleSectionLinkClick, { capture: true });
  }, []);

  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles((prev) =>
        prev
          .map((s) => ({ ...s, opacity: s.opacity - 0.16, size: s.size * 0.92 }))
          .filter((s) => s.opacity > 0.1)
      );
    }, 60);
    return () => clearTimeout(timer);
  }, [sparkles]);

  return (
    <div className="fairies-container" aria-hidden="true">
      {isGuiding && guideTargetName && (
        <div className="fairy-guidance-pill">
          <span className="sparkle-icon">✨</span>
          <span>Fairies guiding you to <strong>{guideTargetName}</strong></span>
          <span className="sparkle-icon">🌸</span>
        </div>
      )}

      {sparkles.map((s) => (
        <div
          key={s.id}
          className="fairy-sparkle"
          style={{
            transform: `translate3d(${s.x}px, ${s.y}px, 0)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            opacity: s.opacity,
          }}
        />
      ))}

      {fairies.map((f) => (
        <div
          key={f.id}
          className={`fairy-character ${isGuiding ? 'flying-fast' : ''}`}
          style={{
            transform: `translate3d(${f.x}px, ${f.y}px, 0) scale(${f.scale})`,
          }}
        >
          <div
            className="fairy-aura"
            style={{
              background: `radial-gradient(circle, ${f.glow} 0%, rgba(214, 51, 108, 0.2) 60%, transparent 100%)`,
              boxShadow: `0 0 14px ${f.glow}, 0 0 24px rgba(214, 51, 108, 0.35)`,
            }}
          />
          <div className="fairy-wing wing-left" />
          <div className="fairy-body">
            <div className="fairy-face-glow" />
          </div>
          <div className="fairy-wing wing-right" />
          <div className="fairy-flower-hat" />
        </div>
      ))}
    </div>
  );
}
