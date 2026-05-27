import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment, Float, ContactShadows, OrbitControls, Stars,
} from '@react-three/drei';
import { motion } from 'framer-motion';

/**
 * Hero3D — cinematic 3D landing for Cyprus Road
 * Imported via next/dynamic(ssr:false) from pages/index.js so SSR never
 * touches three.js. Internal imports are normal (not dynamic) so the
 * Canvas mounts with all pieces resolved — fixes WebGL context-lost race.
 */

function SculptCar() {
  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[0, -0.4, 0]}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2.6, 0.55, 1.1]} />
        <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh castShadow position={[-0.05, 1.0, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.95]} />
        <meshStandardMaterial color="#1f2937" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh castShadow position={[1.0, 0.75, 0]}>
        <boxGeometry args={[0.6, 0.1, 1.0]} />
        <meshStandardMaterial color="#f97316" metalness={0.9} roughness={0.15} />
      </mesh>
      {[[-0.9, 0.25, 0.55], [0.9, 0.25, 0.55], [-0.9, 0.25, -0.55], [0.9, 0.25, -0.55]].map((p, i) => (
        <mesh key={i} castShadow position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.22, 24]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {[[1.31, 0.55, 0.35], [1.31, 0.55, -0.35]].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial emissive="#fde68a" emissiveIntensity={2.5} color="#fef3c7" />
        </mesh>
      ))}
    </group>
  );
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0a0a14" metalness={0.4} roughness={0.7} />
    </mesh>
  );
}

const Hero3D = ({ language = 'en', onCTA }) => {
  // Detect prefers-reduced-motion + low-power devices — bail to static if so
  const [supports3D, setSupports3D] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // crude mobile-low-memory check
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;
    if (reduced || lowMem) setSupports3D(false);

    // catch WebGL context loss globally on the canvas
    const handler = (e) => {
      // eslint-disable-next-line no-console
      console.warn('[Hero3D] WebGL context lost — disabling 3D');
      setSupports3D(false);
      e.preventDefault?.();
    };
    window.addEventListener('webglcontextlost', handler, true);
    return () => window.removeEventListener('webglcontextlost', handler, true);
  }, []);

  const t = language === 'tr' ? {
    title: 'Kıbrıs Yolu',
    sub: 'Premium araba kiralama — unutulmaz maceralar',
    cta: 'Hemen Rezervasyon',
    chip1: 'Ücretsiz Teslimat',
    chip2: '7/24 Destek',
    chip3: 'En İyi Fiyat',
  } : {
    title: 'Cyprus Road',
    sub: 'Premium rentals for unforgettable Mediterranean adventures',
    cta: 'Reserve Now',
    chip1: 'Free Pickup',
    chip2: '24/7 Support',
    chip3: 'Best Price',
  };

  return (
    <section className="hero3d-wrap">
      <style jsx>{`
        .hero3d-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 640px;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 110%, #f97316 0%, #1a0a2e 35%, #050510 75%);
          isolation: isolate;
        }
        .canvas-layer { position: absolute; inset: 0; }
        .grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.07; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
        }
        .static-fallback {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 12rem; opacity: 0.4; color: #facc15; pointer-events: none;
          filter: drop-shadow(0 0 60px rgba(249,115,22,0.5));
        }
        .hero-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem; text-align: center;
          z-index: 5; pointer-events: none;
        }
        .eyebrow {
          font-size: clamp(0.7rem, 1.5vw, 0.85rem);
          letter-spacing: 0.4em; text-transform: uppercase;
          color: #fde68a; margin-bottom: 1.2rem; font-weight: 500;
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }
        .hero-title {
          font-size: clamp(2.5rem, 9vw, 6.5rem);
          font-weight: 800; line-height: 0.95;
          background: linear-gradient(180deg, #fff 0%, #fde68a 50%, #f97316 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 1.2rem; letter-spacing: -0.03em;
          filter: drop-shadow(0 8px 30px rgba(249, 115, 22, 0.4));
        }
        .hero-sub {
          font-size: clamp(1rem, 2.2vw, 1.35rem);
          color: rgba(255,255,255,0.85);
          max-width: 600px; margin: 0 0 2.5rem;
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }
        .chips {
          display: flex; gap: 0.75rem; flex-wrap: wrap;
          justify-content: center; margin-bottom: 2.5rem; pointer-events: auto;
        }
        .chip {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.55rem 1rem; border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          color: #fff; font-size: 0.875rem; font-weight: 500;
        }
        .chip span:first-child { color: #facc15; }
        .cta-row { display: flex; gap: 1rem; pointer-events: auto; flex-wrap: wrap; justify-content: center; }
        .cta-primary {
          padding: 1.05rem 2.4rem; border: none; cursor: pointer;
          background: linear-gradient(135deg, #facc15 0%, #f97316 100%);
          color: #0a0a14; font-weight: 700; font-size: 1.05rem;
          border-radius: 999px; letter-spacing: 0.02em;
          box-shadow: 0 12px 40px rgba(249, 115, 22, 0.45),
                      0 0 0 1px rgba(255,255,255,0.1) inset;
          transition: transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s;
        }
        .cta-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 18px 50px rgba(249, 115, 22, 0.65);
        }
        .cta-secondary {
          padding: 1.05rem 2rem; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(14px);
          color: #fff; font-weight: 500; font-size: 1rem;
          border-radius: 999px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: background 0.25s;
        }
        .cta-secondary:hover { background: rgba(255,255,255,0.10); }
        .scroll-cue {
          position: absolute; bottom: 1.8rem; left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.5); font-size: 0.75rem;
          letter-spacing: 0.3em; text-transform: uppercase; z-index: 6;
        }
        .scroll-line {
          width: 1px; height: 40px; margin: 0.5rem auto 0;
          background: linear-gradient(180deg, transparent, #facc15, transparent);
          animation: scrollLine 2.5s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50%      { opacity: 1;   transform: scaleY(1); }
        }
        @media (max-width: 768px) {
          .hero3d-wrap { height: 92vh; min-height: 560px; }
        }
        @media (max-width: 480px) {
          .chips { gap: 0.4rem; margin-bottom: 1.8rem; }
          .chip { padding: 0.4rem 0.7rem; font-size: 0.78rem; }
          .cta-row { flex-direction: column; width: 100%; padding: 0 1rem; }
          .cta-primary, .cta-secondary { width: 100%; }
        }
      `}</style>

      {supports3D ? (
        <div className="canvas-layer" data-lenis-prevent>
          <Canvas
            shadows
            camera={{ position: [4, 1.8, 4.5], fov: 38 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                setSupports3D(false);
              });
            }}
          >
            <Suspense fallback={null}>
              <color attach="background" args={['#050510']} />
              <fog attach="fog" args={['#0a0a14', 8, 22]} />
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[5, 6, 3]} intensity={1.6} color="#fde68a"
                castShadow shadow-mapSize={[1024, 1024]}
              />
              <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#f97316" />
              <Stars radius={50} depth={30} count={1000} factor={2.5} fade speed={0.5} />
              <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.4}>
                <SculptCar />
              </Float>
              <Road />
              <ContactShadows
                position={[0, -0.39, 0]} opacity={0.55}
                scale={10} blur={2.4} far={4}
              />
              <Environment preset="sunset" />
              <OrbitControls
                enableZoom={false} enablePan={false}
                autoRotate autoRotateSpeed={0.6}
                minPolarAngle={Math.PI / 2.6}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        // Reduced-motion / low-mem / context-lost fallback: emoji silhouette + gradient bg
        <div className="static-fallback" aria-hidden="true">🚗</div>
      )}

      <div className="grain" />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.4, delay: 0.2 }}
        >
          North Cyprus · Est. 2024
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {t.title}
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          {t.sub}
        </motion.p>

        <motion.div
          className="chips"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
        >
          {[t.chip1, t.chip2, t.chip3].map((c, i) => (
            <span key={i} className="chip"><span>✦</span><span>{c}</span></span>
          ))}
        </motion.div>

        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
        >
          <button className="cta-primary" onClick={onCTA}>{t.cta} →</button>
          <a
            className="cta-secondary"
            href="https://wa.me/970594198211"
            target="_blank" rel="noopener noreferrer"
          >
            <span>💬</span><span>WhatsApp</span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 1.6 }}
      >
        Scroll
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
};

export default Hero3D;
