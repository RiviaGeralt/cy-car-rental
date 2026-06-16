import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float, Stars, Environment, Lightformer,
  RoundedBox, useGLTF,
} from '@react-three/drei';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue,
} from 'framer-motion';
import * as THREE from 'three';

/* ─────────────────── Materials ─────────────────── */

const PAINT = {
  color: '#0f0f1a',
  metalness: 0.9,
  roughness: 0.25,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  envMapIntensity: 1.4,
};

const CHROME = {
  color: '#cdcdd5',
  metalness: 1.0,
  roughness: 0.08,
  envMapIntensity: 1.6,
};

const GLASS = {
  color: '#1a1f2e',
  metalness: 0.1,
  roughness: 0.05,
  transmission: 0.85,
  thickness: 0.4,
  ior: 1.45,
  envMapIntensity: 1.2,
  transparent: true,
  opacity: 0.85,
};

/* ─────────────────── Fallback sculpt car ─────────────────── */

function Wheel({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 20]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.115]}>
        <cylinderGeometry args={[0.21, 0.21, 0.02, 16]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.118]} rotation={[Math.PI / 2, 0, a]}>
            <boxGeometry args={[0.18, 0.04, 0.02]} />
            <meshPhysicalMaterial {...CHROME} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.125]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 12]} rotation={[Math.PI / 2, 0, 0]} />
        <meshPhysicalMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Fender({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.42, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial {...PAINT} />
    </mesh>
  );
}

function SculptCar() {
  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[0, -0.5, 0]}>
      <RoundedBox args={[3.3, 0.18, 1.35]} radius={0.05} smoothness={3} position={[0, 0.28, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <RoundedBox args={[3.0, 0.55, 1.5]} radius={0.18} smoothness={4} position={[0, 0.65, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <RoundedBox args={[1.0, 0.18, 1.4]} radius={0.08} smoothness={3}
        position={[1.15, 0.88, 0]} rotation={[0, 0, -0.08]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <RoundedBox args={[0.85, 0.16, 1.4]} radius={0.08} smoothness={3}
        position={[-1.2, 0.88, 0]} rotation={[0, 0, 0.06]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <RoundedBox args={[1.7, 0.5, 1.32]} radius={0.18} smoothness={4} position={[-0.05, 1.18, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <mesh position={[0.75, 1.18, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.85, 0.5, 1.22]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      <mesh position={[-0.78, 1.18, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.8, 0.5, 1.22]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>
      {[0.66, -0.66].map((z, i) => (
        <mesh key={`sw-${i}`} position={[-0.05, 1.22, z]}>
          <boxGeometry args={[1.55, 0.36, 0.04]} />
          <meshPhysicalMaterial {...GLASS} />
        </mesh>
      ))}
      <Fender position={[1.05, 0.45, 0.7]} />
      <Fender position={[1.05, 0.45, -0.7]} />
      <Fender position={[-1.05, 0.45, 0.7]} />
      <Fender position={[-1.05, 0.45, -0.7]} />
      <mesh position={[1.62, 0.6, 0]}>
        <boxGeometry args={[0.06, 0.28, 0.95]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>
      <RoundedBox args={[0.25, 0.22, 1.55]} radius={0.06} smoothness={3} position={[1.62, 0.38, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      <RoundedBox args={[0.25, 0.22, 1.55]} radius={0.06} smoothness={3} position={[-1.68, 0.38, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>
      {[0.42, -0.42].map((z, i) => (
        <group key={`hl-${i}`} position={[1.65, 0.62, z]}>
          <mesh>
            <boxGeometry args={[0.04, 0.14, 0.32]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={4} toneMapped={false} />
          </mesh>
          <pointLight color="#fef9c3" intensity={1.0} distance={3} />
        </group>
      ))}
      <mesh position={[-1.72, 0.62, 0]}>
        <boxGeometry args={[0.03, 0.07, 1.15]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} toneMapped={false} />
      </mesh>
      <Wheel position={[1.05, 0.34, 0.78]} />
      <Wheel position={[1.05, 0.34, -0.78]} />
      <Wheel position={[-1.05, 0.34, 0.78]} />
      <Wheel position={[-1.05, 0.34, -0.78]} />
      {/* Neon underglow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.6]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.3}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─────────────────── Ferrari GLB ─────────────────── */

function Ferrari() {
  const { scene } = useGLTF('/models/ferrari.glb', '/draco/');
  const wheelsRef = useRef([]);

  useEffect(() => {
    if (!scene) return;
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#0b0d18', metalness: 1.0, roughness: 0.35,
      clearcoat: 1.0, clearcoatRoughness: 0.04, envMapIntensity: 1.5,
    });
    const detailsMat = new THREE.MeshStandardMaterial({
      color: '#cdcdd5', metalness: 1.0, roughness: 0.45, envMapIntensity: 1.4,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#1a1f2e', metalness: 0.1, roughness: 0.04,
      transmission: 0.9, thickness: 0.5, ior: 1.45,
      transparent: true, opacity: 0.85, envMapIntensity: 1.2,
    });
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const n = (obj.name || '').toLowerCase();
      if (n === 'body' || n.includes('body')) obj.material = bodyMat;
      else if (n === 'glass' || n.includes('glass')) obj.material = glassMat;
      else if (n.includes('rim') || n.includes('trim')) obj.material = detailsMat;
    });
    wheelsRef.current = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']
      .map((nm) => scene.getObjectByName(nm))
      .filter(Boolean);
  }, [scene]);

  useFrame((_, delta) => {
    wheelsRef.current.forEach((w) => { if (w) w.rotation.x += delta * 0.5; });
  });

  return (
    <primitive
      object={scene}
      scale={[1.5, 1.5, 1.5]}
      position={[0, -0.5, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

useGLTF.preload('/models/ferrari.glb', '/draco/');

/* ─────────────────── Simple floor (replaces MeshReflectorMaterial — perf) ─────────────────── */

function SimpleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#06060e" metalness={0.3} roughness={0.9} />
    </mesh>
  );
}

/* ─────────────────── Scroll-driven cinematic camera ─────────────────── */

function CinematicRig({ children }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const desktopRef = useRef(false);
  const timeRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    desktopRef.current = window.matchMedia('(pointer: fine)').matches;
    const onScroll = () => { scrollRef.current = Math.min(window.scrollY / 800, 1); };
    const onPointer = (e) => {
      if (!desktopRef.current) return;
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const s = scrollRef.current;

    // ZOOMED OUT: radius starts at 8.0 (was 5.8)
    const baseAngle = -Math.PI * 0.18 + timeRef.current * 0.05;
    const scrollAngle = s * Math.PI * 0.55;
    const angle = baseAngle + scrollAngle;
    const radius = 8.0 - s * 2.2;   // wider orbit, dollies in on scroll
    const height = 1.8 - s * 0.4;
    const px = pointerRef.current.x * 0.35;
    const py = pointerRef.current.y * -0.2;

    const tx = Math.cos(angle) * radius + px;
    const tz = Math.sin(angle) * radius;
    const ty = height + py;

    camera.position.x += (tx - camera.position.x) * 0.055;
    camera.position.y += (ty - camera.position.y) * 0.055;
    camera.position.z += (tz - camera.position.z) * 0.055;
    camera.lookAt(0, 0.5 - s * 0.3, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y = s * -0.35 + Math.sin(timeRef.current * 0.35) * 0.04;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─────────────────── Framer helpers ─────────────────── */

const containerVariants = {
  // No opacity on container — scroll useTransform handles it; children animate individually
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// PERF: removed filter:blur — CSS filter animation is heavy on GPU compositing
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
};

function AnimatedTitle({ text, isMobile }) {
  const chars = useMemo(() => Array.from(text), [text]);
  if (isMobile) {
    return <div className="hc-title" aria-label={text}>{text}</div>;
  }
  return (
    <motion.div
      className="hc-title"
      aria-label={text}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={`${c}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
          }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </motion.div>
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
    if (!el || !window.matchMedia?.('(pointer: fine)').matches) return;
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

const HeroCinematic = ({ language = 'en', onCTA }) => {
  // null = not yet detected (prevents flash on mobile)
  const [supports3D, setSupports3D] = useState(null);
  const wrapRef = useRef(null);

  const { scrollY } = useScroll();
  // Mobile back-forward cache can restore scrollY > 200 on mount → hero invisible.
  // Push fade range way out so content stays visible at every reasonable scroll restore.
  const yContent = useTransform(scrollY, [0, 1200], [0, -120]);
  const opacityContent = useTransform(scrollY, [700, 1400], [1, 0]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;
    // Disable WebGL on ALL touch/mobile devices — biggest perf win
    const isMobile = window.matchMedia?.('(pointer: coarse)').matches;
    if (reduced || lowMem || isMobile) { setSupports3D(false); return; }
    setSupports3D(true);
    const handler = (e) => {
      console.warn('[HeroCinematic] WebGL context lost');
      setSupports3D(false);
      e.preventDefault?.();
    };
    window.addEventListener('webglcontextlost', handler, true);
    return () => window.removeEventListener('webglcontextlost', handler, true);
  }, []);

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
    <section
      ref={wrapRef}
      className="hc-wrap"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        isolation: 'isolate',
        touchAction: 'pan-y',
        background: '#050510',
      }}
    >
      {/* `global` because styled-jsx's Babel scope class doesn't propagate
          to <motion.div className="..."> (custom component). Without global,
          .hc-eyebrow / .hc-title / .hc-chips / .hc-cta-* lost their styles
          while the framer-motion stagger animation hid this from us. */}
      <style jsx global>{`
        .hc-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
          isolation: isolate;
          touch-action: pan-y;
          background: #050510;
        }

        /* ── Animated CSS background — always visible, GPU-only transforms ── */
        .hc-bg {
          position: absolute; inset: 0; z-index: 0;
          background: #050510;
          overflow: hidden;
        }
        .hc-bg::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 90% 65% at 40% -5%,  rgba(124,58,237,0.35), transparent 65%),
            radial-gradient(ellipse 75% 55% at 88% 65%, rgba(249,115,22,0.25), transparent 65%),
            radial-gradient(ellipse 60% 50% at 15% 80%, rgba(167,139,250,0.18), transparent 65%);
          animation: hcAurora1 11s ease-in-out infinite alternate;
          will-change: transform;
        }
        .hc-bg::after {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 75% 10%, rgba(249,115,22,0.20), transparent 65%),
            radial-gradient(ellipse 55% 45% at 25% 55%, rgba(250,204,21,0.12), transparent 65%);
          animation: hcAurora2 16s ease-in-out infinite alternate-reverse;
          will-change: transform;
        }
        @keyframes hcAurora1 {
          0%   { opacity: 0.65; transform: scale(1) translateX(0) translateY(0); }
          100% { opacity: 1;    transform: scale(1.06) translateX(2%) translateY(-1%); }
        }
        @keyframes hcAurora2 {
          0%   { opacity: 0.5; transform: scale(1) translateX(0); }
          100% { opacity: 0.9; transform: scale(1.08) translateX(-3%) translateY(2%); }
        }

        .hc-canvas {
          position: absolute; inset: 0;
          pointer-events: none;
          touch-action: pan-y;
          z-index: 1;
        }
        .hc-vignette {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background:
            radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.18), transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(5,5,16,0.60) 100%);
        }
        .hc-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 3;
          opacity: 0.055; mix-blend-mode: overlay;
          /* Noise data URL removed: styled-jsx minifier saw "://" in xmlns
             and treated "//" as a comment, truncating the data URL and
             prematurely closing the rule with "}". This dropped EVERY
             subsequent rule (.hc-fallback through .hc-scroll-line) from
             the parsed stylesheet. Effect: hero title/chips/CTAs rendered
             with browser defaults. Sacrificing 5% grain noise to recover
             the entire hero stylesheet. */
        }
        .hc-fallback {
          position: absolute; inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }
        .hc-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: clamp(2rem, 8vh, 5rem) 2rem 0;
          text-align: center; z-index: 5; pointer-events: none;
        }
        .hc-eyebrow {
          font-size: clamp(0.7rem, 1.4vw, 0.85rem);
          letter-spacing: 0.4em; text-transform: uppercase;
          color: #fde68a; font-weight: 500; margin-bottom: 1.4rem;
          text-shadow: 0 2px 14px rgba(0,0,0,0.7);
        }
        .hc-title {
          font-size: clamp(2.8rem, 9.5vw, 7rem);
          font-weight: 800; line-height: 0.95;
          margin: 0 0 1.4rem; letter-spacing: -0.035em;
          background: linear-gradient(180deg, #ffffff 0%, #fde68a 55%, #f97316 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          /* drop-shadow removed: filter on gradient-clipped text causes blurry rasterization
             on iOS Safari and some Android Chrome builds. Glow handled by wrapper below. */
          perspective: 800px;
        }
        .hc-title-wrap {
          filter: drop-shadow(0 8px 28px rgba(249,115,22,0.30));
        }
        .hc-sub {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: rgba(255,255,255,0.82); max-width: 620px;
          margin: 0 0 2.2rem; line-height: 1.5;
          text-shadow: 0 2px 12px rgba(0,0,0,0.7);
        }
        .hc-chips { display: flex; gap: 0.7rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2.2rem; pointer-events: auto; }
        .hc-chip {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.55rem 1rem; border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff; font-size: 0.875rem; font-weight: 500;
        }
        .hc-chip span:first-child { color: #facc15; }
        .hc-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; pointer-events: auto; }
        .hc-cta-primary {
          padding: 1.05rem 2.4rem; border: none; cursor: pointer;
          background: linear-gradient(135deg, #facc15 0%, #f97316 100%);
          color: #0a0a14; font-weight: 700; font-size: 1.05rem;
          border-radius: 999px; letter-spacing: 0.02em;
          box-shadow: 0 12px 40px rgba(249,115,22,0.5), 0 0 0 1px rgba(255,255,255,0.10) inset;
          position: relative; overflow: hidden;
        }
        .hc-cta-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.9s;
        }
        .hc-cta-primary:hover::after { transform: translateX(100%); }
        .hc-cta-secondary {
          padding: 1.05rem 2rem; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.18);
          color: #fff; font-weight: 500; font-size: 1rem;
          border-radius: 999px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .hc-scroll-cue {
          position: absolute; bottom: 1.6rem; left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.55); font-size: 0.72rem;
          letter-spacing: 0.3em; text-transform: uppercase;
          z-index: 6; pointer-events: none;
        }
        .hc-scroll-line {
          width: 1px; height: 38px; margin: 0.5rem auto 0;
          background: linear-gradient(180deg, transparent, #facc15, transparent);
          animation: hcScroll 2.5s ease-in-out infinite;
        }
        @keyframes hcScroll {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50%       { opacity: 1;   transform: scaleY(1); }
        }
        @media (max-width: 768px) {
          .hc-wrap { height: 100svh; min-height: 600px; }
          .hc-content {
            justify-content: center;
            padding: 2rem 1.5rem 5rem;
          }
          .hc-title { white-space: nowrap; font-size: clamp(2rem, 8vw, 3.5rem); }
          /* background-clip:text is invisible on mobile Safari — override with solid white */
          .hc-title {
            -webkit-text-fill-color: #ffffff !important;
            color: #ffffff !important;
            background: none !important;
            -webkit-background-clip: unset !important;
            background-clip: unset !important;
            filter: none !important;
            perspective: none;
          }
          /* Stronger aurora on mobile since no 3D car.
             !important removed — froze animation opacity on iOS/Android. */
          .hc-bg::before { animation: hcAurora1Mobile 11s ease-in-out infinite alternate; }
          .hc-bg::after  { animation: hcAurora2Mobile 16s ease-in-out infinite alternate-reverse; }
        }
        @keyframes hcAurora1Mobile {
          0%   { opacity: 0.85; transform: scale(1.2) translateX(0) translateY(0); }
          100% { opacity: 1;    transform: scale(1.32) translateX(2%) translateY(-1%); }
        }
        @keyframes hcAurora2Mobile {
          0%   { opacity: 0.75; transform: scale(1.15) translateX(0); }
          100% { opacity: 0.95; transform: scale(1.28) translateX(-3%) translateY(2%); }
        }
        @media (max-width: 480px) {
          .hc-title { font-size: clamp(1.8rem, 7.5vw, 3rem); white-space: nowrap; }
          .hc-chips { gap: 0.4rem; margin-bottom: 1.6rem; }
          .hc-chip { padding: 0.4rem 0.7rem; font-size: 0.78rem; }
          .hc-cta-row { flex-direction: column; width: 100%; padding: 0 1rem; }
          .hc-cta-primary, .hc-cta-secondary { width: 100%; }
        }
      `}</style>

      {/* Layer 0 — CSS animated aurora background (always visible).
          Inline gradient + dark bg are FOUC fallback for mobile where
          styled-jsx ::before/::after animations sometimes don't apply
          on first paint. Animated layer enhances when jsx mounts. */}
      <div
        className="hc-bg"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse 90% 65% at 40% -5%, rgba(124,58,237,0.35), transparent 65%),' +
            'radial-gradient(ellipse 75% 55% at 88% 65%, rgba(249,115,22,0.25), transparent 65%),' +
            'radial-gradient(ellipse 60% 50% at 15% 80%, rgba(167,139,250,0.18), transparent 65%),' +
            '#050510',
          overflow: 'hidden',
        }}
      />

      {/* Layer 1 — WebGL 3D canvas (desktop only, null = still detecting) */}
      {supports3D === true ? (
        <div className="hc-canvas">
          <Canvas
            camera={{ position: [8.0, 2.0, 8.0], fov: 52 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: false,
            }}
            dpr={1}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault(); setSupports3D(false);
              });
              gl.domElement.style.touchAction = 'pan-y';
              gl.domElement.style.pointerEvents = 'none';
            }}
          >
            <Suspense fallback={null}>
              <fog attach="fog" args={['#06060c', 12, 32]} />

              {/* Lights — no shadow maps for perf */}
              <ambientLight intensity={0.4} color="#fef3c7" />
              <hemisphereLight args={['#fde68a', '#1a0a2e', 0.45]} />
              <directionalLight position={[5, 6, 3]} intensity={1.6} color="#fde68a" />
              <directionalLight position={[-4, 3, -2]} intensity={0.7} color="#f97316" />
              <pointLight position={[-3, 4, -5]} intensity={1.0} color="#a78bfa" distance={20} />

              {/* Procedural HDRI — frames=1 so renders once, CSP-safe */}
              <Environment resolution={256} frames={1}>
                <Lightformer form="rect" intensity={2.2} color="#fde68a"
                  position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 6, 1]} />
                <Lightformer form="rect" intensity={1.4} color="#a78bfa"
                  position={[-5, 2, -3]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
                <Lightformer form="rect" intensity={1.6} color="#f97316"
                  position={[5, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
                <Lightformer form="rect" intensity={1.2} color="#facc15"
                  position={[0, 3, 7]} rotation={[0, 0, 0]} scale={[8, 3, 1]} />
              </Environment>

              {/* Stars only — Sparkles removed for perf */}
              <Stars radius={60} depth={40} count={500} factor={2.2} fade speed={0.4} />

              <CinematicRig>
                <Float speed={0.7} rotationIntensity={0.05} floatIntensity={0.12}>
                  {/* fallback={null}: don't flash old procedural car before Ferrari GLB resolves */}
                  <Suspense fallback={null}>
                    <Ferrari />
                  </Suspense>
                </Float>
                <SimpleFloor />
              </CinematicRig>
            </Suspense>
          </Canvas>
        </div>
      ) : null /* mobile: CSS aurora hero only — smooth, no WebGL */}

      {/* mobile: CSS aurora (hc-bg) handles background — no static photo.
          Outdoor daytime photo was the #1 reason mobile ≠ desktop.
          Dark CSS aurora matches the desktop dark-studio aesthetic. */}

      {/* Layer 2 — vignette overlay */}
      <div className="hc-vignette" />
      {/* Layer 3 — film grain */}
      <div className="hc-grain" />

      {/* Layer 5 — UI content. Inline critical layout prevents FOUC where
          style-jsx hasn't applied yet and content collapses to top-left.
          AnimatePresence removed: it was causing a flash on every language change. */}
      <motion.div
        className="hc-content"
        style={{
          y: yContent,
          opacity: opacityContent,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={`lang-${language}`}
      >
        <motion.div className="hc-eyebrow" variants={itemVariants}>{t.eyebrow}</motion.div>
        <div className="hc-title-wrap">
          <AnimatedTitle text={t.title} isMobile={supports3D === false} />
        </div>
        <motion.p className="hc-sub" variants={itemVariants}>{t.sub}</motion.p>
        <motion.div className="hc-chips" variants={itemVariants} style={{ pointerEvents: 'auto' }}>
          {[t.chip1, t.chip2, t.chip3].map((c, i) => (
            <motion.span key={i} className="hc-chip"
              whileHover={{ y: -3, backgroundColor: 'rgba(250,204,21,0.12)', borderColor: 'rgba(250,204,21,0.35)' }}
              transition={{ duration: 0.2 }}>
              <span>✦</span><span>{c}</span>
            </motion.span>
          ))}
        </motion.div>
        <motion.div className="hc-cta-row" variants={itemVariants} style={{ pointerEvents: 'auto' }}>
          <MagneticCTA className="hc-cta-primary" onClick={onCTA}>{t.cta} →</MagneticCTA>
          <motion.a className="hc-cta-secondary"
            href="https://wa.me/903924440000" target="_blank" rel="noopener noreferrer"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.10)', y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}>
            <span>💬</span><span>WhatsApp</span>
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div className="hc-scroll-cue"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}>
        Scroll
        <div className="hc-scroll-line" />
      </motion.div>
    </section>
  );
};

export default HeroCinematic;
