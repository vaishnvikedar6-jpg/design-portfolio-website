import React, { useEffect, useRef, useState } from 'react';

export default function ButterflyGuide() {
  const [butterflies, setButterflies] = useState([
    { id: 'b1', name: 'Rosalie', x: 140, y: 220, scale: 0.95, wingHue: 'rose' },
    { id: 'b2', name: 'Aura', x: 210, y: 270, scale: 0.8, wingHue: 'blush' },
    { id: 'b3', name: 'Mariposa', x: 90, y: 300, scale: 0.68, wingHue: 'gold' },
  ]);

  const [sparkles, setSparkles] = useState([]);
  const [isGuiding, setIsGuiding] = useState(false);
  const [guideTargetName, setGuideTargetName] = useState(null);

  const butterflyRefs = useRef(butterflies);
  butterflyRefs.current = butterflies;

  const mousePos = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.75 : 500,
    y: 250,
  });
  const animFrameRef = useRef(null);
  const sparkleIdCounter = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e) => {
      mousePos.current = {
        x: e.clientX + 32,
        y: e.clientY + 18,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastSparkleTime = performance.now();
    let tick = 0;

    const animateButterflies = (now) => {
      tick++;

      setButterflies((prev) =>
        prev.map((b, idx) => {
          // Organic figure-eight and fluttering orbital drift
          const angle = tick * 0.035 + idx * ((Math.PI * 2) / 3);
          const orbitRadiusX = 32 + idx * 18;
          const orbitRadiusY = 22 + idx * 12;

          // Figure-8 butterfly flutter math
          const flutterOffsetX = Math.sin(angle) * orbitRadiusX;
          const flutterOffsetY = Math.sin(angle * 2) * (orbitRadiusY * 0.65);

          const targetX = mousePos.current.x + flutterOffsetX;
          const targetY = mousePos.current.y + flutterOffsetY;

          const ease = 0.075 - idx * 0.014;
          const newX = b.x + (targetX - b.x) * ease;
          const newY = b.y + (targetY - b.y) * ease;

          // Calculate bank / tilt angle in direction of flight
          const vx = targetX - b.x;
          const tilt = Math.max(-25, Math.min(25, vx * 0.4));

          return {
            ...b,
            x: newX,
            y: newY,
            tilt,
          };
        })
      );

      // Periodically spawn pollen / sparkle dust behind butterflies
      if (now - lastSparkleTime > 75) {
        lastSparkleTime = now;
        const lead = butterflyRefs.current[0];
        if (lead) {
          const colors = ['#ffd166', '#ffb3c6', '#ffffff', '#e598a6', '#f72585'];
          const newSparkle = {
            id: ++sparkleIdCounter.current,
            x: lead.x + (Math.random() - 0.5) * 16,
            y: lead.y + (Math.random() - 0.5) * 16 + 14,
            size: 3 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
          };

          setSparkles((prev) => [...prev.slice(-22), newSparkle]);
        }
      }

      animFrameRef.current = requestAnimationFrame(animateButterflies);
    };

    animFrameRef.current = requestAnimationFrame(animateButterflies);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Intercept section links: butterflies fly forward and guide the visitor smoothly
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

      // Swoop butterflies across the screen in an arc towards target
      mousePos.current = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.35,
      };

      const burstColors = ['#ffd166', '#ffb3c6', '#ffffff', '#d6336c', '#c87d8d'];
      const bursts = Array.from({ length: 14 }).map(() => ({
        id: ++sparkleIdCounter.current,
        x: mousePos.current.x + (Math.random() - 0.5) * 85,
        y: mousePos.current.y + (Math.random() - 0.5) * 85,
        size: 4 + Math.random() * 7,
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

  // Sparkles fade out
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
    <div className="butterflies-container" aria-hidden="true">
      {/* Guidance notification pill when butterflies take you to a section */}
      {isGuiding && guideTargetName && (
        <div className="butterfly-guidance-pill">
          <span className="butterfly-icon-bounce">🦋</span>
          <span>Fairytale forest guides taking you to <strong>{guideTargetName}</strong></span>
          <span className="sparkle-icon">✨🌿</span>
        </div>
      )}

      {/* Sparkles / Pollen Dust Trail */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="butterfly-sparkle"
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

      {/* Butterflies */}
      {butterflies.map((b) => (
        <div
          key={b.id}
          className={`butterfly-creature ${b.wingHue} ${isGuiding ? 'fluttering-fast' : ''}`}
          style={{
            transform: `translate3d(${b.x}px, ${b.y}px, 0) scale(${b.scale}) rotate(${b.tilt || 0}deg)`,
          }}
        >
          {/* Glowing Aura */}
          <div className="butterfly-glow" />

          {/* Left Wing Pair (Forewing + Hindwing) */}
          <div className="butterfly-wing-pair wing-pair-left">
            <div className="forewing forewing-left" />
            <div className="hindwing hindwing-left" />
          </div>

          {/* Butterfly Slender Body & Antennae */}
          <div className="butterfly-body">
            <div className="antenna antenna-left" />
            <div className="antenna antenna-right" />
            <div className="butterfly-thorax" />
            <div className="butterfly-abdomen" />
          </div>

          {/* Right Wing Pair (Forewing + Hindwing) */}
          <div className="butterfly-wing-pair wing-pair-right">
            <div className="forewing forewing-right" />
            <div className="hindwing hindwing-right" />
          </div>
        </div>
      ))}
    </div>
  );
}

