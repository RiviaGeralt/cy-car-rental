import React from 'react';
import styles from './LuxuryBackground.module.css';

/**
 * LuxuryBackground — deep ambient backdrop for Cyprus Road.
 *
 * CSS module approach (replaces styled-jsx version) — CSS modules compile
 * at build time so @keyframes work correctly with dynamic ssr:false imports.
 *
 * Three slowly drifting radial-gradient orbs (gold/violet/ember) over a
 * near-black base. Grain overlay adds physical texture. Vignette darkens
 * edges. Gold hairline anchors the brand at the top.
 */
const LuxuryBackground = () => (
  <div aria-hidden="true" className={styles.root}>
    <div className={`${styles.orb} ${styles.orb1}`} />
    <div className={`${styles.orb} ${styles.orb2}`} />
    <div className={`${styles.orb} ${styles.orb3}`} />
    <div className={styles.vignette} />
    <div className={styles.grain} />
    <div className={styles.topLine} />
  </div>
);

export default LuxuryBackground;
