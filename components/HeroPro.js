import React, { useRef, useState, useEffect } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence,
} from 'framer-motion';
import BackgroundBeams from './BackgroundBeams';

/**
 * HeroPro — professional landing hero for Cyprus Road.
 *
 * Replaces the procedural R3F box-car (which read as a kid's toy).
 * New composition:
 *   - BackgroundBeams (21st.dev / Aceternity style animated SVG paths)
 *   - Mouse-follow spotlight overlay
 *   - Real luxury car photo (Pexels Mercedes) with tilt + parallax
 *   - Cinematic Framer Motion: scroll parallax, stagger, magnetic CTA,
 *     character-reveal title, AnimatePresence on language swap
 *
 * Performance:
 *   - No three.js / no WebGL → no context-loss risk, no GPU pressure
 *   - SVG beams animate on the compositor, not the main thread
 *   - Pexels image preloaded, responsive sizes
 *
 * Premium cues:
 *   - Photographic subject (not procedural)
 *   - Soft underneath glow + drop shadow
 *   - Slow vertical float + scroll-linked tilt
 *   - Spotlight tracks cursor for depth perception
 */

const CAR_IMG = 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1600';
// (Pexels free-use photo — black luxury sedan against dark backdrop)

/* ─────────────────── Framer helpers ─────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.2, 0.8, 0.2, 1] },
  },
};

function AnimatedTitle({ text }) {
  const chars = React.useMemo(() => Array.from(text), [text]);
  return (
    <motion.h1
      className="hp-title"
      aria-label={text}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04, delayChildren: 0.35 } },
      }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={`${c}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={{
            hidden: { opacity: 0, y: 50, rotateX: -80 },
            show: {
              opacity: 1, y: 0, rotateX: 0,
              transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
            },
          }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function MagneticCTA({ children, onClick, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia?.('(pointer: fine)').matches) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────── Main ─────────────────── */

const HeroPro = ({ language = 'en', onCTA }) => {
  const wrapRef = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  // Scroll-linked parallax
  const { scrollY } = useScroll();
  const yContent  = useTransform(scrollY, [0, 600], [0, -140]);
  const opacity   = useTransform(scrollY, [0, 520], [1, 0]);
  const yCar      = useTransform(scrollY, [0, 600], [0, 80]);
  const scaleCar  = useTransform(scrollY, [0, 600], [1, 1.05]);

  // Mouse tilt on car
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const stx = useSpring(tiltX, { stiffness: 120, damping: 14, mass: 0.5 });
  const sty = useSpring(tiltY, { stiffness: 120, damping: 14, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia?.('(pointer: fine)').matches) return;
    const onMove = (e) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      setSpot({ x: px * 100, y: py * 100, active: true });
      tiltX.set((py - 0.5) * 8);
      tiltY.set((px - 0.5) * -12);
    };
    const onLeave = () => setSpot((s) => ({ ...s, active: false }));
    const el = wrapRef.current;
    el?.addEventListener('pointermove', onMove);
    el?.addEventListener('pointerleave', onLeave);
    return () => {
      el?.removeEventListener('pointermove', onMove);
      el?.removeEventListener('pointerleave', onLeave);
    };
  }, [tiltX, tiltY]);

  const t = language === 'tr' ? {
    title: 'Kıbrıs Yolu',
    sub: 'Premium araba kiralama — unutulmaz Akdeniz maceraları',
    cta: 'Hemen Rezervasyon',
    chip1: 'Ücretsiz Teslimat',
    chip2: '7/24 Destek',
    chip3: 'En İyi Fiyat',
    eyebrow: 'Kuzey Kıbrıs · Kuruluş 2024',
  } : {
    title: 'Cyprus Road',
    sub: 'Premium rentals for unforgettable Mediterranean adventures',
    cta: 'Reserve Now',
    chip1: 'Free Pickup',
    chip2: '24/7 Support',
    chip3: 'Best Price',
    eyebrow: 'North Cyprus · Est. 2024',
  };

  return (
    <section ref={wrapRef} className="hp-wrap">
      <style jsx>{`
        .hp-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
          background: #050510;
          isolation: isolate;
          touch-action: pan-y;
        }
        .hp-spotlight {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(
            600px circle at var(--mx, 50%) var(--my, 50%),
            rgba(250, 204, 21, 0.18),
            rgba(167, 139, 250, 0.10) 25%,
            transparent 55%
          );
          opacity: var(--spot-on, 0);
          transition: opacity 0.4s;
          mix-blend-mode: screen;
        }
        .hp-vignette {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 2;
          background:
            radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.18), transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,5,16,0.75) 100%);
        }
        .hp-grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.06; mix-blend-mode: overlay;
          z-index: 3;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
        }

        /* Car stage */
        .hp-car-stage {
          position: absolute;
          left: 50%;
          bottom: 8%;
          width: min(1100px, 92vw);
          height: 55%;
          transform: translateX(-50%);
          z-index: 4;
          pointer-events: none;
          perspective: 1200px;
        }
        .hp-car-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          filter:
            drop-shadow(0 30px 60px rgba(0,0,0,0.7))
            drop-shadow(0 0 80px rgba(249,115,22,0.25))
            contrast(1.05) saturate(1.1);
          will-change: transform;
        }
        .hp-car-glow {
          position: absolute;
          left: 50%;
          bottom: 4%;
          transform: translateX(-50%);
          width: 70%;
          height: 60px;
          background: radial-gradient(ellipse at center, rgba(249,115,22,0.55), transparent 70%);
          filter: blur(20px);
          z-index: 3;
          pointer-events: none;
        }

        /* Content */
        .hp-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: clamp(2rem, 8vh, 5rem) 2rem 0;
          text-align: center;
          z-index: 5;
          pointer-events: none;
        }
        .hp-eyebrow {
          font-size: clamp(0.7rem, 1.4vw, 0.85rem);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #fde68a;
          font-weight: 500;
          margin-bottom: 1.4rem;
          text-shadow: 0 2px 14px rgba(0,0,0,0.7);
        }
        .hp-title {
          font-size: clamp(2.8rem, 9.5vw, 7rem);
          font-weight: 800;
          line-height: 0.95;
          margin: 0 0 1.4rem;
          letter-spacing: -0.035em;
          background: linear-gradient(180deg, #ffffff 0%, #fde68a 55%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 30px rgba(249,115,22,0.35));
          perspective: 800px;
        }
        .hp-sub {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: rgba(255,255,255,0.82);
          max-width: 620px;
          margin: 0 0 2.2rem;
          line-height: 1.5;
          text-shadow: 0 2px 12px rgba(0,0,0,0.7);
        }
        .hp-chips {
          display: flex; gap: 0.7rem; flex-wrap: wrap;
          justify-content: center; margin-bottom: 2.2rem;
          pointer-events: auto;
        }
        .hp-chip {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.55rem 1rem; border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          color: #fff; font-size: 0.875rem; font-weight: 500;
          cursor: default;
        }
        .hp-chip span:first-child { color: #facc15; }
        .hp-cta-row {
          display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
          pointer-events: auto;
        }
        .hp-cta-primary {
          padding: 1.05rem 2.4rem; border: none; cursor: pointer;
          background: linear-gradient(135deg, #facc15 0%, #f97316 100%);
          color: #0a0a14; font-weight: 700; font-size: 1.05rem;
          border-radius: 999px; letter-spacing: 0.02em;
          box-shadow:
            0 12px 40px rgba(249,115,22,0.5),
            0 0 0 1px rgba(255,255,255,0.10) inset;
          position: relative; overflow: hidden;
        }
        .hp-cta-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.9s;
        }
        .hp-cta-primary:hover::after { transform: translateX(100%); }
        .hp-cta-secondary {
          padding: 1.05rem 2rem; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(14px);
          color: #fff; font-weight: 500; font-size: 1rem;
          border-radius: 999px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .hp-scroll-cue {
          position: absolute; bottom: 1.6rem; left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.55); font-size: 0.72rem;
          letter-spacing: 0.3em; text-transform: uppercase;
          z-index: 6;
        }
        .hp-scroll-line {
          width: 1px; height: 38px; margin: 0.5rem auto 0;
          background: linear-gradient(180deg, transparent, #facc15, transparent);
          animation: hpScroll 2.5s ease-in-out infinite;
        }
        @keyframes hpScroll {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50%      { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes hpFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        .hp-float { animation: hpFloat 6s ease-in-out infinite; }

        @media (max-width: 768px) {
          .hp-wrap { height: 95vh; min-height: 600px; }
          .hp-car-stage { height: 42%; bottom: 12%; }
        }
        @media (max-width: 480px) {
          .hp-content { padding-top: 4rem; }
          .hp-chips { gap: 0.4rem; margin-bottom: 1.6rem; }
          .hp-chip  { padding: 0.4rem 0.7rem; font-size: 0.78rem; }
          .hp-cta-row { flex-direction: column; width: 100%; padding: 0 1rem; }
          .hp-cta-primary, .hp-cta-secondary { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-float { animation: none; }
        }
      `}</style>

      {/* Layer 0: animated SVG beams */}
      <BackgroundBeams />

      {/* Layer 1: mouse spotlight */}
      <div
        className="hp-spotlight"
        style={{
          '--mx': `${spot.x}%`,
          '--my': `${spot.y}%`,
          '--spot-on': spot.active ? 1 : 0,
        }}
      />

      {/* Layer 2/3: vignette + grain */}
      <div className="hp-vignette" />
      <div className="hp-grain" />

      {/* Layer 4: real car photo with tilt + parallax + float */}
      <motion.div
        className="hp-car-stage"
        style={{ y: yCar, scale: scaleCar }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="hp-car-glow" />
        <motion.img
          src={CAR_IMG}
          alt="Premium rental car"
          className="hp-car-img hp-float"
          loading="eager"
          style={{
            rotateX: stx,
            rotateY: sty,
            transformPerspective: 1200,
          }}
        />
      </motion.div>

      {/* Layer 5: content (scroll-parallax + stagger + lang crossfade) */}
      <motion.div
        className="hp-content"
        style={{ y: yContent, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`lang-${language}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.div className="hp-eyebrow" variants={itemVariants}>
              {t.eyebrow}
            </motion.div>

            <AnimatedTitle text={t.title} />

            <motion.p className="hp-sub" variants={itemVariants}>
              {t.sub}
            </motion.p>

            <motion.div className="hp-chips" variants={itemVariants}>
              {[t.chip1, t.chip2, t.chip3].map((c, i) => (
                <motion.span
                  key={i}
                  className="hp-chip"
                  whileHover={{
                    y: -3,
                    backgroundColor: 'rgba(250, 204, 21, 0.12)',
                    borderColor: 'rgba(250, 204, 21, 0.35)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span>✦</span><span>{c}</span>
                </motion.span>
              ))}
            </motion.div>

            <motion.div className="hp-cta-row" variants={itemVariants}>
              <MagneticCTA className="hp-cta-primary" onClick={onCTA}>
                {t.cta} →
              </MagneticCTA>
              <motion.a
                className="hp-cta-secondary"
                href="https://wa.me/903924440000"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.10)', y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <span>💬</span><span>WhatsApp</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="hp-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
      >
        Scroll
        <div className="hp-scroll-line" />
      </motion.div>
    </section>
  );
};

export default HeroPro;
