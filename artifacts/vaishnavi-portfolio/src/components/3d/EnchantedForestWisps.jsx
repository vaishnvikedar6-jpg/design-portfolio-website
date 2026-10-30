import React, { useMemo } from 'react';

/**
 * EnchantedForestWisps: Floating bioluminescent fireflies and fairy-tale forest dust
 * adds a subtle, magical woodland atmosphere across the portfolio.
 */
export default function EnchantedForestWisps() {
  const wisps = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3 + 3) % 96}%`,
      top: `${(i * 7.1 + 8) % 94}%`,
      size: 4 + (i % 3) * 2.5,
      hue: i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'emerald' : 'rose',
      duration: 7 + (i % 5) * 2.2,
      delay: (i % 7) * -1.8,
    }));
  }, []);

  return (
    <div className="enchanted-forest-wisps-wrap" aria-hidden="true">
      {/* Soft ethereal sunbeam god-rays filtering through the forest canopy */}
      <div className="forest-sunbeam beam-left" />
      <div className="forest-sunbeam beam-right" />

      {/* Bioluminescent Woodland Fireflies */}
      {wisps.map((w) => (
        <div
          key={w.id}
          className={`forest-wisp wisp-${w.hue}`}
          style={{
            left: w.left,
            top: w.top,
            width: `${w.size}px`,
            height: `${w.size}px`,
            animationDuration: `${w.duration}s`,
            animationDelay: `${w.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
