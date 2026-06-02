import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop v3 — scene-crossfade cinematic background.
 *
 * The entire page background transforms through 5 distinct scenes as you scroll.
 * Implementation: 5 full-screen gradient layers stacked with crossfade opacity
 * driven by scrollYProgress (0→1). Plus 3 traveling orbs that pan + scale + fade.
 *
 * Scene map:
 *   0.00 — Midnight purple   (hero zone)
 *   0.25 — Deep ocean teal   (fleet)
 *   0.50 — Sunset amber      (testimonials)
 *   0.75 — Magenta dusk      (benefits)
 *   1.00 — Gold dawn         (CTA)
 *
 * Each scene layer peaks in opacity at its scroll point and fades into neighbors,
 * so the background visibly morphs scene-by-scene as you scroll the page.
 */
const ScrollBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.6 });

  /* ──── Scene crossfade opacities — triangular peaks at 0 / .25 / .5 / .75 / 1 ──── */
  const sc0 = useTransform(sp, [0, 0.25],         [1, 0]);
  const sc1 = useTransform(sp, [0, 0.25, 0.5],    [0, 1, 0]);
  const sc2 = useTransform(sp, [0.25, 0.5, 0.75], [0, 1, 0]);
  const sc3 = useTransform(sp, [0.5, 0.75, 1],    [0, 1, 0]);
  const sc4 = useTransform(sp, [0.75, 1],         [0, 1]);

  /* ──── Orb 1 — sweeps left→center→right→loop, large primary orb ──── */
  const o1X = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-10vw', '20vw', '50vw', '20vw',  '0vw']);
  const o1Y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [' -5vh', '10vh',  '5vh', '15vh', '40vh']);
  const o1S = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [   1.0,    1.2,    1.4,    1.2,   1.5]);

  /* ──── Orb 2 — counter-pan, medium ──── */
  const o2X = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['60vw', '40vw', '-10vw', '50vw', '70vw']);
  const o2Y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['50vh', '30vh',  '40vh', '60vh', '20vh']);
  const o2S = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [   0.9,    1.3,    1.1,    1.4,    1.2]);

  /* ──── Orb 3 — accent diagonal drift, smaller ──── */
  const o3X = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['30vw', '70vw', '20vw', '60vw', '40vw']);
  const o3Y = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['20vh', '50vh', '70vh', '30vh', '60vh']);
  const o3S = useTransform(sp, [0, 0.5, 1],             [   0.7,    1.1,    0.9]);

  /* ──── Aurora rotation 360° + scroll-driven opacity ──── */
  const aRot = useTransform(sp, [0, 1], [0, 360]);
  const aO   = useTransform(sp, [0, 0.5, 1], [0.5, 0.75, 0.5]);

  return (
    <div className="sb-wrap" aria-hidden="true">
      <style jsx>{`
        .sb-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #05050f;
          contain: paint;
        }
        /* Each scene layer fills viewport; crossfade gives the morph effect */
        .scene {
          position: absolute;
          inset: 0;
          will-change: opacity;
        }
        .scene-0 {
          background:
            radial-gradient(ellipse at 25% 20%, rgba(139, 92, 246, 0.85), transparent 55%),
            radial-gradient(ellipse at 75% 80%, rgba(217, 70, 239, 0.55), transparent 60%),
            linear-gradient(180deg, #0a0420 0%, #1a0840 100%);
        }
        .scene-1 {
          background:
            radial-gradient(ellipse at 70% 30%, rgba(20, 184, 166, 0.85), transparent 55%),
            radial-gradient(ellipse at 30% 70%, rgba(6, 182, 212, 0.65), transparent 60%),
            linear-gradient(180deg, #04181f 0%, #073640 100%);
        }
        .scene-2 {
          background:
            radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.85), transparent 55%),
            radial-gradient(ellipse at 20% 20%, rgba(244, 63, 94, 0.55), transparent 60%),
            linear-gradient(180deg, #1f0d04 0%, #401a08 100%);
        }
        .scene-3 {
          background:
            radial-gradient(ellipse at 30% 70%, rgba(217, 70, 239, 0.85), transparent 55%),
            radial-gradient(ellipse at 80% 30%, rgba(168, 85, 247, 0.55), transparent 60%),
            linear-gradient(180deg, #1a041a 0%, #350836 100%);
        }
        .scene-4 {
          background:
            radial-gradient(ellipse at 50% 80%, rgba(250, 204, 21, 0.85), transparent 55%),
            radial-gradient(ellipse at 20% 30%, rgba(245, 158, 11, 0.55), transparent 60%),
            linear-gradient(180deg, #1f1604 0%, #3d2b08 100%);
        }

        /* Orbs */
        .orb {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
          will-change: transform;
          mix-blend-mode: screen;
        }
        .orb-1 {
          width: 80vw;
          height: 80vw;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 65%);
          filter: blur(80px);
        }
        .orb-2 {
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 65%);
          filter: blur(85px);
        }
        .orb-3 {
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 65%);
          filter: blur(60px);
        }

        /* Aurora */
        .aurora {
          position: absolute;
          inset: -30%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(250, 204, 21, 0.18) 60deg,
            rgba(249, 115, 22, 0.22) 130deg,
            rgba(217, 70, 239, 0.18) 200deg,
            rgba(124, 58, 237, 0.20) 270deg,
            rgba(20, 184, 166, 0.18) 340deg,
            transparent 360deg
          );
          filter: blur(100px);
          mix-blend-mode: screen;
          will-change: transform, opacity;
        }

        /* Film grain */
        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Mobile — halve blur for GPU savings */
        @media (max-width: 768px) {
          .orb-1, .orb-2 { filter: blur(45px); }
          .orb-3 { filter: blur(32px); }
          .aurora { filter: blur(60px); }
          .grain { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-wrap, .sb-wrap * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* 5 scene layers — crossfade by opacity as scroll progresses */}
      <motion.div className="scene scene-0" style={{ opacity: sc0 }} />
      <motion.div className="scene scene-1" style={{ opacity: sc1 }} />
      <motion.div className="scene scene-2" style={{ opacity: sc2 }} />
      <motion.div className="scene scene-3" style={{ opacity: sc3 }} />
      <motion.div className="scene scene-4" style={{ opacity: sc4 }} />

      {/* Aurora — rotates 360° across the page */}
      <motion.div className="aurora" style={{ rotate: aRot, opacity: aO }} />

      {/* Traveling orbs — pan + scale per scroll */}
      <motion.div className="orb orb-1" style={{ x: o1X, y: o1Y, scale: o1S }} />
      <motion.div className="orb orb-2" style={{ x: o2X, y: o2Y, scale: o2S }} />
      <motion.div className="orb orb-3" style={{ x: o3X, y: o3Y, scale: o3S }} />

      <div className="grain" />
    </div>
  );
};

export default ScrollBackdrop;
