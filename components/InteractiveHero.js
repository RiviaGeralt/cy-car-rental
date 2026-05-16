import React, { useRef, useEffect, useState } from 'react';

/**
 * Interactive Car Rental Hero Section with Mouse Tracking
 *
 * Customized for: Cyprus Road Car Rental
 * Features:
 * - Parallax effect on mouse movement
 * - Car emoji with parallax layers
 * - Animated text reveal
 * - CTA for booking/inquiry
 * - Bilingual support (EN/TR)
 * - Fully responsive
 */

const InteractiveHero = ({ language = 'en' }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const translations = {
    en: {
      title: 'Start Your Cyprus Story',
      subtitle: 'Premium car rentals for unforgettable adventures',
      cta: 'Book Now',
      features: ['Free Pickup', '24/7 Support', 'Best Prices']
    },
    tr: {
      title: 'Kıbrıs Hikayenizi Başlatın',
      subtitle: 'Unutulmaz maceralar için premium araba kiralama',
      cta: 'Şimdi Rezerv Edin',
      features: ['Ücretsiz Teslim', '24/7 Destek', 'En İyi Fiyatlar']
    }
  };

  const t = translations[language];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    container?.addEventListener('mouseenter', () => setIsHovering(true));
    container?.addEventListener('mouseleave', () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    });

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('mouseenter', () => setIsHovering(true));
      container?.removeEventListener('mouseleave', () => setIsHovering(false));
    };
  }, []);

  const orbStyle = {
    position: 'absolute',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    opacity: 0.15,
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out'
  };

  const topOrbStyle = {
    ...orbStyle,
    top: '-160px',
    right: '-160px',
    width: '320px',
    height: '320px',
    backgroundColor: '#facc15',
    transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`
  };

  const bottomOrbStyle = {
    ...orbStyle,
    bottom: '-160px',
    left: '-160px',
    width: '320px',
    height: '320px',
    backgroundColor: '#2563eb',
    transform: `translate(${-mousePosition.x * 40}px, ${-mousePosition.y * 40}px)`
  };

  const carStyle = {
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.2,
    fontSize: '144px',
    pointerEvents: 'none',
    transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
    transition: 'transform 0.1s ease-out'
  };

  const buttonShineStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    opacity: 0,
    animation: isHovering ? 'shine 0.6s infinite' : 'none'
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .hero-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e293b 100%);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }

        .hero-title {
          font-size: clamp(2rem, 8vw, 4.5rem);
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
          animation: slideDown 0.8s ease-out 0.2s both;
          max-width: 900px;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: #fef3c7;
          max-width: 700px;
          margin-bottom: 2rem;
          animation: slideDown 0.8s ease-out 0.4s both;
        }

        .hero-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          animation: slideDown 0.8s ease-out 0.5s both;
          font-size: clamp(0.875rem, 2vw, 1rem);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
        }

        .feature-checkmark {
          color: #facc15;
          font-weight: bold;
        }

        .hero-cta-wrapper {
          animation: scaleIn 0.8s ease-out 0.6s both;
          margin-top: 2rem;
        }

        .hero-button {
          position: relative;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #facc15 0%, #f97316 100%);
          color: #1f2937;
          font-weight: bold;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(250, 204, 21, 0.3);
        }

        .hero-button:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(250, 204, 21, 0.5);
        }

        .hero-button:active {
          transform: scale(0.95);
        }

        .hero-whatsapp {
          animation: slideDown 0.8s ease-out 0.8s both;
          margin-top: 1.5rem;
        }

        .hero-whatsapp a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: clamp(0.875rem, 2vw, 1rem);
        }

        .hero-whatsapp a:hover {
          color: #fef3c7;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          animation: bounce 2s infinite;
        }

        .scroll-wheel {
          width: 24px;
          height: 40px;
          border: 2px solid #fcd34d;
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 0.5rem 0;
        }

        .scroll-dot {
          width: 4px;
          height: 8px;
          background-color: #fcd34d;
          border-radius: 2px;
          animation: bounce 2s infinite;
        }

        @media (max-width: 768px) {
          .hero-container {
            height: auto;
            min-height: 100vh;
          }

          .hero-features {
            flex-direction: column;
            gap: 1rem;
          }

          .scroll-indicator {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="hero-container" ref={containerRef}>
        {/* Animated background orbs (Cyprus colors) */}
        <div style={topOrbStyle} />
        <div style={bottomOrbStyle} />

        {/* Car silhouette with parallax */}
        <div style={carStyle}>🚗</div>

        {/* Content */}
        <div className="hero-content">
          {/* Main heading */}
          <h1 className="hero-title">{t.title}</h1>

          {/* Subtitle */}
          <p className="hero-subtitle">{t.subtitle}</p>

          {/* Features row */}
          <div className="hero-features">
            {t.features.map((feature, i) => (
              <div key={i} className="feature-item">
                <span className="feature-checkmark">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hero-cta-wrapper">
            <button className="hero-button" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              <span style={{ position: 'relative', zIndex: 10 }}>{t.cta}</span>
              <div style={buttonShineStyle} />
            </button>
          </div>

          {/* WhatsApp button */}
          <div className="hero-whatsapp">
            <a href="https://wa.me/970594198211?text=Hi%20I%20am%20interested%20in%20renting%20a%20car" target="_blank" rel="noopener noreferrer">
              <span>💬</span>
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-wheel">
              <div className="scroll-dot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveHero;
