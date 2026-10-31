import React, { useRef, useState, useEffect } from 'react';

export default function InteractiveCard3D({
  children,
  className = '',
  depth = 20,
  glowColor = 'rgba(214, 51, 108, 0.18)',
  id = undefined,
  ...props
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStyle({});
    }
  }, []);

  const handlePointerMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
      transition: 'transform 0.08s ease-out',
      willChange: 'transform',
    });

    setSpotlight({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handlePointerLeave = () => {
    setStyle({
      transform: 'none',
      transition: 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
      willChange: 'auto',
    });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      id={id}
      className={`interactive-3d-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
      {...props}
    >
      <div
        className="card-spotlight-reflection"
        style={{
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${glowColor} 0%, transparent 65%)`,
          opacity: spotlight.opacity,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
