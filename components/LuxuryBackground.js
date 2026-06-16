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

    // pointer:coarse is the only reliable mobile signal.
    // hardwareConcurrency is capped at 2 by Firefox (privacy) — falsely disables canvas on desktop.
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    let intersectionObs = null;

    if (canvasRef.current) {
      import('./canvas/NightDriveCanvas.js').then(({ NightDriveCanvas }) => {
        if (!canvasRef.current) return;
        const engine = new NightDriveCanvas(canvasRef.current, isMobile);
        engineRef.current = engine;
        engine.start();

        // Pause canvas rAF when element is off-screen (saves a full rAF loop while scrolled past hero)
        intersectionObs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              engine.start();
            } else {
              engine.stop();
            }
          },
          { threshold: 0 }
        );
        intersectionObs.observe(canvasRef.current);
      });
    }

    // Read scroll every RAF tick — drives NightDriveCanvas scene params on both desktop and mobile
    let readScroll = null;
    readScroll = () => {
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
        if (readScroll) scrollRafRef.current = requestAnimationFrame(readScroll);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      intersectionObs?.disconnect();
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