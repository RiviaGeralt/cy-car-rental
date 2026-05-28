import React from 'react';

/**
 * AuroraBackground — 21st.dev / Aceternity-style animated aurora.
 *
 * Pure CSS (no JS animation cost). Two layered conic-gradient blobs
 * drift on a 14s + 22s loop, blurred to feel painterly. Sits BEHIND
 * the R3F canvas; canvas keeps transparent alpha so the aurora shows
 * through dark voids in the 3D scene.
 *
 * Palette: amber/orange/purple — matches the Cyprus Road brand
 * (golden-hour Mediterranean) and the existing hero gradients.
 *
 * Performance:
 *   - transform-only animation (GPU compositor, no layout/paint)
 *   - will-change hint
 *   - opacity 0.55 so the 3D scene stays the focal point
 *   - pointer-events:none — never blocks touch/scroll
 */
const AuroraBackground = () => (
  <div className="aurora-bg" aria-hidden="true">
    <style jsx>{`
      .aurora-bg {
        position: absolute;
        inset: -20% -10%;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
        filter: blur(60px) saturate(140%);
        opacity: 0.55;
      }
      .aurora-bg::before,
      .aurora-bg::after {
        content: '';
        position: absolute;
        inset: 0;
        background-repeat: no-repeat;
        will-change: transform, opacity;
      }
      /* Warm sweep (amber → orange) */
      .aurora-bg::before {
        background-image:
          radial-gradient(closest-side at 25% 30%, rgba(250, 204, 21, 0.85), transparent 70%),
          radial-gradient(closest-side at 75% 70%, rgba(249, 115, 22, 0.85), transparent 70%),
          conic-gradient(from 180deg at 50% 50%,
            rgba(254, 243, 199, 0.0) 0deg,
            rgba(250, 204, 21, 0.45) 90deg,
            rgba(249, 115, 22, 0.55) 180deg,
            rgba(254, 243, 199, 0.0) 360deg);
        animation: aurora-drift-a 22s ease-in-out infinite alternate;
      }
      /* Cool sweep (purple) — adds depth */
      .aurora-bg::after {
        background-image:
          radial-gradient(closest-side at 70% 20%, rgba(167, 139, 250, 0.7), transparent 65%),
          radial-gradient(closest-side at 20% 80%, rgba(124, 58, 237, 0.6), transparent 65%);
        animation: aurora-drift-b 14s ease-in-out infinite alternate;
        mix-blend-mode: screen;
      }
      @keyframes aurora-drift-a {
        0%   { transform: translate3d(-4%, -2%, 0) rotate(0deg)   scale(1.05); }
        100% { transform: translate3d( 4%,  3%, 0) rotate(20deg)  scale(1.18); }
      }
      @keyframes aurora-drift-b {
        0%   { transform: translate3d( 3%,  4%, 0) rotate(0deg)   scale(1.10); }
        100% { transform: translate3d(-5%, -3%, 0) rotate(-25deg) scale(1.22); }
      }
      @media (prefers-reduced-motion: reduce) {
        .aurora-bg::before,
        .aurora-bg::after { animation: none; }
      }
      /* Slightly lower presence on mobile so text stays crisp */
      @media (max-width: 480px) {
        .aurora-bg { opacity: 0.42; filter: blur(50px) saturate(130%); }
      }
    `}</style>
  </div>
);

export default AuroraBackground;
