import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * CarCard3D — mouse-following 3D tilt + glow glassmorphism card
 * Used by Fleet section. Replaces flat card layout.
 */
const CarCard3D = ({ car, index, language = 'en', onInquire }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 220, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 20 });

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const name = language === 'tr' ? car.name_tr : car.name;
  const desc = language === 'tr' ? car.description_tr : car.description;
  const feats = language === 'tr' ? car.features_tr : car.features;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={isMobile ? {} : { rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 1000 }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className="card3d"
    >
      <style jsx>{`
        .card3d {
          position: relative;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          padding: 0;
          overflow: hidden;
          backdrop-filter: blur(5px) saturate(120%);
          -webkit-backdrop-filter: blur(5px) saturate(120%);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255,255,255,0.04) inset;
          transition: box-shadow 0.4s;
          will-change: transform;
        }
        .card3d:hover {
          box-shadow:
            0 25px 80px rgba(249, 115, 22, 0.35),
            0 0 0 1px rgba(250, 204, 21, 0.25) inset;
        }
        .glow {
          position: absolute; inset: -1px;
          background: linear-gradient(135deg, transparent, rgba(250, 204, 21, 0.3), transparent);
          border-radius: 20px;
          opacity: 0; transition: opacity 0.4s;
          pointer-events: none;
        }
        .card3d:hover .glow { opacity: 1; }
        .img-wrap {
          position: relative; aspect-ratio: 16/10;
          overflow: hidden; transform: translateZ(40px);
        }
        .img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s cubic-bezier(.2,.8,.2,1);
        }
        .card3d:hover .img-wrap img { transform: scale(1.06); }
        .img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,10,20,0.92) 100%);
        }
        .year-badge {
          position: absolute; top: 14px; right: 14px;
          padding: 0.35rem 0.8rem; border-radius: 999px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(5px);
          color: #facc15; font-weight: 600; font-size: 0.78rem;
          letter-spacing: 0.08em; border: 1px solid rgba(250,204,21,0.3);
        }
        .body {
          padding: 1.6rem 1.4rem 1.4rem;
          transform: translateZ(30px);
        }
        .name {
          font-size: 1.5rem; font-weight: 700; color: #fff;
          margin: 0 0 0.5rem; letter-spacing: -0.01em;
        }
        .desc {
          color: rgba(255,255,255,0.65); font-size: 0.92rem;
          margin: 0 0 1.1rem; line-height: 1.5;
        }
        .specs {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem; margin-bottom: 1.1rem;
          padding: 0.85rem; border-radius: 12px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .spec { text-align: center; }
        .spec-label {
          color: rgba(255,255,255,0.4); font-size: 0.65rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 0.2rem;
        }
        .spec-val {
          color: #facc15; font-weight: 600; font-size: 0.85rem;
        }
        .feats { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem; }
        .feat {
          padding: 0.3rem 0.65rem; border-radius: 999px;
          background: rgba(250, 204, 21, 0.08);
          border: 1px solid rgba(250, 204, 21, 0.20);
          color: #fde68a; font-size: 0.74rem; font-weight: 500;
        }
        .btn {
          width: 100%; padding: 0.85rem 1.2rem; border: none;
          background: linear-gradient(135deg, #facc15, #f97316);
          color: #0a0a14; font-weight: 700; font-size: 0.95rem;
          border-radius: 12px; cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s;
          letter-spacing: 0.01em;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(249, 115, 22, 0.45);
        }
        @media (max-width: 768px) {
          .card3d {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            will-change: auto;
          }
          .year-badge { backdrop-filter: none; }
        }
      `}</style>

      <div className="glow" />

      <div className="img-wrap">
        <img src={car.image} alt={name} loading="lazy" />
        <div className="img-overlay" />
        <div className="year-badge">{car.year}</div>
      </div>

      <div className="body">
        <h3 className="name">{name}</h3>
        <p className="desc">{desc}</p>

        <div className="specs">
          <div className="spec">
            <div className="spec-label">{language === 'tr' ? 'Vites' : 'Trans'}</div>
            <div className="spec-val">{car.transmission === 'Automatic' ? 'A/T' : 'M/T'}</div>
          </div>
          <div className="spec">
            <div className="spec-label">{language === 'tr' ? 'Yakıt' : 'Fuel'}</div>
            <div className="spec-val">{car.fuelTank}</div>
          </div>
          <div className="spec">
            <div className="spec-label">{language === 'tr' ? 'KM' : 'Miles'}</div>
            <div className="spec-val">{car.mileage.split(' ')[0]}</div>
          </div>
        </div>

        <div className="feats">
          {feats.slice(0, 3).map((f, i) => (
            <span key={i} className="feat">{f}</span>
          ))}
        </div>

        <button className="btn" onClick={() => onInquire(car)}>
          {language === 'tr' ? 'Hemen Sorgula' : 'Reserve This Car'} →
        </button>
      </div>
    </motion.div>
  );
};

export default CarCard3D;
