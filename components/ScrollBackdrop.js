import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop v2 — "video-like" cinematic background.
 *
 * Each orb moves in X + Y + Scale + Opacity as you scroll,
 * creating a camera-pan-through-colored-light scene:
 *   • Top of page: purple/violet dominates (cool, night-sky)
 *   • Mid-scroll:  orange sweeps through center (warm, sunset)
 *   • Bottom:      gold/yellow rises and blooms (sunrise, CTA warmth)
 *
 * Aurora rotates 180° across the full page — barely conscious but feels alive.
 * Mobile: reduce blur radius via media query (GPU savings, no JS needed).
 * Uses scrollYProgress (0→1) so animation spans the FULL page regardless of height.
 */
const ScrollBackdrop = () => {
  const { scrollYProgress } = useScroll();
  // Spring lags slightly behind scroll — feels like the scene is "floating"
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  /* ── Purple (top-left, hero zone) — retreats upper-right, shrinks, fades ── */
  const pX = useTransform(sp, [0, 1], ['0vw',  '35vw']);
  const pY = useTransform(sp, [0, 1], ['0vh', '-30vh']);
  const pS = useTransform(sp, [0, 0.5, 1], [1.05, 0.90, 0.58]);
  const pO = useTransform(sp, [0, 0.45, 1], [0.92, 0.70, 0.28]);

  /* ── Orange (right side) — sweeps left and up, peaks mid-scroll ── */
  const oX = useTransform(sp, [0, 1], ['15vw', '-28vw']);
  const oY = useTransform(sp, [0, 0.5, 1], ['8vh', '-8vh', '-24vh']);
  const oS = useTransform(sp, [0, 0.4, 1], [0.72, 1.20, 0.95]);
  const oO = useTransform(sp, [0, 0.25, 0.65, 1], [0.45, 0.88, 0.92, 0.52]);

  /* ── Yellow (bottom) — rises through the page, dominant at the end ── */
  const yX = useTransform(sp, [0, 1], ['0vw',  '12vw']);
  const yY = useTransform(sp, [0, 1], ['0vh', '-62vh']);
  const yS = useTransform(sp, [0, 0.5, 1], [0.52, 0.90, 1.32]);
  const yO = useTransform(sp, [0, 0.4, 0.7, 1], [0.22, 0.60, 0.88, 0.98]);

  /* ── Violet accent (upper-right) — drifts left, fades at bottom ── */
  const vX = useTransform(sp, [0, 1], ['0vw', '-28vw']);
  const vY = useTransform(sp, [0, 1], ['0vh',  '-8vh']);
  const vO = useTransform(sp, [0, 0.5, 1], [0.78, 0.88, 0.18]);

  /* ── Aurora conic — rotates 180° and shifts opacity through page ── */
  const aRot = useTransform(sp, [0, 1], [0, 180]);
  const aO   = useTransform(sp, [0, 0.5, 1], [0.52, 0.72, 0.40]);

  return (
    <div className="sb-wrap" aria-hidden="true">
      <style jsx>{`
        .sb-wrap {
          position: fixed; inset: 0;
          z-index: 0; pointer-events: none;
          overflow: hidden; background: #050510;
          contain: paint;
        }
        .orb {
          position: absolute; border-radius: 50%;
          will-change: transform, opacity;
        }
        /*
         * Orbs are LARGE (80-95vw) — they fill most of the viewport.
         * When framer moves them X+Y+Scale, the COLOR FIELD itself
         * sweeps across the screen → "video" / camera-pan feel.
         */
        .o-purple {
          width: 95vw; height: 95vw;
          left: -15%; top: -20%;
          background: radial-gradient(circle, rgba(124,58,237,0.92) 0%, transparent 65%);
          filter: blur(88px);
        }
        .o-orange {
          width: 78vw; height: 78vw;
          right: -14%; top: 15%;
          background: radial-gradient(circle, rgba(249,115,22,0.88) 0%, transparent 65%);
          filter: blur(82px);
        }
        .o-yellow {
          width: 82vw; height: 82vw;
          left: 5%; bottom: -25%;
          background: radial-gradient(circle, rgba(250,204,21,0.82) 0%, transparent 65%);
          filter: blur(82px);
        }
        .o-violet {
          width: 46vw; height: 46vw;
          left: 48%; top: 2%;
          background: radial-gradient(circle, rgba(167,139,250,0.92) 0%, transparent 65%);
          filter: blur(68px);
        }
        .aurora {
          position: absolute; inset: -40%;
          background: conic-gradient(from 0deg at 50% 50%,
            transparent 0deg,
            rgba(250,204,21,0.14) 60deg,
            rgba(249,115,22,0.20) 130deg,
            rgba(124,58,237,0.14) 210deg,
            transparent 280deg,
            rgba(167,139,250,0.10) 340deg,
            transparent 360deg);
          filter: blur(110px);
          mix-blend-mode: screen;
          will-change: transform, opacity;
        }
        .sb-grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.036; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        /* Mobile: halve blur — GPU is smaller, savings are real */
        @media (max-width: 768px) {
          .o-purple, .o-orange, .o-yellow { filter: blur(48px); }
          .o-violet { filter: blur(36px); }
          .aurora { filter: blur(65px); }
          .sb-grain { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-wrap * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Aurora sweep — rotates across the full page */}
      <motion.div className="aurora" style={{ rotate: aRot, opacity: aO }} />

      {/* Orbs — each pans in X+Y+Scale+Opacity creating scene-shift feel */}
      <motion.div className="orb o-purple" style={{ x: pX, y: pY, scale: pS, opacity: pO }} />
      <motion.div className="orb o-orange" style={{ x: oX, y: oY, scale: oS, opacity: oO }} />
      <motion.div className="orb o-yellow" style={{ x: yX, y: yY, scale: yS, opacity: yO }} />
      <motion.div className="orb o-violet" style={{ x: vX, y: vY, opacity: vO }} />

      <div className="sb-grain" />
    </div>
  );
};

export default ScrollBackdrop;
