import Head from 'next/head';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const CARS = [
  { id: 1, name: 'Fiat 500', name_tr: 'Fiat 500', year: 2023, features: ['Bluetooth Audio', 'USB Charging', 'Air Conditioning'], features_tr: ['Bluetooth Ses', 'USB Sarj', 'Klima'], mileage: '12,450 km', fuelTank: '40L', transmission: 'Automatic', description: 'Compact and nimble. Perfect for exploring narrow streets.', description_tr: 'Kompakt ve cevik. Dar sokaklari kesfetmek icin mukemmel.', image: 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=400&fit=crop' },
  { id: 2, name: 'Toyota Yaris', name_tr: 'Toyota Yaris', year: 2023, features: ['Bluetooth Connectivity', 'Cruise Control', 'Rear Camera'], features_tr: ['Bluetooth Baglantisi', 'Hiz Sabitleyici', 'Arka Kamera'], mileage: '8,200 km', fuelTank: '45L', transmission: 'Manual', description: 'Reliable and fuel-efficient. Smooth ride on all terrain.', description_tr: 'Guvenilir ve yakıt tasarrufu. Tum arazi turlerinde duzgun surusler.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' },
  { id: 3, name: 'Mercedes C-Class', name_tr: 'Mercedes C-Sinifi', year: 2023, features: ['Premium Audio', 'Navigation System', 'Leather Seats', 'Sunroof'], features_tr: ['Premium Ses Sistemi', 'Navigasyon Sistemi', 'Deri Koltuklar', 'Acilir Cati'], mileage: '5,100 km', fuelTank: '66L', transmission: 'Automatic', description: 'Luxury and comfort. Experience Cyprus in style.', description_tr: 'Luxs ve rahatlık. Kibrisin stilinizle kesfet.', image: 'https://images.unsplash.com/photo-1554215286-94a9a47c3e1f?w=500&h=400&fit=crop' },
  { id: 4, name: 'Honda CR-V', name_tr: 'Honda CR-V', year: 2022, features: ['Apple CarPlay', 'All-Wheel Drive', 'Panoramic Sunroof', 'Bluetooth'], features_tr: ['Apple CarPlay', 'Tum Tekerlek Itis', 'Panoramik Acilir Cati', 'Bluetooth'], mileage: '18,900 km', fuelTank: '58L', transmission: 'Automatic', description: 'Spacious and capable. Adventure-ready.', description_tr: 'Genis ve guclu. Macera icin hazir.', image: 'https://images.unsplash.com/photo-1606660265514-358ebbd288d0?w=500&h=400&fit=crop' },
  { id: 5, name: 'Volkswagen Golf', name_tr: 'Volkswagen Golf', year: 2023, features: ['Climate Control', 'Keyless Entry', 'Bluetooth', 'Touchscreen'], features_tr: ['Iklim Kontrolu', 'Anahtarsiz Giriş', 'Bluetooth', 'Dokunmatik Ekran'], mileage: '9,750 km', fuelTank: '50L', transmission: 'Automatic', description: 'Modern engineering meets everyday comfort.', description_tr: 'Modern muhendislik gunluk rahatlıkla bulusuyor.', image: 'https://images.unsplash.com/photo-1590362891990-f8ddb41d3dbf?w=500&h=400&fit=crop' },
];

const TEXT = {
  en: {
    title: 'Cyprus Road',
    subtitle: 'Discover Cyprus in a car built for the journey',
    story: 'Every journey tells a story',
    confidence: 'Our premium fleet is maintained to the highest standards. Drive with confidence. Explore with freedom.',
    fleet: 'Our Fleet',
    fleetSubtitle: 'Carefully maintained. Ready for your adventure.',
    inquire: 'Inquire Now',
    cta: 'Ready for your Cyprus adventure?',
    ctaSub: 'Contact us today. We will make sure you are in the perfect car.',
    ctaBtn: 'Get in Touch',
    mileage: 'Mileage',
    fuelTank: 'Fuel Tank',
    transmission: 'Transmission',
    footer: 'Cyprus Road Premium Car Rental',
    footerDetails: 'Across Cyprus | Available 24/7 | Find us on Google Maps',
    modalTitle: 'Interested in this car?',
    modalText: 'Tell us your details and we will get back to you shortly.',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message (optional)',
    send: 'Send Inquiry',
    whatsapp: 'Message on WhatsApp',
    selectLanguage: 'Select Language',
    chooseLanguage: 'Choose your preferred language',
  },
  tr: {
    title: 'Kibris Yolu',
    subtitle: 'Kibrisin aracinizla kesfet',
    story: 'Her seyahat bir hikaye',
    confidence: 'Premium arac filomuz en yuksek standartlarda bakımlanır.',
    fleet: 'Arac Filomuz',
    fleetSubtitle: 'Bakımı yapılmış. Maceranıza hazır.',
    inquire: 'Bilgi Al',
    cta: 'Kibris macerası için hazır?',
    ctaSub: 'Bugün bize ulaşın.',
    ctaBtn: 'Iletişime Geç',
    mileage: 'Kilometre',
    fuelTank: 'Yakıt Tankı',
    transmission: 'Vites',
    footer: 'Kibris Yolu Premium Arac Kiralama',
    footerDetails: 'Kibris capında | 24/7 Acık | Google Haritalar',
    modalTitle: 'Bu arabaya ilgi duyuyor musunuz?',
    modalText: 'Bilgilerinizi bize söyleyin.',
    name: 'Ad Soyad',
    email: 'E-posta',
    phone: 'Telefon',
    message: 'Mesaj (Isteğe bağlı)',
    send: 'Gönder',
    whatsapp: 'WhatsApp ta Mesaj Gönder',
    selectLanguage: 'Dil Secin',
    chooseLanguage: 'Tercih ettiginiz dili secin',
  },
};

export default function Home() {
  const [lang, setLang] = useState('en');
  const [langModalOpen, setLangModalOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const t = TEXT[lang];

  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    setLangModalOpen(false);
  };

  const handleInquire = (car) => {
    setSelectedCar(car);
    setModalOpen(true);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I am interested in the ${selectedCar[lang === 'tr' ? 'name_tr' : 'name']}`;
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`);
  };

  return (
    <>
      <Head>
        <title>Cyprus Road | Premium Car Rental</title>
        <meta name="description" content="Premium car rental in Cyprus" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        {langModalOpen && (
          <div className={styles.langModal}>
            <div className={styles.langModalContent}>
              <h2>{TEXT.en.selectLanguage}</h2>
              <p>{TEXT.en.chooseLanguage}</p>
              <div className={styles.langModalButtons}>
                <button className={styles.langModalButton} onClick={() => handleSelectLanguage('en')}>
                  English
                </button>
                <button className={styles.langModalButton} onClick={() => handleSelectLanguage('tr')}>
                  Turkce
                </button>
              </div>
            </div>
          </div>
        )}

        {modalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button className={styles.closeBtn} onClick={() => setModalOpen(false)}>
                X
              </button>
              <h3>{t.modalTitle}</h3>
              <p>{t.modalText}</p>
              <form className={styles.form}>
                <input type="text" placeholder={t.name} required />
                <input type="email" placeholder={t.email} required />
                <input type="tel" placeholder={t.phone} required />
                <textarea placeholder={t.message}></textarea>
                <button type="button" className={styles.submitBtn} onClick={() => setModalOpen(false)}>
                  {t.send}
                </button>
              </form>
              <button className={styles.whatsappBtn} onClick={handleWhatsApp}>
                {t.whatsapp}
              </button>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h2>{t.story}</h2>
            <p>{t.confidence}</p>
          </div>
        </section>

        <section className={styles.fleet}>
          <div className={styles.fleetHeader}>
            <h2>{t.fleet}</h2>
            <p>{t.fleetSubtitle}</p>
          </div>

          <div className={styles.carsGrid}>
            {CARS.map((car, index) => {
              const carName = lang === 'tr' ? car.name_tr : car.name;
              const carDesc = lang === 'tr' ? car.description_tr : car.description;
              const carFeatures = lang === 'tr' ? car.features_tr : car.features;

              return (
                <div key={car.id} className={styles.carCard} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={styles.carImage}>
                    <img src={car.image} alt={carName} />
                  </div>
                  <div className={styles.carIndex}>{String(car.id).padStart(2, '0')}</div>

                  <div className={styles.carContent}>
                    <div className={styles.carHeader}>
                      <h3 className={styles.carName}>{carName}</h3>
                      <p className={styles.carYear}>{car.year}</p>
                    </div>

                    <p className={styles.carDescription}>{carDesc}</p>

                    <div className={styles.specs}>
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>{t.mileage}</span>
                        <span className={styles.specValue}>{car.mileage}</span>
                      </div>
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>{t.fuelTank}</span>
                        <span className={styles.specValue}>{car.fuelTank}</span>
                      </div>
                      <div className={styles.specRow}>
                        <span className={styles.specLabel}>{t.transmission}</span>
                        <span className={styles.specValue}>{car.transmission}</span>
                      </div>
                    </div>

                    <div className={styles.features}>
                      {carFeatures.map((feature, idx) => (
                        <span key={idx} className={styles.feature}>
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button className={styles.inquireBtn} onClick={() => handleInquire(car)}>
                      {t.inquire}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.cta}>
          <h2>{t.cta}</h2>
          <p>{t.ctaSub}</p>
          <button className={styles.ctaButton}>{t.ctaBtn}</button>
        </section>

        <footer className={styles.footer}>
          <p>{t.footer}</p>
          <p>{t.footerDetails}</p>
        </footer>
      </div>
    </>
  );
}
