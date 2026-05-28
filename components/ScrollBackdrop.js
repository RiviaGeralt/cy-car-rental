import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop — site-wide animated background that responds to scroll.
 *
 * Fixed-position, behind everything (z-index: -1). Three layered orb fields
 * + a noise grain + an aurora sweep. Each layer parallaxes at a different
 * rate via framer-motion useScroll(window), giving real depth as the user
 * scrolls the whole page (not just the hero).
 *
 * Pure CSS / SVG / framer-motion — no WebGL, CSP-safe, GPU-only transforms.
 */
const ScrollBackdrop = () => {
  const { scrollY } = useScroll();

  // Smooth scroll spring so motion isn't jittery
  const sy = useSpring(scrollY, { stiffness: 80, damping: 30, mass: 0.5 });

  // Each layer moves at a different rate (parallax)
  const yFar    = useTransform(sy, [0, 4000], [0, -200]);    // slow far layer
  const yMid    = useTransform(sy, [0, 4000], [0, -500]);    // medium
  const yNear   = useTransform(sy, [0, 4000], [0, -900]);    // fast near
  const hueShift = useTransform(sy, [0, 4000], [0, 30]);     // color drift
  const rotAur  = useTransform(sy, [0, 4000], [0, 25]);      // aurora rotate

  return (
    <div className="sb-wrap" aria-hidden="true">
      <style jsx>{`
        .sb-wrap {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
          background: #050510;
        }
        .sb-layer { position: absolute; inset: -20%; will-change: transform; }
        .sb-grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        /* Far layer — large soft orbs */
        .far-1 { width: 60vw; height: 60vw; left: -15%; top: 5%;  background: radial-gradient(circle, rgba(124, 58, 237, 0.55), transparent 70%); }
        .far-2 { width: 50vw; height: 50vw; right: -10%; top: 40%; background: radial-gradient(circle, rgba(249, 115, 22, 0.40), transparent 70%); }
        .far-3 { width: 70vw; height: 70vw; left: 20%; top: 120%; background: radial-gradient(circle, rgba(250, 204, 21, 0.30), transparent 70%); }

        /* Mid layer — medium sharper orbs */
        .mid-1 { width: 35vw; height: 35vw; left: 60%; top: 20%; background: radial-gradient(circle, rgba(167, 139, 250, 0.55), transparent 70%); filter: blur(60px); }
        .mid-2 { width: 28vw; height: 28vw; left: 10%; top: 60%; background: radial-gradient(circle, rgba(249, 115, 22, 0.50), transparent 70%); filter: blur(60px); }
        .mid-3 { width: 32vw; height: 32vw; left: 70%; top: 90%; background: radial-gradient(circle, rgba(250, 204, 21, 0.45), transparent 70%); filter: blur(60px); }
        .mid-4 { width: 26vw; height: 26vw; left: 5%;  top: 130%; background: radial-gradient(circle, rgba(124, 58, 237, 0.55), transparent 70%); filter: blur(60px); }

        /* Near layer — small bright accents */
        .near-1 { width: 18vw; height: 18vw; left: 35%; top: 30%; background: radial-gradient(circle, rgba(250, 204, 21, 0.65), transparent 65%); filter: blur(40px); }
        .near-2 { width: 14vw; height: 14vw; left: 80%; top: 70%; background: radial-gradient(circle, rgba(249, 115, 22, 0.70), transparent 65%); filter: blur(40px); }
        .near-3 { width: 20vw; height: 20vw; left: 15%; top: 110%; background: radial-gradient(circle, rgba(167, 139, 250, 0.65), transparent 65%); filter: blur(40px); }

        /* Aurora sweep — conic gradient that rotates with scroll */
        .aurora {
          position: absolute;
          inset: -30%;
          background:
            conic-gradient(from 0deg at 50% 50%,
              transparent 0deg,
              rgba(250, 204, 21, 0.20) 90deg,
              rgba(249, 115, 22, 0.25) 180deg,
              rgba(124, 58, 237, 0.20) 270deg,
              transparent 360deg);
          filter: blur(70px);
          mix-blend-mode: screen;
          opacity: 0.6;
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-layer { transform: none !important; }
        }
      `}</style>

      {/* Aurora sweep — rotates with scroll */}
      <motion.div className="sb-layer aurora" style={{ rotate: rotAur }} />

      {/* Far layer */}
      <motion.div className="sb-layer" style={{ y: yFar, filter: `hue-rotate(${hueShift.get()}deg)` }}>
        <div className="orb far-1" />
        <div className="orb far-2" />
        <div className="orb far-3" />
      </motion.div>

      {/* Mid layer */}
      <motion.div className="sb-layer" style={{ y: yMid }}>
        <div className="orb mid-1" />
        <div className="orb mid-2" />
        <div className="orb mid-3" />
        <div className="orb mid-4" />
      </motion.div>

      {/* Near layer */}
      <motion.div className="sb-layer" style={{ y: yNear }}>
        <div className="orb near-1" />
        <div className="orb near-2" />
        <div className="orb near-3" />
      </motion.div>

      {/* Noise grain */}
      <div className="sb-grain" />
    </div>
  );
};

export default ScrollBackdrop;
