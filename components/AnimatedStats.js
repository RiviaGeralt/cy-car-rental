import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

const Counter = ({ to, suffix = '', duration = 1.8, start = false }) => {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    if (start) {
      const ctrl = animate(mv, to, { duration, ease: [0.2, 0.8, 0.2, 1] });
      return ctrl.stop;
    }
  }, [start, to, duration, mv]);

  return (
    <span>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
};

const AnimatedStats = ({ language = 'en' }) => {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const stats = language === 'tr' ? [
    { v: 500, s: '+', label: 'Mutlu Müşteri' },
    { v: 5, s: '', label: 'Premium Araç' },
    { v: 24, s: '/7', label: 'Destek' },
    { v: 100, s: '%', label: 'Memnuniyet' },
  ] : [
    { v: 500, s: '+', label: 'Happy Renters' },
    { v: 5, s: '',  label: 'Premium Cars' },
    { v: 24,  s: '/7', label: 'Support' },
    { v: 100, s: '%', label: 'Satisfaction' },
  ];

  return (
    <section className="stats-band" ref={sectionRef}>
      {/* global: motion.div.stat doesn't receive scope class → numbers
          would render with browser defaults instead of gradient/clamp sizing. */}
      <style jsx global>{`
        .stats-band {
          padding: 6rem 1.5rem;
          background:
            radial-gradient(ellipse at center, rgba(250,204,21,0.06) 0%, transparent 60%),
            #050510;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .stat { text-align: center; }
        .num {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          background: linear-gradient(180deg, #fff, #facc15);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1; margin-bottom: 0.6rem;
          letter-spacing: -0.03em;
        }
        .label {
          color: rgba(255,255,255,0.55);
          font-size: 0.78rem; letter-spacing: 0.25em;
          text-transform: uppercase; font-weight: 500;
        }
        @media (max-width: 768px) {
          .grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem 1.5rem; }
          .stats-band { padding: 4rem 1.5rem; }
        }
      `}</style>
      <div className="grid">
        {stats.map((st, i) => (
          <motion.div
            key={i} className="stat"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="num"><Counter to={st.v} suffix={st.s} start={sectionInView} /></div>
            <div className="label">{st.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AnimatedStats;
