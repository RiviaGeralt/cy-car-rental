import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import styles from './LuxuryBackground.module.css';

/**
 * LuxuryBackground — scroll-driven car silhouette backdrop for Cyprus Road.
 *
 * Two-layer animation system:
 *   CSS @keyframes  → slow ambient float drift (19–31s loops, inner .carSvg div)
 *   framer-motion   → scroll-linked scene sweep (outer .carSlot wrapper)
 *
 * No transform conflict: CSS animation is on inner .carSvg element;
 * framer useScroll transforms are on .carSlot wrapper.
 *
 * SVG uses stroke="currentColor" — the `color` CSS property on
 * .car1/.car2/.car3 drives outline color (gold / silver-white).
 *
 * Section scroll-progress keypoints:
 *   0.00 → hero
 *   0.18 → header / story band
 *   0.38 → fleet
 *   0.62 → testimonials
 *   0.78 → benefits
 *   1.00 → CTA / footer
 */

const CarSvg = ({ className }) => (
  <svg
    viewBox="0 0 480 180"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Body */}
    <path
      d="M 55 130 L 110 88 L 190 68 L 300 68 L 370 88 L 420 130 L 420 148 L 55 148 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Roof */}
    <path
      d="M 120 88 L 148 52 L 295 52 L 330 88 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Door line */}
    <line
      x1="230" y1="88" x2="230" y2="142"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Wheel outlines */}
    <circle cx="145" cy="148" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="335" cy="148" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Hubs */}
    <circle cx="145" cy="148" r="12" fill="currentColor" opacity="0.3" />
    <circle cx="335" cy="148" r="12" fill="currentColor" opacity="0.3" />
  </svg>
);

export default function LuxuryBackground() {
  const { scrollYProgress } = useScroll();
  // Spring glide — cars ease into each section, don't snap
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  const pts = [0, 0.18, 0.38, 0.62, 0.78, 1];

  // Car 1: large, left side, gold tint
  const c1x = useTransform(sp, pts, ['0%',  '3%',  '8%',  '5%', '-3%', '10%']);
  const c1y = useTransform(sp, pts, ['0%', '-5%', '-8%', '-3%',  '5%',  '8%']);
  const c1s = useTransform(sp, pts, [1,    0.95,  1.08,  1.0,   0.92,  1.12]);
  const c1o = useTransform(sp, pts, [0.05, 0.04,  0.07,  0.05,  0.04,  0.08]);

  // Car 2: medium, right side, faces left (scaleX -1 via CSS), silver tint
  const c2x = useTransform(sp, pts, ['0%', '-5%', '-10%', '-6%', '-2%',  '-8%']);
  const c2y = useTransform(sp, pts, ['0%',  '6%',   '3%',  '8%', '-4%',  '-6%']);
  const c2s = useTransform(sp, pts, [1,    1.05,   0.88,   1.1,   1.0,    0.95]);
  const c2o = useTransform(sp, pts, [0.04, 0.05,   0.06,  0.04,  0.05,   0.07]);

  // Car 3: small, bottom center, subtle drift
  const c3x = useTransform(sp, pts, ['0%', '-3%',  '5%', '-8%',  '4%',  '-5%']);
  const c3y = useTransform(sp, pts, ['0%',  '4%',  '-5%',  '6%', '-3%', '-10%']);
  const c3s = useTransform(sp, pts, [1,    1.08,   0.92,  1.05,  1.12,   0.90]);
  const c3o = useTransform(sp, pts, [0.03, 0.04,   0.05,  0.03,  0.04,   0.06]);

  return (
    <div aria-hidden="true" className={styles.root}>

      {/* Car 1: large, left, gold */}
      <motion.div
        className={`${styles.carSlot} ${styles.car1}`}
        style={{ x: c1x, y: c1y, scale: c1s, opacity: c1o }}
      >
        <CarSvg className={`${styles.carSvg} ${styles.carFloat1}`} />
      </motion.div>

      {/* Car 2: medium, right, faces left */}
      <motion.div
        className={`${styles.carSlot} ${styles.car2}`}
        style={{ x: c2x, y: c2y, scale: c2s, opacity: c2o }}
      >
        <CarSvg className={`${styles.carSvg} ${styles.carFloat2}`} />
      </motion.div>

      {/* Car 3: small, bottom center */}
      <motion.div
        className={`${styles.carSlot} ${styles.car3}`}
        style={{ x: c3x, y: c3y, scale: c3s, opacity: c3o }}
      >
        <CarSvg className={`${styles.carSvg} ${styles.carFloat3}`} />
      </motion.div>

      <div className={styles.vignette} />
      <div className={styles.grain} />
      <div className={styles.topLine} />
    </div>
  );
}
