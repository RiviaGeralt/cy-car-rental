import React, { useState } from 'react';

/**
 * Interactive Car Rental Hero Section with Video Background
 *
 * Customized for: Cyprus Road Car Rental
 */

const InteractiveHero = ({ language = 'en' }) => {
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
  const videoUrl = 'https://videos.pexels.com/video-files/5731474/5731474-sd_640_360_30fps.mp4';

  return (
    <>
      <style jsx>{`
        .hero-container { position: relative; width: 100%; height: 100vh; overflow: hidden; background: #000; }
        .hero-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%); z-index: 5; }
        .hero-content { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
        .hero-title { font-size: clamp(2rem, 8vw, 4.5rem); font-weight: bold; color: white; margin-bottom: 1rem; animation: slideDown 0.8s ease-out 0.2s both; max-width: 900px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .hero-subtitle { font-size: clamp(1rem, 3vw, 1.5rem); color: #fef3c7; max-width: 700px; margin-bottom: 2rem; animation: slideDown 0.8s ease-out 0.4s both; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
        .hero-features { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin-bottom: 3rem; animation: slideDown 0.8s ease-out 0.5s both; font-size: clamp(0.875rem, 2vw, 1rem); }
        .feature-item { display: flex; align-items: center; gap: 0.5rem; color: white; background: rgba(0,0,0,0.3); padding: 0.5rem 1rem; border-radius: 0.5rem; backdrop-filter: blur(10px); }
        .feature-checkmark { color: #facc15; font-weight: bold; }
        .hero-cta-wrapper { animation: scaleIn 0.8s ease-out 0.6s both; margin-top: 2rem; }
        .hero-button { padding: 1rem 2.5rem; background: linear-gradient(135deg, #facc15 0%, #f97316 100%); color: #1f2937; font-weight: bold; border: none; border-radius: 0.5rem; font-size: 1.125rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(250,204,21,0.3); }
        .hero-button:hover { transform: scale(1.05); box-shadow: 0 8px 25px rgba(250,204,21,0.5); }
        .hero-whatsapp { animation: slideDown 0.8s ease-out 0.8s both; margin-top: 1.5rem; }
        .hero-whatsapp a { display: inline-flex; align-items: center; gap: 0.5rem; color: white; text-decoration: none; transition: all 0.3s ease; font-size: clamp(0.875rem, 2vw, 1rem); background: rgba(0,0,0,0.3); padding: 0.5rem 1rem; border-radius: 0.5rem; backdrop-filter: blur(10px); }
        .hero-whatsapp a:hover { color: #fef3c7; background: rgba(0,0,0,0.5); }
        .scroll-indicator { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 20; animation: bounce 2s infinite; }
        .scroll-wheel { width: 24px; height: 40px; border: 2px solid #fcd34d; border-radius: 12px; display: flex; align-items: flex-start; justify-content: center; padding: 0.5rem 0; }
        .scroll-dot { width: 4px; height: 8px; background-color: #fcd34d; border-radius: 2px; animation: bounce 2s infinite; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (max-width: 768px) { .hero-features { flex-direction: column; } .scroll-indicator { display: none; } }
      `}</style>

      <div className="hero-container">
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">{t.title}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-features">
            {t.features.map((feature, i) => (
              <div key={i} className="feature-item">
                <span className="feature-checkmark">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="hero-cta-wrapper">
            <button className="hero-button" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              {t.cta}
            </button>
          </div>
          <div className="hero-whatsapp">
            <a href="https://wa.me/970594198211" target="_blank" rel="noopener noreferrer">
              <span>💬</span>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
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