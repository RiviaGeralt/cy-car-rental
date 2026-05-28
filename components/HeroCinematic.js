import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float, ContactShadows, Sparkles, Stars,
  RoundedBox, Environment, Lightformer, MeshReflectorMaterial,
} from '@react-three/drei';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence,
} from 'framer-motion';
import * as THREE from 'three';

/**
 * HeroCinematic — realistic procedural sedan + scroll-driven cinematic camera.
 *
 * Replaces both v3 (toy box-car) and HeroPro (photo only). This is the
 * "make it look real without GLTF" recipe from the R3F Cinematic Hero
 * Pattern skill, leveled up with:
 *
 *   - drei <Environment> + <Lightformer> children: procedural HDRI for
 *     true chrome / paint / glass reflections. No CDN fetch — CSP safe.
 *   - drei <MeshReflectorMaterial>: real mirror ground.
 *   - drei <RoundedBox>: bevelled body panels. The single biggest fix
 *     for "looks like a toy" — sharp box edges read as Lego.
 *   - MeshPhysicalMaterial with clearcoat=1, clearcoatRoughness=0.05,
 *     metalness=0.85: actual car paint behaviour.
 *   - MeshPhysicalMaterial transmission=0.9 for windshield: real glass.
 *   - Sedan silhouette: separate hood, cabin, trunk meshes with angles;
 *     fender bulges over wheels; chrome trim; spoke rims with brake
 *     callipers; LED tail-light bar; spotlight headlight cones.
 *   - Scroll-driven cinematic camera: camera dollies in + orbits as the
 *     user scrolls, with the car rotating slightly counter to the camera
 *     so you always see a fresh angle.
 *
 * Carried over from v3 / HeroPro:
 *   - .canvas-layer pointer-events:none (mobile scroll fix)
 *   - prefers-reduced-motion + deviceMemory<4 → static fallback
 *   - WebGL context-lost listener → graceful degrade
 *   - Framer Motion: stagger entrance, character title flip, magnetic
 *     CTA, lang crossfade, scroll-linked content parallax
 */

/* ─────────────────── Realistic sedan ─────────────────── */

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

function Wheel({ position }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
      {/* Sidewall outer rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.001]}>
        <torusGeometry args={[0.32, 0.022, 12, 36]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Chrome rim */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.115]}>
        <cylinderGeometry args={[0.21, 0.21, 0.02, 24]} />
        <meshPhysicalMaterial {...CHROME} />
      </mesh>
      {/* Spokes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.118]} rotation={[Math.PI / 2, 0, a]}>
            <boxGeometry args={[0.18, 0.04, 0.02]} />
            <meshPhysicalMaterial {...CHROME} />
          </mesh>
        );
      })}
      {/* Hub centre */}
      <mesh position={[0, 0, 0.125]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshPhysicalMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Brake calliper (small orange box behind rim) */}
      <mesh position={[0.12, -0.05, 0.08]}>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Fender({ position }) {
  return (
    <mesh castShadow position={position}>
      <sphereGeometry args={[0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial {...PAINT} />
    </mesh>
  );
}

function SculptCar() {
  return (
    <group rotation={[0, Math.PI / 4, 0]} position={[0, -0.5, 0]}>

      {/* Lower body sill — long flat box */}
      <RoundedBox args={[3.3, 0.18, 1.35]} radius={0.05} smoothness={4} castShadow position={[0, 0.28, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Main body — bevelled, wider than sill, slight taper top */}
      <RoundedBox args={[3.0, 0.55, 1.5]} radius={0.18} smoothness={6} castShadow position={[0, 0.65, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Hood — angled down toward front */}
      <RoundedBox args={[1.0, 0.18, 1.4]} radius={0.08} smoothness={4} castShadow
        position={[1.15, 0.88, 0]} rotation={[0, 0, -0.08]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Trunk — angled down toward back */}
      <RoundedBox args={[0.85, 0.16, 1.4]} radius={0.08} smoothness={4} castShadow
        position={[-1.2, 0.88, 0]} rotation={[0, 0, 0.06]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Cabin — sloped roof box (smaller, sits on body) */}
      <RoundedBox args={[1.7, 0.5, 1.32]} radius={0.18} smoothness={6} castShadow position={[-0.05, 1.18, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Windshield (front, sloped) */}
      <mesh castShadow position={[0.75, 1.18, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.85, 0.5, 1.22]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>

      {/* Rear window (sloped) */}
      <mesh castShadow position={[-0.78, 1.18, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.8, 0.5, 1.22]} />
        <meshPhysicalMaterial {...GLASS} />
      </mesh>

      {/* Side windows (left + right) */}
      {[0.66, -0.66].map((z, i) => (
        <mesh key={`sidewin-${i}`} castShadow position={[-0.05, 1.22, z]}>
          <boxGeometry args={[1.55, 0.36, 0.04]} />
          <meshPhysicalMaterial {...GLASS} />
        </mesh>
      ))}

      {/* Chrome window trim (top + side rails) */}
      {[0.69, -0.69].map((z, i) => (
        <mesh key={`trim-side-${i}`} position={[-0.05, 1.4, z]}>
          <boxGeometry args={[1.6, 0.04, 0.04]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
      ))}

      {/* Side body crease (subtle horizontal line) */}
      {[0.755, -0.755].map((z, i) => (
        <mesh key={`crease-${i}`} position={[0, 0.55, z]}>
          <boxGeometry args={[2.6, 0.03, 0.005]} />
          <meshPhysicalMaterial color="#000" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Fenders over wheels */}
      <Fender position={[1.05, 0.45, 0.7]} />
      <Fender position={[1.05, 0.45, -0.7]} />
      <Fender position={[-1.05, 0.45, 0.7]} />
      <Fender position={[-1.05, 0.45, -0.7]} />

      {/* Front grille */}
      <mesh position={[1.62, 0.6, 0]} castShadow>
        <boxGeometry args={[0.06, 0.28, 0.95]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Grille horizontal bars */}
      {[-0.06, 0.06].map((y, i) => (
        <mesh key={`gb-${i}`} position={[1.64, 0.6 + y, 0]}>
          <boxGeometry args={[0.04, 0.03, 0.95]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
      ))}

      {/* Front bumper */}
      <RoundedBox args={[0.25, 0.22, 1.55]} radius={0.06} smoothness={4} castShadow position={[1.62, 0.38, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Rear bumper */}
      <RoundedBox args={[0.25, 0.22, 1.55]} radius={0.06} smoothness={4} castShadow position={[-1.68, 0.38, 0]}>
        <meshPhysicalMaterial {...PAINT} />
      </RoundedBox>

      {/* Headlights — LED bar + glow */}
      {[0.42, -0.42].map((z, i) => (
        <group key={`hl-${i}`} position={[1.65, 0.62, z]}>
          <mesh>
            <boxGeometry args={[0.04, 0.14, 0.32]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={4} toneMapped={false} />
          </mesh>
          <pointLight color="#fef9c3" intensity={1.5} distance={4} />
        </group>
      ))}
      {/* Headlight directional cones (subtle volumetric) */}
      {[0.42, -0.42].map((z, i) => (
        <mesh key={`hl-cone-${i}`} position={[2.4, 0.55, z]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.3, 1.5, 16, 1, true]} />
          <meshBasicMaterial color="#fef9c3" transparent opacity={0.08} side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}

      {/* Tail light bar (LED strip across rear) */}
      <mesh position={[-1.72, 0.62, 0]}>
        <boxGeometry args={[0.03, 0.07, 1.15]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>

      {/* Side mirrors */}
      {[0.78, -0.78].map((z, i) => (
        <mesh key={`mirror-${i}`} castShadow position={[0.78, 1.05, z]}>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshPhysicalMaterial {...PAINT} />
        </mesh>
      ))}

      {/* Door handles (chrome bars) */}
      {[0.756, -0.756].map((z, i) => (
        <mesh key={`handle-${i}`} position={[0.1, 0.78, z]}>
          <boxGeometry args={[0.3, 0.04, 0.03]} />
          <meshPhysicalMaterial {...CHROME} />
        </mesh>
      ))}

      {/* Wheels */}
      <Wheel position={[1.05, 0.34, 0.78]} />
      <Wheel position={[1.05, 0.34, -0.78]} />
      <Wheel position={[-1.05, 0.34, 0.78]} />
      <Wheel position={[-1.05, 0.34, -0.78]} />

      {/* Neon underglow (subtle, purple) */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.6]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─────────────────── Mirror floor ─────────────────── */

function MirrorFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={0.9}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0a18"
        metalness={0.6}
        mirror={0.55}
      />
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
    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / 800, 1);
    };
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
    const s = scrollRef.current; // 0..1 across first 800px

    // Cinematic camera path — orbits as user scrolls
    // Idle (s=0): wide 3/4 view. Mid-scroll (s=0.5): close side angle. Bottom (s=1): low rear.
    const baseAngle = -Math.PI * 0.18 + timeRef.current * 0.06; // slow idle orbit
    const scrollAngle = s * Math.PI * 0.55;
    const angle = baseAngle + scrollAngle;
    const radius = 5.8 - s * 1.8;        // dolly in
    const height = 1.6 - s * 0.4;        // sink slightly
    const px = pointerRef.current.x * 0.4;
    const py = pointerRef.current.y * -0.25;

    const tx = Math.cos(angle) * radius + px;
    const tz = Math.sin(angle) * radius;
    const ty = height + py;

    camera.position.x += (tx - camera.position.x) * 0.06;
    camera.position.y += (ty - camera.position.y) * 0.06;
    camera.position.z += (tz - camera.position.z) * 0.06;
    camera.lookAt(0, 0.6 - s * 0.3, 0);

    // Car counter-rotates slightly so you always see fresh detail
    if (groupRef.current) {
      groupRef.current.rotation.y = s * -0.35 + Math.sin(timeRef.current * 0.4) * 0.04;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─────────────────── Framer helpers ─────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.2, 0.8, 0.2, 1] } },
};

function AnimatedTitle({ text }) {
  const chars = useMemo(() => Array.from(text), [text]);
  return (
    <motion.h1
      className="hc-title"
      aria-label={text}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.35 } } }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={`${c}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          variants={{
            hidden: { opacity: 0, y: 50, rotateX: -80 },
            show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
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
  const [supports3D, setSupports3D] = useState(true);
  const wrapRef = useRef(null);

  // Scroll-linked parallax on content overlay
  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 600], [0, -140]);
  const opacityContent = useTransform(scrollY, [0, 520], [1, 0]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;
    if (reduced || lowMem) setSupports3D(false);
    const handler = (e) => {
      console.warn('[HeroCinematic] WebGL context lost — disabling 3D');
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
    <section ref={wrapRef} className="hc-wrap">
      <style jsx>{`
        .hc-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 680px;
          overflow: hidden;
          isolation: isolate;
          touch-action: pan-y;
          background: transparent; /* ScrollBackdrop shows through */
        }
        .hc-canvas {
          position: absolute; inset: 0;
          pointer-events: none;
          touch-action: pan-y;
          z-index: 1;
        }
        .hc-vignette {
          position: absolute; inset: 0; pointer-events: none;
          z-index: 2;
          background:
            radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.20), transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(5,5,16,0.65) 100%);
        }
        .hc-grain {
          position: absolute; inset: 0; pointer-events: none;
          z-index: 3;
          opacity: 0.06; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
        }
        .hc-fallback {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 12rem; opacity: 0.4; color: #facc15; pointer-events: none;
          filter: drop-shadow(0 0 60px rgba(249,115,22,0.5));
          z-index: 1;
        }
        .hc-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: clamp(2rem, 8vh, 5rem) 2rem 0;
          text-align: center;
          z-index: 5;
          pointer-events: none;
        }
        .hc-eyebrow {
          font-size: clamp(0.7rem, 1.4vw, 0.85rem);
          letter-spacing: 0.4em; text-transform: uppercase;
          color: #fde68a; font-weight: 500;
          margin-bottom: 1.4rem;
          text-shadow: 0 2px 14px rgba(0,0,0,0.7);
        }
        .hc-title {
          font-size: clamp(2.8rem, 9.5vw, 7rem);
          font-weight: 800; line-height: 0.95;
          margin: 0 0 1.4rem; letter-spacing: -0.035em;
          background: linear-gradient(180deg, #ffffff 0%, #fde68a 55%, #f97316 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 30px rgba(249,115,22,0.35));
          perspective: 800px;
        }
        .hc-sub {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: rgba(255,255,255,0.82);
          max-width: 620px; margin: 0 0 2.2rem;
          line-height: 1.5;
          text-shadow: 0 2px 12px rgba(0,0,0,0.7);
        }
        .hc-chips { display: flex; gap: 0.7rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2.2rem; pointer-events: auto; }
        .hc-chip {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.55rem 1rem; border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          color: #fff; font-size: 0.875rem; font-weight: 500;
        }
        .hc-chip span:first-child { color: #facc15; }
        .hc-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; pointer-events: auto; }
        .hc-cta-primary {
          padding: 1.05rem 2.4rem; border: none; cursor: pointer;
          background: linear-gradient(135deg, #facc15 0%, #f97316 100%);
          color: #0a0a14; font-weight: 700; font-size: 1.05rem;
          border-radius: 999px; letter-spacing: 0.02em;
          box-shadow: 0 12px 40px rgba(249, 115, 22, 0.5), 0 0 0 1px rgba(255,255,255,0.10) inset;
          position: relative; overflow: hidden;
        }
        .hc-cta-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.9s;
        }
        .hc-cta-primary:hover::after { transform: translateX(100%); }
        .hc-cta-secondary {
          padding: 1.05rem 2rem; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(14px);
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
          50%      { opacity: 1;   transform: scaleY(1); }
        }
        @media (max-width: 768px) {
          .hc-wrap { height: 95vh; min-height: 600px; }
        }
        @media (max-width: 480px) {
          .hc-content { padding-top: 4rem; }
          .hc-chips { gap: 0.4rem; margin-bottom: 1.6rem; }
          .hc-chip { padding: 0.4rem 0.7rem; font-size: 0.78rem; }
          .hc-cta-row { flex-direction: column; width: 100%; padding: 0 1rem; }
          .hc-cta-primary, .hc-cta-secondary { width: 100%; }
        }
      `}</style>

      {supports3D ? (
        <div className="hc-canvas">
          <Canvas
            shadows
            camera={{ position: [5.5, 1.6, 5.5], fov: 36 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
            dpr={[1, 1.5]}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault(); setSupports3D(false);
              });
              gl.domElement.style.touchAction = 'pan-y';
              gl.domElement.style.pointerEvents = 'none';
            }}
          >
            <Suspense fallback={null}>
              <fog attach="fog" args={['#06060c', 9, 28]} />

              {/* Hand-rig scene lights */}
              <ambientLight intensity={0.35} color="#fef3c7" />
              <hemisphereLight args={['#fde68a', '#1a0a2e', 0.4]} />
              <directionalLight position={[5, 6, 3]} intensity={1.8} color="#fde68a"
                castShadow shadow-mapSize={[2048, 2048]} />
              <directionalLight position={[-4, 3, -2]} intensity={0.8} color="#f97316" />
              <pointLight position={[-3, 4, -5]} intensity={1.2} color="#a78bfa" distance={20} />

              {/* PROCEDURAL HDRI via Lightformer panels — gives chrome / paint
                  real reflections without fetching an HDRI file. CSP-safe. */}
              <Environment resolution={256} frames={1}>
                {/* Big warm overhead */}
                <Lightformer form="rect" intensity={2.5} color="#fde68a"
                  position={[0, 6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 6, 1]} />
                {/* Cool side rim */}
                <Lightformer form="rect" intensity={1.6} color="#a78bfa"
                  position={[-5, 2, -3]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
                {/* Warm side rim */}
                <Lightformer form="rect" intensity={1.8} color="#f97316"
                  position={[5, 2, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
                {/* Front kick */}
                <Lightformer form="rect" intensity={1.4} color="#facc15"
                  position={[0, 3, 7]} rotation={[0, 0, 0]} scale={[8, 3, 1]} />
                {/* Floor bounce */}
                <Lightformer form="rect" intensity={0.6} color="#0a0a14"
                  position={[0, -3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[20, 20, 1]} />
              </Environment>

              <Stars radius={60} depth={40} count={1500} factor={2.5} fade speed={0.5} />
              <Sparkles count={60} scale={[10, 6, 10]} size={2} speed={0.25} color="#fde68a" />

              <CinematicRig>
                <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
                  <SculptCar />
                </Float>
                <MirrorFloor />
                <ContactShadows position={[0, -0.49, 0]} opacity={0.7} scale={12} blur={2.5} far={4.5} />
              </CinematicRig>
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <div className="hc-fallback" aria-hidden="true">🚗</div>
      )}

      <div className="hc-vignette" />
      <div className="hc-grain" />

      <motion.div
        className="hc-content"
        style={{ y: yContent, opacity: opacityContent }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`lang-${language}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.div className="hc-eyebrow" variants={itemVariants}>{t.eyebrow}</motion.div>
            <AnimatedTitle text={t.title} />
            <motion.p className="hc-sub" variants={itemVariants}>{t.sub}</motion.p>
            <motion.div className="hc-chips" variants={itemVariants}>
              {[t.chip1, t.chip2, t.chip3].map((c, i) => (
                <motion.span key={i} className="hc-chip"
                  whileHover={{ y: -3, backgroundColor: 'rgba(250, 204, 21, 0.12)', borderColor: 'rgba(250, 204, 21, 0.35)' }}
                  transition={{ duration: 0.2 }}>
                  <span>✦</span><span>{c}</span>
                </motion.span>
              ))}
            </motion.div>
            <motion.div className="hc-cta-row" variants={itemVariants}>
              <MagneticCTA className="hc-cta-primary" onClick={onCTA}>{t.cta} →</MagneticCTA>
              <motion.a className="hc-cta-secondary"
                href="https://wa.me/970594198211" target="_blank" rel="noopener noreferrer"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.10)', y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}>
                <span>💬</span><span>WhatsApp</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div className="hc-scroll-cue"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}>
        Scroll
        <div className="hc-scroll-line" />
      </motion.div>
    </section>
  );
};

export default HeroCinematic;
