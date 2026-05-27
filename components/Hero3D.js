import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float, ContactShadows, Stars, Sparkles,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/**
 * Hero3D v2 — cinematic 3D landing for Cyprus Road
 *
 * MOBILE SCROLL FIX (critical):
 *   - .canvas-layer has `pointer-events: none` → touches pass through to <body>,
 *     so vertical swipes scroll the page instead of being eaten by the canvas.
 *   - OrbitControls REMOVED — they capture touch/pointer events even when
 *     vertical-only swipes are intended. We auto-rotate the scene via useFrame
 *     instead, which is purely visual and never grabs input.
 *   - `data-lenis-prevent` REMOVED from the canvas wrapper — Lenis must own
 *     scroll on mobile or the page locks.
 *
 * VISUAL UPGRADES:
 *   - Scroll-driven camera dolly + tilt (window.scrollY → useFrame)
 *   - Mouse parallax on DESKTOP only (pointer:fine media query)
 *   - Particle dust field (drifts upward)
 *   - 3 volumetric light cones (additive blended, slowly rotating)
 *   - Detailed car: emissive interior, neon underglow, side stripe, grille bars
 *   - Reflective floor disc with radial glow ring
 */

/* ─────────────────── Car (improved geometry + emissive accents) ─────────────────── */

function SculptCar() {
  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[0, -0.4, 0]}>
      {/* Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2.6, 0.55, 1.1]} />
        <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.18} />
      </mesh>
      {/* Cabin (smoked glass look) */}
      <mesh castShadow position={[-0.05, 1.0, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.95]} />
        <meshStandardMaterial
          color="#0b0b16"
          metalness={0.95}
          roughness={0.05}
          emissive="#1a0a2e"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Side stripe (amber) */}
      <mesh position={[0, 0.42, 0.555]}>
        <boxGeometry args={[2.4, 0.04, 0.005]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.42, -0.555]}>
        <boxGeometry args={[2.4, 0.04, 0.005]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.2} />
      </mesh>
      {/* Hood */}
      <mesh castShadow position={[1.0, 0.75, 0]}>
        <boxGeometry args={[0.6, 0.1, 1.0]} />
        <meshStandardMaterial color="#f97316" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Grille bars */}
      {[-0.18, 0, 0.18].map((z, i) => (
        <mesh key={`grille-${i}`} position={[1.32, 0.45, z]}>
          <boxGeometry args={[0.04, 0.18, 0.05]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Wheels */}
      {[[-0.9, 0.25, 0.55], [0.9, 0.25, 0.55], [-0.9, 0.25, -0.55], [0.9, 0.25, -0.55]].map((p, i) => (
        <mesh key={`wheel-${i}`} castShadow position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.22, 24]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Wheel hubs (subtle) */}
      {[[-0.9, 0.25, 0.66], [0.9, 0.25, 0.66], [-0.9, 0.25, -0.66], [0.9, 0.25, -0.66]].map((p, i) => (
        <mesh key={`hub-${i}`} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
          <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} emissive="#facc15" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Headlights */}
      {[[1.31, 0.55, 0.35], [1.31, 0.55, -0.35]].map((p, i) => (
        <mesh key={`head-${i}`} position={p}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial emissive="#fef9c3" emissiveIntensity={3} color="#fef3c7" toneMapped={false} />
        </mesh>
      ))}
      {/* Taillights */}
      {[[-1.31, 0.55, 0.35], [-1.31, 0.55, -0.35]].map((p, i) => (
        <mesh key={`tail-${i}`} position={p}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial emissive="#ef4444" emissiveIntensity={2} color="#7f1d1d" toneMapped={false} />
        </mesh>
      ))}
      {/* Neon underglow (additive plane) */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 1.5]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────── Reflective floor disc + radial glow ─────────────────── */

function Floor() {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Dark base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#06060c" metalness={0.6} roughness={0.55} />
      </mesh>
      {/* Radial glow ring (additive) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[1.6, 4.5, 64]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.8, 2.0, 64]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────── Volumetric light beams (additive cones) ─────────────────── */

function LightBeam({ color, angleOffset = 0, radius = 4, height = 8 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.15 + angleOffset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.lookAt(0, -0.4, 0);
  });
  return (
    <mesh ref={ref} position={[radius, height * 0.5, 0]}>
      <coneGeometry args={[0.9, height, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.07}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ─────────────────── Drifting particle dust ─────────────────── */

function Dust({ count = 220 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 6 - 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.18;
      if (arr[i * 3 + 1] > 5.5) arr[i * 3 + 1] = -0.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fde68a"
        size={0.035}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* ─────────────────── Scene rig: auto-rotate + scroll dolly + mouse parallax ─────────────────── */

function SceneRig({ children }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const desktopRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    desktopRef.current = window.matchMedia('(pointer: fine)').matches;

    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / 600, 1.2); // 0..1.2
    };
    const onPointer = (e) => {
      if (!desktopRef.current) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  // Camera base
  const base = useRef({ x: 4, y: 1.8, z: 4.5 });

  useFrame((_, delta) => {
    // Auto-rotate the whole scene (replaces OrbitControls autoRotate)
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
    // Scroll dolly: camera pulls back & tilts down as user scrolls
    const s = scrollRef.current;
    const targetX = base.current.x + s * 1.2 + pointerRef.current.x * 0.35;
    const targetY = base.current.y + s * 1.5 + pointerRef.current.y * -0.25;
    const targetZ = base.current.z + s * 2.5;

    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.lookAt(0, 0.4 - s * 0.4, 0);
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─────────────────── Main component ─────────────────── */

const Hero3D = ({ language = 'en', onCTA }) => {
  const [supports3D, setSupports3D] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;
    if (reduced || lowMem) setSupports3D(false);

    const handler = (e) => {
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
          /* Allow page to vertical-scroll over the hero on touch devices */
          touch-action: pan-y;
        }
        /* CRITICAL: pointer-events:none → all touches/clicks pass through
           to the page (which means Lenis/native scroll receives them).
           Only the .hero-content children that opt-in via pointer-events:auto
           are interactive. */
        .canvas-layer {
          position: absolute; inset: 0;
          pointer-events: none;
          touch-action: pan-y;
        }
        .grain {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.07; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
        }
        /* Subtle vignette to push focus toward center */
        .vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,5,16,0.55) 100%);
          z-index: 2;
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
          z-index: 5;
          /* Container itself doesn't block scroll; only chips/CTAs opt in */
          pointer-events: none;
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
          justify-content: center; margin-bottom: 2.5rem;
          pointer-events: auto;
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
        .cta-row {
          display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
          pointer-events: auto;
        }
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
          letter-spacing: 0.3em; text-transform: uppercase;
          z-index: 6;
          pointer-events: none;
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
        <div className="canvas-layer">
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
              // Belt-and-suspenders: ensure the canvas itself never grabs touches
              gl.domElement.style.touchAction = 'pan-y';
              gl.domElement.style.pointerEvents = 'none';
            }}
          >
            <Suspense fallback={null}>
              <color attach="background" args={['#050510']} />
              <fog attach="fog" args={['#0a0a14', 8, 24]} />

              {/* Hand-crafted golden-hour rig (no HDRI fetch) */}
              <ambientLight intensity={0.55} color="#fef3c7" />
              <hemisphereLight args={['#fde68a', '#1a0a2e', 0.6]} />
              <directionalLight
                position={[5, 6, 3]} intensity={2.2} color="#fde68a"
                castShadow shadow-mapSize={[1024, 1024]}
              />
              <directionalLight position={[-4, 3, -2]} intensity={1.0} color="#f97316" />
              <pointLight position={[-3, 4, -5]} intensity={1.4} color="#a78bfa" distance={20} />
              <pointLight position={[0, 0.5, 0]} intensity={0.6} color="#facc15" distance={6} />

              <Stars radius={50} depth={30} count={1200} factor={2.5} fade speed={0.5} />
              <Sparkles count={50} scale={[8, 5, 8]} size={2} speed={0.25} color="#fde68a" />
              <Dust count={220} />

              <LightBeam color="#facc15" angleOffset={0} radius={4} height={9} />
              <LightBeam color="#a78bfa" angleOffset={Math.PI * 0.66} radius={4.5} height={9} />
              <LightBeam color="#f97316" angleOffset={Math.PI * 1.33} radius={4} height={9} />

              <SceneRig>
                <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.4}>
                  <SculptCar />
                </Float>
                <Floor />
                <ContactShadows
                  position={[0, -0.39, 0]} opacity={0.55}
                  scale={10} blur={2.4} far={4}
                />
              </SceneRig>
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <div className="static-fallback" aria-hidden="true">🚗</div>
      )}

      <div className="grain" />
      <div className="vignette" />

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
