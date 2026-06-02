import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop v4 — visible scene-by-scene background.
 *
 * Problem with v3: scene base colors were too dark (#0a0420 ≈ black).
 * Fix: use framer-motion's backgroundColor interpolation on the wrap itself,
 * plus colored orbs (not white+screen-blend which washes out).
 *
 * Scenes (scrollYProgress 0→1):
 *   0.00 — Purple galaxy   #120730
 *   0.25 — Deep ocean      #021e30
 *   0.50 — Burnt sunset    #2e0d00
 *   0.75 — Magenta night   #280028
 *   1.00 — Amber dawn      #2a1900
 */
const ScrollBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.6 });

  /* ── Base background color: framer interpolates hex between 5 stops ── */
  const bgColor = useTransform(
    sp,
    [0, 0.25, 0.5, 0.75, 1],
    ['#120730', '#021e30', '#2e0d00', '#280028', '#2a1900']
  );

  /* ── Orb 1 — large, sweeps left→right across page ── */
  const o1x = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-10vw', '20vw', '50vw', '20vw', '0vw']);
  const o1y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-5vh', '10vh', '5vh', '15vh', '40vh']);
  const o1s = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [1.0, 1.2, 1.4, 1.2, 1.5]);
  /* Orb colors per scene — rich, saturated, visible */
  const o1c0 = useTransform(sp, [0, 0.25], [1, 0]);   // purple
  const o1c1 = useTransform(sp, [0, 0.25, 0.5], [0, 1, 0]);   // teal
  const o1c2 = useTransform(sp, [0.25, 0.5, 0.75], [0, 1, 0]);  // orange
  const o1c3 = useTransform(sp, [0.5, 0.75, 1], [0, 1, 0]);  // magenta
  const o1c4 = useTransform(sp, [0.75, 1], [0, 1]);  // gold

  /* ── Orb 2 — counter-pan ── */
  const o2x = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['60vw', '40vw', '-5vw', '50vw', '65vw']);
  const o2y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['50vh', '30vh', '40vh', '60vh', '20vh']);
  const o2s = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [0.9, 1.3, 1.1, 1.4, 1.2]);

  /* ── Orb 3 — accent ── */
  const o3x = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['30vw', '70vw', '20vw', '60vw', '40vw']);
  const o3y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['20vh', '50vh', '70vh', '30vh', '60vh']);
  const o3s = useTransform(sp, [0, 0.5, 1], [0.7, 1.1, 0.9]);

  /* ── Aurora rotation ── */
  const aRot = useTransform(sp, [0, 1], [0, 360]);
  const aO   = useTransform(sp, [0, 0.5, 1], [0.45, 0.65, 0.45]);

  return (
    <motion.div
      className="sb-wrap"
      aria-hidden="true"
      style={{ backgroundColor: bgColor }}
    >
      <style jsx>{`
        .sb-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          contain: paint;
        }

        /* Each orb is a colored blob per scene — NO mix-blend-mode so colors are solid */
        .orb {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
          will-change: transform, opacity;
        }

        /* Orb 1: 5 colored versions, only one visible at a time */
        .o1-purple {
          width: 90vw; height: 90vw;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.65) 0%, transparent 65%);
          filter: blur(72px);
        }
        .o1-teal {
          width: 90vw; height: 90vw;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.65) 0%, transparent 65%);
          filter: blur(72px);
        }
        .o1-orange {
          width: 90vw; height: 90vw;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.75) 0%, transparent 65%);
          filter: blur(72px);
        }
        .o1-magenta {
          width: 90vw; height: 90vw;
          background: radial-gradient(circle, rgba(217, 70, 239, 0.70) 0%, transparent 65%);
          filter: blur(72px);
        }
        .o1-gold {
          width: 90vw; height: 90vw;
          background: radial-gradient(circle, rgba(250, 204, 21, 0.70) 0%, transparent 65%);
          filter: blur(72px);
        }

        /* Orb 2: counter-color — always the "next" scene accent */
        .o2 {
          width: 65vw; height: 65vw;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.55) 0%, transparent 65%);
          filter: blur(80px);
        }

        /* Orb 3: small accent */
        .o3 {
          width: 44vw; height: 44vw;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.50) 0%, transparent 65%);
          filter: blur(56px);
        }

        /* Aurora */
        .aurora {
          position: absolute;
          inset: -30%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(250, 204, 21, 0.16) 60deg,
            rgba(249, 115, 22, 0.20) 130deg,
            rgba(217, 70, 239, 0.16) 200deg,
            rgba(124, 58, 237, 0.18) 270deg,
            rgba(20, 184, 166, 0.16) 340deg,
            transparent 360deg
          );
          filter: blur(90px);
          will-change: transform, opacity;
        }

        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (max-width: 768px) {
          .o1-purple, .o1-teal, .o1-orange, .o1-magenta, .o1-gold { filter: blur(40px); }
          .o2 { filter: blur(45px); }
          .o3 { filter: blur(32px); }
          .aurora { filter: blur(55px); }
          .grain { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-wrap * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Aurora — full 360° rotation */}
      <motion.div className="aurora" style={{ rotate: aRot, opacity: aO }} />

      {/* Orb 1: 5 colored versions crossfading per scene */}
      <motion.div className="orb o1-purple" style={{ x: o1x, y: o1y, scale: o1s, opacity: o1c0 }} />
      <motion.div className="orb o1-teal"   style={{ x: o1x, y: o1y, scale: o1s, opacity: o1c1 }} />
      <motion.div className="orb o1-orange" style={{ x: o1x, y: o1y, scale: o1s, opacity: o1c2 }} />
      <motion.div className="orb o1-magenta" style={{ x: o1x, y: o1y, scale: o1s, opacity: o1c3 }} />
      <motion.div className="orb o1-gold"   style={{ x: o1x, y: o1y, scale: o1s, opacity: o1c4 }} />

      {/* Orb 2 & 3 — persistent accent orbs that travel */}
      <motion.div className="orb o2" style={{ x: o2x, y: o2y, scale: o2s }} />
      <motion.div className="orb o3" style={{ x: o3x, y: o3y, scale: o3s }} />

      <div className="grain" />
    </motion.div>
  );
};

export default ScrollBackdrop;
