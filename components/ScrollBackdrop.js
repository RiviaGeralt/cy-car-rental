import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * ScrollBackdrop v8 — Side-view multi-layer parallax road trip
 *
 * Concept: Gold sedan in profile stays anchored ~33% from left.
 * Six depth layers parallax behind/in-front at different speeds.
 * Wheels rotate with scroll. Four roadside "section stops" slide past
 * (FLEET, REVIEWS, WHY US, CONTACT) — like driving by exits on a highway.
 *
 * SOURCES / INSPIRATION:
 *  1. motion.dev (framer-motion docs) — `useScroll` + `useTransform` + `useSpring`
 *     parallax recipe: https://motion.dev/docs/react-use-scroll
 *  2. 21st.dev — "Backgrounds" + "Scroll Areas" categories: side-scrolling
 *     parallax pattern (camera dolly through a layered world)
 *  3. Vault skill [[05 Skills/02-Design-Styles/04-Scroll-Reactive-Parallax-Backdrop.md]] v2
 *     — scrollYProgress (0→1), GPU-only transforms, spring { 55, 22, 0.5 } baseline,
 *     mobile blur reduction, prefers-reduced-motion compliance.
 *  4. Vault skill [[05 Skills/02-Design-Styles/05-Master-Design-Skills-Registry.md]]
 *     Phase 4 (motion): purposeful animation, spring physics, no jank.
 *  5. Vault skill [[05 Skills/02-Design-Styles/01-R3F-Cinematic-Hero-Pattern.md]]
 *     — cinematic camera language (low horizon, sub-pixel bob).
 *
 * Brand palette (matches HeroCinematic + globals.css):
 *   deep:   #050510
 *   dusk:   #0a1428 → #1a3a5c
 *   gold:   #d4af37 (sedan, signs, lane dashes)
 *   cyan:   rgba(0,212,255,…) (horizon glow, window tint)
 */

const ScrollBackdrop = () => {
  const wheelFront = useRef(null);
  const wheelBack  = useRef(null);

  // Mobile detection: bail out of the heavy SVG entirely on phones.
  // Reason: overflow-x:hidden on html/body clips fixed children on iOS Safari,
  // and 100+ animated SVG nodes lag mobile GPUs. CSS-only fallback below.
  const [isMobile, setIsMobile] = useState(null); // null = detecting, prevents desktop flash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // scrollYProgress (0→1) is height-agnostic — spans whatever the page is.
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.5 });

  // ── Parallax layers (slowest → fastest) ───────────────────────────
  // Negative = scrolls left = camera moves right through the world.
  const xSky   = useTransform(sp, [0, 1], ['0%',   '-5%']);
  const xFar   = useTransform(sp, [0, 1], ['0%',  '-15%']);
  const xMid   = useTransform(sp, [0, 1], ['0%',  '-45%']);
  const xRoad  = useTransform(sp, [0, 1], ['0%', '-120%']);
  const xFg    = useTransform(sp, [0, 1], ['0%', '-160%']);
  const xSigns = useTransform(sp, [0, 1], ['100%','-200%']);

  // Sub-pixel vertical bob — sells "driving" without making people seasick.
  const yBob = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [0, -3, 2, -3, 0]);

  // Sun/moon sinks through the journey (day → dusk feel)
  const sunY  = useTransform(sp, [0, 1], [120, 320]);
  const sunOp = useTransform(sp, [0, 0.6, 1], [0.85, 0.55, 0.25]);

  // Stars fade in near the end (night falling)
  const starOp = useTransform(sp, [0, 0.5, 1], [0.2, 0.5, 0.9]);

  // Vignette tightens slightly at bottom of page
  const vigOp = useTransform(sp, [0, 1], [0.35, 0.55]);

  // ── Wheel rotation (direct DOM write — bypasses React, hits 60fps) ─
  // Pivots match wheel centers after car shift: back=840, front=1080 at y=800
  useMotionValueEvent(sp, 'change', (raw) => {
    const t = Math.max(0, Math.min(1, raw));
    const deg = t * 1080; // 3 full rotations across the page
    if (wheelFront.current) wheelFront.current.setAttribute('transform', `rotate(${deg} 1080 800)`);
    if (wheelBack.current)  wheelBack.current.setAttribute('transform',  `rotate(${deg} 840 800)`);
  });

  // ── MOBILE: lightweight CSS-only aurora. No SVG, no scroll calc, no lag. ──
  if (isMobile === true) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse 95% 60% at 30% 10%, rgba(212,175,55,0.18), transparent 65%),' +
            'radial-gradient(ellipse 80% 50% at 80% 70%, rgba(0,212,255,0.14), transparent 65%),' +
            'radial-gradient(ellipse 90% 55% at 50% 100%, rgba(124,58,237,0.18), transparent 65%),' +
            'linear-gradient(180deg,#050510 0%, #0a1428 55%, #1a3a5c 100%)',
        }}
      />
    );
  }

  // Detection pending → render nothing yet (prevents desktop flash on phones)
  if (isMobile === null) return null;

  // ── DESKTOP: full v8 SVG scene ──
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // sits behind .container (z:1); skill 04 spec
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#050510 0%, #0a1428 55%, #1a3a5c 100%)',
      }}
    >
      <motion.svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', y: yBob, display: 'block' }}
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
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#1a1f28" />
            <stop offset="100%" stopColor="#05070b" />
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
          <radialGradient id="vignetteGrad" cx="50%" cy="55%" r="65%">
            <stop offset="60%"  stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
          </radialGradient>
        </defs>

        {/* ── L0 Sky: clouds, sun, stars ── */}
        <motion.g style={{ x: xSky }}>
          <motion.circle cx="1500" r="180" fill="url(#sunGrad)" style={{ cy: sunY, opacity: sunOp }} />
          <motion.g style={{ opacity: starOp }}>
            {[[120,90],[340,60],[560,120],[780,70],[1020,110],[1260,80],[1480,140],
              [1700,95],[1850,70],[220,180],[620,200],[1120,220],[1620,190]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r={i%3===0?1.6:1} fill="#e8f4ff" />
            ))}
          </motion.g>
          <ellipse cx="400"  cy="200" rx="220" ry="14" fill="rgba(200,220,255,0.05)" />
          <ellipse cx="1100" cy="260" rx="280" ry="16" fill="rgba(200,220,255,0.04)" />
          <ellipse cx="1700" cy="180" rx="180" ry="12" fill="rgba(200,220,255,0.05)" />
        </motion.g>

        {/* ── L1 Distant Troodos silhouette ── */}
        <motion.g style={{ x: xFar }}>
          <path
            d="M -200 720 L 0 600 L 180 640 L 340 520 L 520 610 L 680 500 L 840 590
               L 1020 480 L 1200 580 L 1360 510 L 1540 595 L 1720 530 L 1920 610
               L 2120 580 L 2300 720 Z"
            fill="url(#farGrad)" opacity="0.85"
          />
        </motion.g>

        {/* ── L2 Mid hills + cypress trees ── */}
        <motion.g style={{ x: xMid }}>
          <path
            d="M -200 820 Q 200 700 480 780 T 980 760 T 1480 770 T 2120 740 L 2300 820 Z"
            fill="url(#midGrad)"
          />
          {[200,420,640,880,1100,1340,1580,1820,2060].map((x,i)=>(
            <g key={i} transform={`translate(${x},${755-(i%3)*8})`}>
              <ellipse cx="0" cy="0" rx="6" ry="38" fill="#050b14" />
              <rect x="-2" y="34" width="4" height="14" fill="#1a0f06" />
            </g>
          ))}
        </motion.g>

        {/* ── L3 Roadside section signs (the "stops") ── */}
        <motion.g style={{ x: xSigns }}>
          {[{x:380,label:'FLEET'},{x:880,label:'REVIEWS'},{x:1380,label:'WHY US'},{x:1880,label:'CONTACT'}].map((s,i)=>(
            <g key={i} transform={`translate(${s.x}, 720)`}>
              <rect x="-3" y="0" width="6" height="100" fill="#2a1f10" />
              <rect x="-72" y="-46" width="144" height="48" rx="4" fill="#0a1428" stroke="#d4af37" strokeWidth="2.5" />
              <rect x="-66" y="-42" width="132" height="3" fill="#d4af37" opacity="0.6" />
              <text x="0" y="-15" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif"
                    fontSize="20" fontWeight="700" letterSpacing="2" fill="#f1cf5a">
                {s.label}
              </text>
            </g>
          ))}
        </motion.g>

        {/* ── L4 Road surface + lane dashes ── */}
        <motion.g style={{ x: xRoad }}>
          <path d="M -200 820 L 2300 820 L 2300 1080 L -200 1080 Z" fill="url(#roadGrad)" />
          <line x1="-200" y1="820" x2="2300" y2="820" stroke="#2a3340" strokeWidth="1.5" />
          {Array.from({length:60}).map((_,i)=>(
            <rect key={i} x={-200+i*80} y="940" width="42" height="6" rx="1" fill="#d4af37" opacity="0.55" />
          ))}
          <rect x="-200" y="818" width="2500" height="2" fill="rgba(0,212,255,0.35)" />
        </motion.g>

        {/* ── L5 Foreground guard-rail posts (fastest) ── */}
        <motion.g style={{ x: xFg }}>
          {Array.from({length:25}).map((_,i)=>(
            <g key={i} transform={`translate(${-200+i*110}, 880)`}>
              <rect x="-2" y="0" width="4" height="36" fill="#1a1f28" />
              <rect x="-12" y="-4" width="24" height="4" rx="1" fill="#2a3340" />
            </g>
          ))}
        </motion.g>

        {/* ── FOREGROUND: anchored sedan (side profile, centered at x≈960) ── */}
        <g>
          {/* Headlight cone — sweeps the road ahead */}
          <ellipse cx="1220" cy="780" rx="260" ry="40" fill="url(#headlight)" />
          {/* Ground shadow */}
          <ellipse cx="960" cy="858" rx="320" ry="14" fill="rgba(0,0,0,0.55)" />

          {/* Lower body */}
          <path
            d="M 620 780 L 680 740 L 820 720 L 940 700 L 1120 700
               L 1220 720 L 1280 750 L 1300 790 L 1280 820 L 640 820 Z"
            fill="url(#carBody)" stroke="#5a4612" strokeWidth="1.5"
          />
          {/* Greenhouse (windows) */}
          <path d="M 780 720 L 860 660 L 1080 660 L 1140 720 Z"
                fill="#0a1428" stroke="#5a4612" strokeWidth="1.5" />
          <path d="M 800 715 L 870 668 L 980 668 L 970 715 Z" fill="rgba(0,212,255,0.18)" />
          {/* Door seam + handle */}
          <line x1="980" y1="720" x2="980" y2="790" stroke="#5a4612" strokeWidth="1" />
          <rect x="1010" y="755" width="22" height="3" rx="1" fill="#f1cf5a" />
          {/* Lights */}
          <ellipse cx="1265" cy="765" rx="14" ry="8" fill="#fffce0" />
          <rect x="650" y="755" width="10" height="14" rx="2" fill="#ff3a3a" opacity="0.9" />
          {/* Wheel wells */}
          <circle cx="840" cy="800" r="55" fill="#05070b" />
          <circle cx="1080" cy="800" r="55" fill="#05070b" />

          {/* Spinning wheels (direct-DOM rotation via ref) */}
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

        {/* ── Vignette ── */}
        <motion.rect x="0" y="0" width="1920" height="1080" fill="url(#vignetteGrad)" style={{ opacity: vigOp }} />
      </motion.svg>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          svg * { transform: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ScrollBackdrop;
