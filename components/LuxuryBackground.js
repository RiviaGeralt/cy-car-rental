import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import styles from './LuxuryBackground.module.css';

/**
 * LuxuryBackground — scroll-driven ambient backdrop for Cyprus Road.
 *
 * Two-layer animation system:
 *   CSS @keyframes  → slow ambient drift (42–58s loops, inner div)
 *   framer-motion   → scroll-linked scene sweep (outer wrapper)
 *
 * No transform conflict: CSS animation is on inner .orb div;
 * framer useScroll transforms are on .orbSlot wrapper.
 *
 * Section scroll-progress keypoints:
 *   0.00 → hero
 *   0.18 → header / story band
 *   0.38 → fleet
 *   0.62 → testimonials
 *   0.78 → benefits
 *   1.00 → CTA / footer
 */
export default function LuxuryBackground() {
  const { scrollYProgress } = useScroll();
  // Spring glide — orbs ease into each section, don't snap
  const sp = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  const pts = [0, 0.18, 0.38, 0.62, 0.78, 1];

  // ── Orb 1: Gold — starts top-left, sweeps right through fleet, surges for CTA
  const o1x = useTransform(sp, pts, ['0%', '-6%', '22%',  '10%',  '-4%', '16%']);
  const o1y = useTransform(sp, pts, ['0%',  '8%', '-12%',  '4%',  '10%', '18%']);
  const o1s = useTransform(sp, pts, [1, 0.92, 1.18, 1.0, 0.88, 1.28]);

  // ── Orb 2: Violet — starts top-right, drops for fleet, retreats for testimonials
  const o2x = useTransform(sp, pts, ['0%', '10%', '-14%',  '6%', '12%',  '4%']);
  const o2y = useTransform(sp, pts, ['0%',  '-6%',  '18%', '-10%', '-14%', '-6%']);
  const o2s = useTransform(sp, pts, [1, 1.08, 0.82, 1.12, 0.95, 1.06]);

  // ── Orb 3: Ember — bottom-center, wide swing through testimonials, rises for CTA
  const o3x = useTransform(sp, pts, ['0%', '-10%',  '8%', '-18%', '16%',  '-8%']);
  const o3y = useTransform(sp, pts, ['0%',  '14%', '-10%',   '8%',  '-6%', '-22%']);
  const o3s = useTransform(sp, pts, [1, 1.12, 0.88, 1.2, 1.02, 1.35]);

  return (
    <div aria-hidden="true" className={styles.root}>

      {/* Orb 1: Gold */}
      <motion.div className={styles.orbSlot} style={{ x: o1x, y: o1y, scale: o1s }}>
        <div className={`${styles.orb} ${styles.orb1}`} />
      </motion.div>

      {/* Orb 2: Violet */}
      <motion.div className={styles.orbSlot} style={{ x: o2x, y: o2y, scale: o2s }}>
        <div className={`${styles.orb} ${styles.orb2}`} />
      </motion.div>

      {/* Orb 3: Ember */}
      <motion.div className={styles.orbSlot} style={{ x: o3x, y: o3y, scale: o3s }}>
        <div className={`${styles.orb} ${styles.orb3}`} />
      </motion.div>

      <div className={styles.vignette} />
      <div className={styles.grain} />
      <div className={styles.topLine} />
    </div>
  );
}
