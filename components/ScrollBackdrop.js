import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * ScrollBackdrop v9 — Simplified side-view road trip
 *
 * v8 was too heavy (60 dashes + 25 rails + 6 transform groups → lag) and
 * fought z-index with the hero. v9 simplifies to ~20 SVG nodes, single
 * z-index:0 layer, DOM-order stacking (rendered BEFORE hero in pages/index.js
 * so hero paints over it naturally).
 *
 * Sources (unchanged from v8):
 *  - motion.dev: useScroll + useTransform + useSpring parallax recipe
 *  - 21st.dev: side-scrolling backgrounds category
 *  - Vault [[04-Scroll-Reactive-Parallax-Backdrop]] v2: scrollYProgress, GPU-only
 *  - Vault [[05-Master-Design-Skills-Registry]] Phase 4: no jank, purposeful motion
 *  - Vault [[01-R3F-Cinematic-Hero-Pattern]]: low-horizon cinematic framing
 */

const ScrollBackdrop = () => {
  const wheelFront = useRef(null);
  const wheelBack  = useRef(null);

  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.5 });

  // Parallax — fewer layers, bigger feel
  const xFar  = useTransform(sp, [0, 1], ['0%',  '-20%']);
  const xMid  = useTransform(sp, [0, 1], ['0%',  '-55%']);
  const xRoad = useTransform(sp, [0, 1], ['0%', '-120%']);

  // Sun sinks across journey
  const sunY  = useTransform(sp, [0, 1], [180, 360]);
  const sunOp = useTransform(sp, [0, 0.6, 1], [0.85, 0.55, 0.3]);

  // Wheels spin (direct DOM write — 60fps, no React re-render)
  useMotionValueEvent(sp, 'change', (raw) => {
    const t = Math.max(0, Math.min(1, raw));
    const deg = t * 1080;
    if (wheelFront.current) wheelFront.current.setAttribute('transform', `rotate(${deg} 1080 800)`);
    if (wheelBack.current)  wheelBack.current.setAttribute('transform',  `rotate(${deg} 840 800)`);
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100svh',
        zIndex: 0, // DOM-order stacking: backdrop comes before hero/sections → painted below
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#050510 0%, #0a1428 55%, #1a3a5c 100%)',
      }}
    >
      {/* Mobile blur cap + aurora styles */}
      <style>{`
        .sb-aurora {
          position: absolute;
          inset: 0;
          background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(124,58,237,0.18) 60deg, rgba(249,115,22,0.15) 120deg, transparent 180deg, rgba(167,139,250,0.12) 240deg, transparent 360deg);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .sb-aurora { filter: blur(40px); }
        }
      `}</style>
      {/* Conic-gradient aurora overlay */}
      <div className="sb-aurora" />
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
      >
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe9a8" stopOpacity="1" />
            <stop offset="40%"  stopColor="#d4af37" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="farGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#2a4a6e" />
            <stop offset="100%" stopColor="#142840" />
          </linearGradient>
          <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#0e1f33" />
            <stop offset="100%" stopColor="#070d18" />
          </linearGradient>
          <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#f1cf5a" />
            <stop offset="55%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8a6f1f" />
          </linearGradient>
          <radialGradient id="headlight" cx="0%" cy="50%" r="100%">
            <stop offset="0%"   stopColor="rgba(255,240,200,0.55)" />
            <stop offset="100%" stopColor="rgba(255,240,200,0)" />
          </radialGradient>
        </defs>

        {/* Sun (sinks) */}
        <motion.circle cx="1400" r="160" fill="url(#sunGrad)" style={{ cy: sunY, opacity: sunOp }} />

        {/* L1 Distant mountains */}
        <motion.g style={{ x: xFar }}>
          <path
            d="M -200 740 L 200 580 L 500 660 L 760 540 L 1020 620 L 1280 540 L 1560 600 L 1920 560 L 2200 660 L 2400 740 Z"
            fill="url(#farGrad)" opacity="0.9"
          />
        </motion.g>

        {/* L2 Mid hills (single smooth wave, no individual trees) */}
        <motion.g style={{ x: xMid }}>
          <path
            d="M -200 820 Q 300 720 700 790 T 1400 770 T 2100 760 L 2400 820 Z"
            fill="url(#midGrad)"
          />
        </motion.g>

        {/* L3 Road — solid slab + CSS-style stripe via stroke-dasharray (1 line vs 60 rects) */}
        <motion.g style={{ x: xRoad }}>
          <rect x="-300" y="820" width="2700" height="260" fill="#0a0d14" />
          <line x1="-300" y1="820" x2="2400" y2="820" stroke="rgba(0,212,255,0.4)" strokeWidth="2" />
          <line
            x1="-300" y1="940" x2="2400" y2="940"
            stroke="#d4af37" strokeWidth="6"
            strokeDasharray="44 36" opacity="0.7"
          />
        </motion.g>

        {/* FOREGROUND: anchored sedan (centered at viewBox x=960 → survives portrait crop) */}
        <g>
          <ellipse cx="1220" cy="780" rx="240" ry="36" fill="url(#headlight)" />
          <ellipse cx="960" cy="858" rx="320" ry="14" fill="rgba(0,0,0,0.55)" />

          {/* Body */}
          <path
            d="M 620 780 L 680 740 L 820 720 L 940 700 L 1120 700
               L 1220 720 L 1280 750 L 1300 790 L 1280 820 L 640 820 Z"
            fill="url(#carBody)" stroke="#5a4612" strokeWidth="1.5"
          />
          {/* Greenhouse */}
          <path d="M 780 720 L 860 660 L 1080 660 L 1140 720 Z"
                fill="#0a1428" stroke="#5a4612" strokeWidth="1.5" />
          <path d="M 800 715 L 870 668 L 980 668 L 970 715 Z" fill="rgba(0,212,255,0.22)" />
          {/* Door */}
          <line x1="980" y1="720" x2="980" y2="790" stroke="#5a4612" strokeWidth="1" />
          <rect x="1010" y="755" width="22" height="3" rx="1" fill="#f1cf5a" />
          {/* Lights */}
          <ellipse cx="1265" cy="765" rx="14" ry="8" fill="#fffce0" />
          <rect x="650" y="755" width="10" height="14" rx="2" fill="#ff3a3a" opacity="0.9" />
          {/* Wheel wells */}
          <circle cx="840" cy="800" r="55" fill="#05070b" />
          <circle cx="1080" cy="800" r="55" fill="#05070b" />

          {/* Wheels spin */}
          <g ref={wheelBack}>
            <g transform="translate(840 800)">
              <circle r="46" fill="#0a0a0e" stroke="#2a3340" strokeWidth="2" />
              <circle r="20" fill="#1a1f28" />
              {[0,60,120,180,240,300].map((a)=>(
                <rect key={a} x="-2" y="-44" width="4" height="40" fill="#3a4350" transform={`rotate(${a})`} />
              ))}
              <circle r="5" fill="#d4af37" />
            </g>
          </g>
          <g ref={wheelFront}>
            <g transform="translate(1080 800)">
              <circle r="46" fill="#0a0a0e" stroke="#2a3340" strokeWidth="2" />
              <circle r="20" fill="#1a1f28" />
              {[0,60,120,180,240,300].map((a)=>(
                <rect key={a} x="-2" y="-44" width="4" height="40" fill="#3a4350" transform={`rotate(${a})`} />
              ))}
              <circle r="5" fill="#d4af37" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ScrollBackdrop;
