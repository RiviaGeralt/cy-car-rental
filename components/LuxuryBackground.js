import React from 'react';

/**
 * LuxuryBackground — deep ambient backdrop for Cyprus Road.
 *
 * Three slowly drifting radial-gradient orbs (gold/violet/ember) over a
 * near-black base. Grain overlay at 3.5% adds physical texture. Vignette
 * pulls eyes toward center. Hairline top glow ties to brand gold.
 *
 * Design principle: Rolls-Royce configurator, not road-trip illustration.
 * The less it moves, the more expensive it feels.
 *
 * Performance:
 *   - 100% CSS keyframes — zero JS per frame, GPU compositor only
 *   - filter:blur lives on orb divs (isolated stacking context, no repaint)
 *   - will-change:transform only (not filter — avoids GPU memory spike)
 *   - pointer-events:none — never touches scroll or touch
 *   - prefers-reduced-motion honored
 *   - Mobile: smaller orbs, lighter grain
 *
 * Replaces: ScrollBackdrop v9 (road-trip SVG narrative)
 * Mobile traps respected: no scrollY at 0, no SVG node explosion,
 *   uses position:fixed not 100vh, pointer-events:none everywhere.
 */
const LuxuryBackground = () => (
  <div aria-hidden="true" className="lux-root">
    <style jsx>{`
      /* ─── Keyframes ─────────────────────────────────────────────── */
      @keyframes lux-a {
        0%,  100% { transform: translate(0%,   0%)   scale(1.00); }
        25%        { transform: translate(3%,   5%)   scale(1.06); }
        60%        { transform: translate(-2%,  3%)   scale(0.97); }
        80%        { transform: translate(4%,  -2%)   scale(1.03); }
      }
      @keyframes lux-b {
        0%,  100% { transform: translate(0%,   0%)   scale(1.00); }
        30%        { transform: translate(-4%, -5%)   scale(1.10); }
        65%        { transform: translate(3%,  -3%)   scale(0.95); }
        85%        { transform: translate(-2%, 4%)    scale(1.04); }
      }
      @keyframes lux-c {
        0%,  100% { transform: translate(0%,   0%)   scale(1.00); }
        40%        { transform: translate(2%,  -6%)   scale(1.07); }
        75%        { transform: translate(-3%, 2%)    scale(0.96); }
      }

      /* ─── Root ──────────────────────────────────────────────────── */
      .lux-root {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
        /* base: same deep navy as html{} in globals.css */
        background: #050510;
      }

      /* ─── Orbs ──────────────────────────────────────────────────── */
      .lux-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
        /* isolate: isolate keeps blur from compositing with siblings */
        will-change: transform;
      }

      /* Gold — upper-left anchor */
      .lux-orb-1 {
        width: 680px;
        height: 680px;
        top: -12%;
        left: -8%;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(253, 230, 138, 0.20) 0%,
          rgba(212, 175, 55,  0.10) 40%,
          transparent 70%
        );
        animation: lux-a 42s ease-in-out infinite;
      }

      /* Violet — upper-right, larger so it bleeds across hero */
      .lux-orb-2 {
        width: 860px;
        height: 860px;
        top: -25%;
        right: -18%;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(167, 139, 250, 0.14) 0%,
          rgba(109,  40, 217, 0.07) 45%,
          transparent 70%
        );
        animation: lux-b 58s ease-in-out infinite;
      }

      /* Ember — bottom-center, anchors the lower half */
      .lux-orb-3 {
        width: 560px;
        height: 560px;
        bottom: -18%;
        left: 28%;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(249, 115, 22, 0.11) 0%,
          rgba(234, 88,  12, 0.05) 45%,
          transparent 70%
        );
        animation: lux-c 48s ease-in-out infinite;
      }

      /* ─── Vignette ──────────────────────────────────────────────── */
      /* Darkens corners, keeps focus center-screen */
      .lux-vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse 110% 110% at 50% 40%,
          transparent 25%,
          rgba(0, 0, 0, 0.55) 100%
        );
      }

      /* ─── Grain ─────────────────────────────────────────────────── */
      /* SVG feTurbulence inline — CSP-safe, no external asset.
         Placed at 200% size and NOT animated (static grain is authentic;
         animated grain flickers and reads as cheap). */
      .lux-grain {
        position: absolute;
        inset: -50%;
        width: 200%;
        height: 200%;
        opacity: 0.038;
        pointer-events: none;
        /* fractalNoise at 0.72 = fine grain, not coarse noise */
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 256px 256px;
      }

      /* ─── Brand accent line ─────────────────────────────────────── */
      /* 1px gold hairline across the top — subliminal luxury cue */
      .lux-top-line {
        position: absolute;
        top: 0;
        left: 8%;
        right: 8%;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(253, 230, 138, 0.40) 25%,
          rgba(212, 175,  55, 0.55) 50%,
          rgba(253, 230, 138, 0.40) 75%,
          transparent 100%
        );
      }

      /* ─── Reduced motion ────────────────────────────────────────── */
      @media (prefers-reduced-motion: reduce) {
        .lux-orb { animation: none !important; }
      }

      /* ─── Mobile ────────────────────────────────────────────────── */
      /* Smaller orbs + lighter grain on phones */
      @media (max-width: 768px) {
        .lux-orb-1 { width: 380px; height: 380px; filter: blur(70px); }
        .lux-orb-2 { width: 480px; height: 480px; filter: blur(80px); }
        .lux-orb-3 { width: 320px; height: 320px; filter: blur(60px); }
        .lux-grain  { opacity: 0.024; }
      }
    `}</style>

    {/* Orbs */}
    <div className="lux-orb lux-orb-1" />
    <div className="lux-orb lux-orb-2" />
    <div className="lux-orb lux-orb-3" />

    {/* Vignette — renders above orbs, below grain */}
    <div className="lux-vignette" />

    {/* Grain — topmost layer */}
    <div className="lux-grain" />

    {/* Brand hairline */}
    <div className="lux-top-line" />
  </div>
);

export default LuxuryBackground;
