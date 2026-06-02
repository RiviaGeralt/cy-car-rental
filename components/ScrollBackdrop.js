import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * ScrollBackdrop v6 — brand-matched, scroll-driven.
 *
 * Site colors: cyan #00d4ff + gold #d4af37 on deep navy.
 * Two large brand-colored orbs travel dramatically across the page as you scroll.
 * Background stays deep navy throughout; orbs provide the vivid color shift.
 *
 * Effect:
 *   Hero     → cyan orb top-left  + gold orb bottom-right
 *   Fleet    → cyan sweeps right,  gold rises left
 *   Reviews  → gold dominates center (warm, trust)
 *   Benefits → cyan returns top,   gold fades bottom
 *   CTA      → gold bloom center   (warmth, conversion)
 *
 * CSS animation-timeline drives bg-color as fallback tint layer.
 */
const ScrollBackdrop = () => {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  /* ── Cyan orb (primary brand color) ── */
  const cX = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-10vw', '50vw',  '80vw', '10vw', '30vw']);
  const cY = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['-10vh', '20vh',  '50vh', '5vh',  '30vh']);
  const cS = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [1.2, 0.9, 0.7, 1.3, 1.0]);
  const cO = useTransform(sp, [0, 0.1, 0.5, 0.8, 1],   [0,   0.9, 0.5, 0.9, 0.4]);

  /* ── Gold orb (secondary brand color) ── */
  const gX = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['55vw', '10vw', '15vw', '60vw', '20vw']);
  const gY = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], ['55vh', '40vh', '20vh', '50vh', '35vh']);
  const gS = useTransform(sp, [0, 0.25, 0.5, 0.75, 1], [0.8, 1.1, 1.5, 0.9, 1.4]);
  const gO = useTransform(sp, [0, 0.1, 0.4, 0.65, 1],  [0,   0.5, 0.9, 0.8, 1.0]);

  /* ── Small teal accent orb ── */
  const aX = useTransform(sp, [0, 0.5, 1], ['25vw', '65vw', '10vw']);
  const aY = useTransform(sp, [0, 0.5, 1], ['40vh', '10vh', '70vh']);
  const aS = useTransform(sp, [0, 0.5, 1], [0.6, 1.0, 0.8]);

  /* ── Aurora ── */
  const aRot = useTransform(sp, [0, 1], [0, 360]);

  return (
    <div className="sb-wrap" aria-hidden="true">
      <style jsx>{`
        /* Subtle tint shift matching brand colors */
        @keyframes bg-tint {
          0%   { background-color: #04111a; }   /* cyan-tinted dark */
          25%  { background-color: #06181a; }   /* teal-dark */
          50%  { background-color: #1a1004; }   /* gold-tinted dark */
          75%  { background-color: #04101a; }   /* back to cool */
          100% { background-color: #1a1200; }   /* warm gold dark */
        }

        .sb-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background-color: #04111a;
          animation: bg-tint linear both;
          animation-timeline: scroll(root block);
        }

        .orb {
          position: absolute;
          top: 0; left: 0;
          border-radius: 50%;
          will-change: transform, opacity;
        }

        /* Cyan orb — brand primary */
        .o-cyan {
          width: 100vw; height: 100vw;
          background: radial-gradient(circle,
            rgba(0, 212, 255, 0.55) 0%,
            rgba(0, 150, 200, 0.30) 35%,
            transparent 65%
          );
          filter: blur(55px);
        }

        /* Gold orb — brand secondary */
        .o-gold {
          width: 90vw; height: 90vw;
          background: radial-gradient(circle,
            rgba(212, 175, 55, 0.60) 0%,
            rgba(180, 130, 20, 0.35) 35%,
            transparent 65%
          );
          filter: blur(55px);
        }

        /* Small teal accent */
        .o-teal {
          width: 50vw; height: 50vw;
          background: radial-gradient(circle,
            rgba(0, 180, 200, 0.45) 0%,
            transparent 60%
          );
          filter: blur(40px);
        }

        /* Aurora — subtle color sweep */
        .aurora {
          position: absolute;
          inset: -30%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(0, 212, 255, 0.12) 80deg,
            rgba(212, 175, 55, 0.15) 180deg,
            rgba(0, 180, 200, 0.10) 280deg,
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
          .o-cyan, .o-gold { filter: blur(36px); }
          .o-teal { filter: blur(28px); }
          .aurora { filter: blur(50px); }
          .grain { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-wrap { animation: none !important; }
          .sb-wrap * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <motion.div className="aurora" style={{ rotate: aRot, opacity: 0.9 }} />

      {/* Two brand-colored orbs moving dramatically */}
      <motion.div className="orb o-cyan" style={{ x: cX, y: cY, scale: cS, opacity: cO }} />
      <motion.div className="orb o-gold" style={{ x: gX, y: gY, scale: gS, opacity: gO }} />
      <motion.div className="orb o-teal" style={{ x: aX, y: aY, scale: aS }} />

      <div className="grain" />
    </div>
  );
};

export default ScrollBackdrop;
