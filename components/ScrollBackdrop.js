import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

/**
 * ScrollBackdrop v7 — Cyprus road journey.
 *
 * A top-down night scene of a winding Cyprus coastal road.
 * A gold car (matching brand color #d4af37) drives along the road
 * as you scroll — each website section is a glowing stop marker on the route.
 *
 * Technique: SVG path + getPointAtLength + direct DOM attribute updates
 * (no setState = no re-renders = smooth 60fps animation).
 *
 * Scene: night sky, crescent moon, stars, dark Mediterranean sea (right),
 * terrain/hills (left), cypress trees, coastal town, winding road.
 *
 * Car scales down as it moves toward the horizon (depth illusion).
 * Stop markers glow at section positions (0 / 25 / 50 / 75 / 100%).
 */

// Road path: bottom-center → winding → top-center (same road the whole way)
const ROAD_D =
  'M 960 1050 C 820 880 1100 760 940 630 C 780 500 1160 400 1020 280 C 880 160 1050 80 960 0';

// t values for section stops along the road
const STOP_TS = [0, 0.25, 0.5, 0.75, 1.0];
const STOP_LABELS = ['Start', 'Fleet', 'Reviews', 'Benefits', 'Contact'];

// Deterministic star positions (no random on render)
function makeStars(n) {
  const s = [];
  for (let i = 0; i < n; i++) {
    s.push({
      x: (i * 1543 + 712) % 1920,
      y: (i * 937 + 231) % 480,
      r: i % 4 === 0 ? 1.8 : i % 3 === 0 ? 1.2 : 0.8,
      o: 0.20 + (i % 7) * 0.11,
    });
  }
  return s;
}
const STARS = makeStars(90);

export default function ScrollBackdrop() {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.5 });

  const pathRef = useRef(null);
  const carRef  = useRef(null);
  const glowRef = useRef(null);
  const [stops, setStops] = useState([]);

  // Compute stop positions on the road after mount
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    setStops(
      STOP_TS.map((t, i) => {
        const pt = p.getPointAtLength(t * len);
        return { x: pt.x, y: pt.y, label: STOP_LABELS[i] };
      })
    );
    // Set initial car position
    const pt0 = p.getPointAtLength(0);
    const pt1 = p.getPointAtLength(3);
    const a0 = Math.atan2(pt1.y - pt0.y, pt1.x - pt0.x) * (180 / Math.PI);
    if (carRef.current) {
      carRef.current.setAttribute(
        'transform',
        `translate(${pt0.x},${pt0.y}) rotate(${a0 + 90}) scale(1)`
      );
    }
    if (glowRef.current) {
      glowRef.current.setAttribute('transform', `translate(${pt0.x},${pt0.y}) rotate(${a0 + 90})`);
    }
  }, []);

  // Animate car along road on scroll (direct DOM — no re-render = 60fps)
  useMotionValueEvent(sp, 'change', (raw) => {
    const p   = pathRef.current;
    const car = carRef.current;
    const gl  = glowRef.current;
    if (!p || !car) return;

    const t    = Math.max(0, Math.min(1, raw));
    const len  = p.getTotalLength();
    const dist = t * len;
    const pt   = p.getPointAtLength(dist);
    const pt2  = p.getPointAtLength(Math.min(dist + 3, len));

    // Angle car along road direction
    const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

    // Car shrinks as it moves toward horizon (t=0 bottom/large → t=1 top/small)
    const scale = 1.0 - t * 0.65;

    car.setAttribute(
      'transform',
      `translate(${pt.x},${pt.y}) rotate(${angle + 90}) scale(${scale})`
    );
    if (gl) {
      gl.setAttribute(
        'transform',
        `translate(${pt.x},${pt.y}) rotate(${angle + 90}) scale(${scale})`
      );
    }
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden', background: '#04080f',
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#02040c" />
            <stop offset="55%"  stopColor="#060d1e" />
            <stop offset="100%" stopColor="#04111a" />
          </linearGradient>
          <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#041e30" />
            <stop offset="100%" stopColor="#020c18" />
          </linearGradient>
          <linearGradient id="terrainG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#040c04" />
            <stop offset="100%" stopColor="#091508" />
          </linearGradient>
          <radialGradient id="vigG" cx="50%" cy="50%" r="72%">
            <stop offset="45%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.82)" />
          </radialGradient>
          <radialGradient id="moonGlowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(230,220,180,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Soft blur for glow effects */}
          <filter id="softBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="stopGlowF" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="carShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="rgba(0,0,0,0.8)" />
          </filter>
          <filter id="roadEdgeGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Sky ── */}
        <rect width="1920" height="1080" fill="url(#skyG)" />

        {/* ── Stars ── */}
        {STARS.map(({ x, y, r, o }, i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o} />
        ))}

        {/* ── Moon (crescent) ── */}
        <circle cx="250" cy="140" r="80" fill="rgba(230,220,180,0.07)" />
        <circle cx="250" cy="140" r="44" fill="#ece7cc" opacity="0.72" />
        <circle cx="274" cy="128" r="38" fill="#060d1e" opacity="0.97" />

        {/* ── Sea / Mediterranean (right side) ── */}
        <path
          d="M 850 0 L 1920 0 L 1920 1080 L 660 1080 Z"
          fill="url(#seaG)"
        />
        {/* Sea shimmer lines */}
        {[190, 330, 480, 640, 800, 960].map((y, i) => (
          <line
            key={i}
            x1={875 + i * 12} y1={y}
            x2={1780 - i * 8} y2={y + 18}
            stroke="rgba(0,180,220,0.07)" strokeWidth="2"
          />
        ))}
        {/* Distant sea horizon glow */}
        <ellipse cx="1300" cy="60" rx="500" ry="50" fill="rgba(0,180,200,0.04)" />

        {/* ── Terrain / hills (left side) ── */}
        <path
          d="M 0 0 L 850 0 L 660 1080 L 0 1080 Z"
          fill="url(#terrainG)"
        />
        {/* Hill silhouette */}
        <path
          d="M 0 0 C 120 90 270 50 420 110 C 560 170 680 90 850 0 L 0 0 Z"
          fill="#030703"
          opacity="0.85"
        />

        {/* ── Road shadow layer ── */}
        <path
          d={ROAD_D}
          fill="none"
          stroke="rgba(0,0,0,0.65)"
          strokeWidth="140"
          strokeLinecap="round"
        />

        {/* ── Road surface (asphalt) ── */}
        <path
          ref={pathRef}
          d={ROAD_D}
          fill="none"
          stroke="#1b1b26"
          strokeWidth="100"
          strokeLinecap="round"
        />

        {/* ── Road shoulder / edges ── */}
        <path
          d={ROAD_D}
          fill="none"
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#roadEdgeGlow)"
        />

        {/* ── Road center line (yellow dashes) ── */}
        <path
          d={ROAD_D}
          fill="none"
          stroke="rgba(212,175,55,0.55)"
          strokeWidth="3"
          strokeDasharray="44 34"
          strokeLinecap="round"
        />

        {/* ── Cypress trees (left / terrain side) ── */}
        {[
          [818, 730], [788, 608], [804, 488], [832, 368], [856, 248], [875, 148],
          [748, 768], [732, 628], [745, 500], [768, 375], [795, 258],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {/* Trunk */}
            <rect x="-3" y="0" width="6" height="18" fill="#1a0d04" rx="2" />
            {/* Tree body — tall narrow (cypress shape) */}
            <ellipse cx="0" cy="-38" rx="11" ry="44" fill="#0b2a0b" />
            <ellipse cx="0" cy="-42" rx="7"  ry="32" fill="#0e330e" opacity="0.75" />
          </g>
        ))}

        {/* ── Coastal town / buildings (right / sea side) ── */}
        {[
          { x: 1175, y: 318, w: 46, h: 36 },
          { x: 1338, y: 270, w: 33, h: 29 },
          { x: 1475, y: 335, w: 52, h: 40 },
          { x: 1095, y: 385, w: 40, h: 32 },
          { x: 1248, y: 208, w: 30, h: 24 },
          { x: 1570, y: 290, w: 28, h: 22 },
        ].map(({ x, y, w, h }, i) => (
          <g key={i}>
            {/* Building body */}
            <rect x={x} y={y} width={w} height={h} fill="#061624" opacity="0.92" rx="2" />
            {/* Roof */}
            <polygon
              points={`${x},${y} ${x + w},${y} ${x + w / 2},${y - h * 0.44}`}
              fill="#081d30" opacity="0.9"
            />
            {/* Warm window light */}
            <rect
              x={x + w * 0.28} y={y + h * 0.35}
              width={w * 0.22} height={h * 0.24}
              fill="rgba(255,185,70,0.32)" rx="1"
            />
          </g>
        ))}

        {/* ── Section stop markers (computed positions on road) ── */}
        {stops.map(({ x, y, label }, i) => (
          <g key={i}>
            {/* Outer pulse ring */}
            <circle cx={x} cy={y} r={24} fill="none"
              stroke="rgba(0,212,255,0.20)" strokeWidth="2" />
            {/* Glow dot */}
            <circle cx={x} cy={y} r={11}
              fill="rgba(0,212,255,0.65)"
              filter="url(#stopGlowF)"
            />
            {/* Core */}
            <circle cx={x} cy={y} r={5} fill="white" opacity="0.92" />
          </g>
        ))}

        {/* ── Headlight cone (rendered before car so car draws on top) ── */}
        <g ref={glowRef} transform="translate(960,1050) rotate(0)">
          <ellipse
            cx="0" cy="-75"
            rx="26" ry="90"
            fill="rgba(255,240,155,0.16)"
            filter="url(#softBlur)"
          />
        </g>

        {/* ── Car (top-down, brand gold #d4af37) ── */}
        <g ref={carRef} transform="translate(960,1050) rotate(0)" filter="url(#carShadow)">
          {/* Body */}
          <rect x="-18" y="-34" width="36" height="68" rx="10" fill="#d4af37" />
          {/* Body highlight stripe */}
          <rect x="-6" y="-28" width="14" height="52" rx="5" fill="rgba(255,255,255,0.08)" />
          {/* Cabin / glass */}
          <rect x="-13" y="-23" width="26" height="30" rx="5"
            fill="rgba(60,165,225,0.28)"
            stroke="rgba(255,255,255,0.14)" strokeWidth="1"
          />
          {/* Front windshield glare */}
          <rect x="-9" y="-22" width="15" height="5" rx="2" fill="rgba(255,255,255,0.28)" />
          {/* Rear window */}
          <rect x="-9" y="9"  width="15" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
          {/* Wheels — 4 corners */}
          <rect x="-24" y="-27" width="9" height="16" rx="3" fill="#0f0f0f" />
          <rect x="15"  y="-27" width="9" height="16" rx="3" fill="#0f0f0f" />
          <rect x="-24" y="11"  width="9" height="16" rx="3" fill="#0f0f0f" />
          <rect x="15"  y="11"  width="9" height="16" rx="3" fill="#0f0f0f" />
          {/* Headlights (front) */}
          <rect x="-13" y="-36" width="10" height="4" rx="2" fill="rgba(255,235,155,0.96)" />
          <rect x="3"   y="-36" width="10" height="4" rx="2" fill="rgba(255,235,155,0.96)" />
          {/* Taillights (rear) */}
          <rect x="-13" y="32"  width="10" height="4" rx="2" fill="rgba(255,50,50,0.90)" />
          <rect x="3"   y="32"  width="10" height="4" rx="2" fill="rgba(255,50,50,0.90)" />
        </g>

        {/* ── Edge vignette (darkens corners) ── */}
        <rect width="1920" height="1080" fill="url(#vigG)" />

        {/* ── Cyan horizon glow (distant coast) ── */}
        <ellipse cx="960" cy="55" rx="380" ry="55" fill="rgba(0,212,255,0.04)" />
      </svg>
    </div>
  );
}
