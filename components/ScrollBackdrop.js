import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop — site-wide animated parallax background.
 *
 * FIX: was z-index:-1 which html{background:#050510} buried (canvas paint
 * happens before z-index:<0 in root stacking context on some browsers).
 * Now z-index:0. .container in Home.module.css must be position:relative; z-index:1.
 *
 * Orbs are viewport-relative (position:fixed base) so they stay visible
 * throughout the whole page. Parallax at 3 speeds creates depth on scroll.
 * CSS @keyframes breathe even at rest.
 */
const ScrollBackdrop = () => {
  const { scrollY } = useScroll();

  // Tighter range = parallax visible on ~2000px page
  const sy = useSpring(scrollY, { stiffness: 70, damping: 28, mass: 0.4 });

  const yFar  = useTransform(sy, [0, 1800], [0, -160]);
  const yMid  = useTransform(sy, [0, 1800], [0, -380]);
  const yNear = useTransform(sy, [0, 1800], [0, -680]);
  const rotAur = useTransform(sy, [0, 1800], [0, 35]);

  return (
    <div className="sb-wrap" aria-hidden="true">
      <style jsx>{`
        /* ── z-index:0 — sits above html canvas bg, below container (z:1) ── */
        .sb-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #050510;
        }
        .sb-layer {
          position: absolute;
          inset: -25%;
          will-change: transform;
        }

        /* ── Orbs ── */
        .orb { position: absolute; border-radius: 50%; }

        /* Far — large, slow, heavy blur */
        .far-1 {
          width: 65vw; height: 65vw; left: -12%; top: 8%;
          background: radial-gradient(circle, rgba(124,58,237,0.70), transparent 68%);
          filter: blur(90px);
          animation: sbBreath1 12s ease-in-out infinite alternate;
        }
        .far-2 {
          width: 55vw; height: 55vw; right: -8%; top: 55%;
          background: radial-gradient(circle, rgba(249,115,22,0.60), transparent 68%);
          filter: blur(90px);
          animation: sbBreath2 15s ease-in-out infinite alternate-reverse;
        }
        .far-3 {
          width: 60vw; height: 60vw; left: 22%; top: 78%;
          background: radial-gradient(circle, rgba(250,204,21,0.45), transparent 68%);
          filter: blur(90px);
          animation: sbBreath1 18s ease-in-out infinite alternate;
        }

        /* Mid — medium, medium blur */
        .mid-1 {
          width: 38vw; height: 38vw; left: 58%; top: 12%;
          background: radial-gradient(circle, rgba(167,139,250,0.70), transparent 68%);
          filter: blur(65px);
          animation: sbBreath2 10s ease-in-out infinite alternate;
        }
        .mid-2 {
          width: 30vw; height: 30vw; left: 6%; top: 52%;
          background: radial-gradient(circle, rgba(249,115,22,0.65), transparent 68%);
          filter: blur(65px);
          animation: sbBreath1 13s ease-in-out infinite alternate-reverse;
        }
        .mid-3 {
          width: 34vw; height: 34vw; left: 62%; top: 72%;
          background: radial-gradient(circle, rgba(250,204,21,0.55), transparent 68%);
          filter: blur(65px);
          animation: sbBreath2 16s ease-in-out infinite alternate;
        }

        /* Near — small, sharp, fast parallax */
        .near-1 {
          width: 20vw; height: 20vw; left: 32%; top: 22%;
          background: radial-gradient(circle, rgba(250,204,21,0.80), transparent 62%);
          filter: blur(45px);
          animation: sbBreath1 8s ease-in-out infinite alternate;
        }
        .near-2 {
          width: 16vw; height: 16vw; left: 74%; top: 58%;
          background: radial-gradient(circle, rgba(249,115,22,0.85), transparent 62%);
          filter: blur(45px);
          animation: sbBreath2 11s ease-in-out infinite alternate-reverse;
        }
        .near-3 {
          width: 22vw; height: 22vw; left: 8%; top: 82%;
          background: radial-gradient(circle, rgba(167,139,250,0.75), transparent 62%);
          filter: blur(45px);
          animation: sbBreath1 14s ease-in-out infinite alternate;
        }

        /* Aurora conic sweep */
        .aurora {
          position: absolute; inset: -30%;
          background: conic-gradient(from 0deg at 50% 50%,
            transparent 0deg,
            rgba(250,204,21,0.22) 90deg,
            rgba(249,115,22,0.28) 180deg,
            rgba(124,58,237,0.22) 270deg,
            transparent 360deg);
          filter: blur(80px);
          mix-blend-mode: screen;
          opacity: 0.65;
        }

        /* Breathing keyframes — GPU only (scale + opacity) */
        @keyframes sbBreath1 {
          0%   { opacity: 0.75; transform: scale(0.95); }
          100% { opacity: 1;    transform: scale(1.05); }
        }
        @keyframes sbBreath2 {
          0%   { opacity: 0.65; transform: scale(1.02) translateX(-2%); }
          100% { opacity: 0.95; transform: scale(0.97) translateX(2%); }
        }

        .sb-grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.045; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-layer { transform: none !important; }
          .orb { animation: none !important; }
        }
      `}</style>

      {/* Aurora — rotates with scroll */}
      <motion.div className="sb-layer aurora" style={{ rotate: rotAur }} />

      {/* Far — slowest parallax */}
      <motion.div className="sb-layer" style={{ y: yFar }}>
        <div className="orb far-1" />
        <div className="orb far-2" />
        <div className="orb far-3" />
      </motion.div>

      {/* Mid — medium parallax */}
      <motion.div className="sb-layer" style={{ y: yMid }}>
        <div className="orb mid-1" />
        <div className="orb mid-2" />
        <div className="orb mid-3" />
      </motion.div>

      {/* Near — fastest parallax */}
      <motion.div className="sb-layer" style={{ y: yNear }}>
        <div className="orb near-1" />
        <div className="orb near-2" />
        <div className="orb near-3" />
      </motion.div>

      <div className="sb-grain" />
    </div>
  );
};

export default ScrollBackdrop;
