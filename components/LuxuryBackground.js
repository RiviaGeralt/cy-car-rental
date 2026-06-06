import React, { useEffect, useRef } from 'react';
import styles from './LuxuryBackground.module.css';

/**
 * LuxuryBackground — "Night Drive" animated backdrop for Cyprus Road.
 *
 * Desktop: Canvas2D road perspective + headlight cones + bokeh particles
 *          layered under rotating CSS aurora overlays (mix-blend-mode: screen).
 * Mobile:  Canvas hidden, CSS aurora promoted — zero JS animation cost.
 *
 * Scroll drives scene params via RAF reading window.scrollY.
 * No scroll event listeners registered.
 */
export default function LuxuryBackground() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const scrollRafRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches
      || (navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 2);

    if (!isMobile && canvasRef.current) {
      import('./canvas/NightDriveCanvas.js').then(({ NightDriveCanvas }) => {
        if (!canvasRef.current) return;
        const engine = new NightDriveCanvas(canvasRef.current, false);
        engineRef.current = engine;
        engine.start();
      });
    }

    // Read scroll every RAF tick — passive, no scroll event
    const readScroll = () => {
      if (engineRef.current) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        engineRef.current.setScrollProgress(progress);
      }
      scrollRafRef.current = requestAnimationFrame(readScroll);
    };
    scrollRafRef.current = requestAnimationFrame(readScroll);

    // Resize (debounced)
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { engineRef.current?.resize(); }, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        engineRef.current?.stop();
        cancelAnimationFrame(scrollRafRef.current);
      } else {
        engineRef.current?.start();
        scrollRafRef.current = requestAnimationFrame(readScroll);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
      cancelAnimationFrame(scrollRafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={`${styles.auroraLayer} ${styles.aurora1}`} />
      <div className={`${styles.auroraLayer} ${styles.aurora2}`} />
      <div className={`${styles.auroraLayer} ${styles.aurora3}`} />
      <div className={styles.vignette} />
      <div className={styles.topLine} />
    </div>
  );
}