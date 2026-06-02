import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop v5 — finally visible.
 *
 * Root cause of v3/v4 invisibility:
 *   - Dark section cards (rgba 20,30,48,0.5) blend with backdrop
 *   - #5c2000 backdrop + rgba card = still dark brown. Invisible.
 *   - Fix: use vivid colors bright enough to tint through the card overlay.
 *
 * Math: card rgba(20,30,48,0.5) + backdrop #9a3412:
 *   R: 0.5*20 + 0.5*154 = 87
 *   G: 0.5*30 + 0.5*52  = 41
 *   B: 0.5*48 + 0.5*18  = 33  → rgb(87,41,33) = clearly visible rust ✓
 *
 * Scenes:
 *   0%   — Vivid violet  #5b21b6  (hero)
 *   25%  — Deep teal     #0c4a6e  (fleet)
 *   50%  — Rust orange   #9a3412  (testimonials)
 *   75%  — Magenta       #86198f  (benefits)
 *   100% — Amber         #92400e  (CTA)
 *
 * Uses CSS animation-timeline: scroll() for background — pure CSS, no JS timing.
 * Framer handles orb movement (position/scale).
 */
const ScrollBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  /* ── Orb 1 — sweeps across page ── */
  const o1x = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-5vw', '25vw', '55vw', '25vw', '5vw']);
  const o1y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-10vh', '5vh', '10vh', '20vh', '45vh']);
  const o1s = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [1.0, 1.3, 1.5, 1.2, 1.6]);
  const o1O = useTransform(sp, [0, 0.1], [0, 1]); // fade in on load

  /* ── Orb 2 — counter-pan ── */
  const o2x = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['65vw', '45vw', '-5vw', '55vw', '70vw']);
  const o2y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['55vh', '35vh', '45vh', '65vh', '25vh']);
  const o2s = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [0.9, 1.3, 1.1, 1.5, 1.2]);

  /* ── Aurora rotation ── */
  const aRot = useTransform(sp, [0, 1], [0, 360]);

  return (
    <div className="sb-wrap" aria-hidden="true">
      <style jsx>{`
        @keyframes bg-scene {
          0%   { background-color: #5b21b6; }
          25%  { background-color: #0c4a6e; }
          50%  { background-color: #9a3412; }
          75%  { background-color: #86198f; }
          100% { background-color: #92400e; }
        }

        .sb-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          /* CSS scroll-driven animation — most reliable approach */
          background-color: #5b21b6;
          animation: bg-scene linear both;
          animation-timeline: scroll(root block);
        }

        .orb {
          position: absolute;
          top: 0; left: 0;
          border-radius: 50%;
          will-change: transform, opacity;
        }

        /* Orb 1 — vivid, large, less blur so color stays punchy */
        .o1 {
          width: 85vw; height: 85vw;
          background: radial-gradient(circle,
            rgba(167, 139, 250, 0.80) 0%,
            rgba(109, 40, 217, 0.50) 35%,
            transparent 65%
          );
          filter: blur(50px);
        }

        /* Orb 2 — complementary accent */
        .o2 {
          width: 60vw; height: 60vw;
          background: radial-gradient(circle,
            rgba(251, 191, 36, 0.70) 0%,
            rgba(249, 115, 22, 0.40) 40%,
            transparent 65%
          );
          filter: blur(55px);
        }

        /* Aurora */
        .aurora {
          position: absolute;
          inset: -30%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(250, 204, 21, 0.20) 60deg,
            rgba(249, 115, 22, 0.24) 130deg,
            rgba(217, 70, 239, 0.20) 200deg,
            rgba(124, 58, 237, 0.22) 270deg,
            rgba(20, 184, 166, 0.20) 340deg,
            transparent 360deg
          );
          filter: blur(80px);
          will-change: transform;
        }

        .grain {
          position: absolute; inset: 0;
          opacity: 0.04; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (max-width: 768px) {
          .o1 { filter: blur(32px); }
          .o2 { filter: blur(36px); }
          .aurora { filter: blur(50px); }
          .grain { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-wrap { animation: none !important; }
          .sb-wrap * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <motion.div className="aurora" style={{ rotate: aRot, opacity: 0.8 }} />
      <motion.div className="orb o1" style={{ x: o1x, y: o1y, scale: o1s, opacity: o1O }} />
      <motion.div className="orb o2" style={{ x: o2x, y: o2y, scale: o2s }} />
      <div className="grain" />
    </div>
  );
};

export default ScrollBackdrop;
