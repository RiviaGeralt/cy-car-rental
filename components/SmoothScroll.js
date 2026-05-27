import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — wraps the app with buttery scroll (Lenis).
 * Lives at _app.js level. Auto-cleans on unmount.
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    let raf;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return children;
};

export default SmoothScroll;
