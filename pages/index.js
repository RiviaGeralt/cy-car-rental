import Head from 'next/head';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import styles from '../styles/Home.module.css';
import InteractiveHero from '../components/InteractiveHero';

// Form submission (server handles Formspree endpoint — hidden from browser)
const FORM_ENDPOINT = '/api/submit-form';

// WHATSAPP NUMBER - Business contact
const WHATSAPP_NUMBER = '+970594198211';

const CARS = [
  { id: 1, name: 'Fiat 500', name_tr: 'Fiat 500', year: 2023, features: ['Bluetooth Audio', 'USB Charging', 'Air Conditioning'], features_tr: ['Bluetooth Ses', 'USB Sarj', 'Klima'], mileage: '12,450 km', fuelTank: '40L', transmission: 'Automatic', description: 'Compact and nimble. Perfect for exploring narrow streets.', description_tr: 'Kompakt ve cevik. Dar sokaklari kesfetmek icin mukemmel.', image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg' },
  { id: 2, name: 'Toyota Yaris', name_tr: 'Toyota Yaris', year: 2023, features: ['Bluetooth Connectivity', 'Cruise Control', 'Rear Camera'], features_tr: ['Bluetooth Baglantisi', 'Hiz Sabitleyici', 'Arka Kamera'], mileage: '8,200 km', fuelTank: '45L', transmission: 'Manual', description: 'Reliable and fuel-efficient. Smooth ride on all terrain.', description_tr: 'Guvenilir ve yakıt tasarrufu. Tum arazi turlerinde duzgun surusler.', image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg' },
  { id: 3, name: 'Mercedes C-Class', name_tr: 'Mercedes C-Sinifi', year: 2023, features: ['Premium Audio', 'Navigation System', 'Leather Seats', 'Sunroof'], features_tr: ['Premium Ses Sistemi', 'Navigasyon Sistemi', 'Deri Koltuklar', 'Acilir Cati'], mileage: '5,100 km', fuelTank: '66L', transmission: 'Automatic', description: 'Luxury and comfort. Experience Cyprus in style.', description_tr: 'Luxs ve rahatlık. Kibrisin stilinizle kesfet.', image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg' },
  { id: 4, name: 'Honda CR-V', name_tr: 'Honda CR-V', year: 2022, features: ['Apple CarPlay', 'All-Wheel Drive', 'Panoramic Sunroof', 'Bluetooth'], features_tr: ['Apple CarPlay', 'Tum Tekerlek Itis', 'Panoramik Acilir Cati', 'Bluetooth'], mileage: '18,900 km', fuelTank: '58L', transmission: 'Automatic', description: 'Spacious and capable. Adventure-ready.', description_tr: 'Genis ve guclu. Macera icin hazir.', image: 'https://images.pexels.com/photos/5980642/pexels-photo-5980642.jpeg' },
  { id: 5, name: 'Volkswagen Golf', name_tr: 'Volkswagen Golf', year: 2023, features: ['Climate Control', 'Keyless Entry', 'Bluetooth', 'Touchscreen'], features_tr: ['Iklim Kontrolu', 'Anahtarsiz Giriş', 'Bluetooth', 'Dokunmatik Ekran'], mileage: '9,750 km', fuelTank: '50L', transmission: 'Automatic', description: 'Modern engineering meets everyday comfort.', description_tr: 'Modern muhendislik gunluk rahatlıkla bulusuyor.', image: 'https://images.pexels.com/photos/1024314/pexels-photo-1024314.jpeg' },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ahmed',
    location: 'Kyrenia',
    rating: 5,
    quote: 'Rented the Yaris for a week. Drove up to Bellapais Abbey, down to the harbour. Handled rough roads perfectly. Staff was helpful when I needed to add an extra day. Would rent again.',
    quote_tr: 'Yaris kiraladi. Bellapais Manastiri ve limana gittim. Depo yolu mükemmel bir şekilde ele aldı. Ekstra bir gün eklemek istediğimde personel yardimci oldu. Tekrar kiralardim.'
  },
  {
    id: 2,
    name: 'Emma',
    location: 'Famagusta',
    rating: 5,
    quote: 'Got the Honda CR-V. Went exploring with friends, hit some dirt roads toward the mountains. Car never had issues. Worth the price for peace of mind.',
    quote_tr: 'Honda CR-V aldim. Arkadaşlarımla keşfe çiktik, dağlara doğru toprak yollara çiktik. Araba asla sorun yaşamadı. Gönül rahatlığı için fiyata değdi.'
  },
  {
    id: 3,
    name: 'Tariq',
    location: 'Nicosia',
    rating: 5,
    quote: 'Needed a car for 3 days. Booked online, picked it up same day. The Fiat 500 was fun, easy to park in the old city. Their WhatsApp support actually replied within minutes. Solid experience.',
    quote_tr: '3 gün için araba lazimdi. Çevrimçi olarak rezervasyon yaptim, aynı gün teslim aldim. Fiat 500 eğlenceli ve eski şehirde park etmesi kolay. WhatsApp desteği dakikalar içinde yanit verdi. Harika bir deneyim.'
  }
];

const BENEFITS = [
  {
    id: 1,
    headline: 'Dependable Fleet',
    headline_tr: 'Güvenilir Filomuz',
    description: 'Premium vehicles, regularly maintained. Drive without worry.',
    description_tr: 'Premium araçlar, düzenli bakım. Endişesiz sürün.',
    icon: 'check-circle'
  },
  {
    id: 2,
    headline: 'Always Available',
    headline_tr: 'Her Zaman Açık',
    description: 'Support when you need it. Via WhatsApp, call, or email.',
    description_tr: 'WhatsApp, telefon veya e-posta ile destek. Gerektiğinde yanınızda.',
    icon: 'phone'
  },
  {
    id: 3,
    headline: 'Premium Comfort',
    headline_tr: 'Premium Konfor',
    description: 'Modern features, smooth rides, all terrain capable.',
    description_tr: 'Modern özellikler, düz sürüş, her arazi yolculuğu.',
    icon: 'car'
  },
  {
    id: 4,
    headline: 'Fair Pricing',
    headline_tr: 'Uygun Fiyatlandırma',
    description: 'Quality without premium markup. Adventure is affordable.',
    description_tr: 'Premium işçilik olmayan kalite. Macera uygun fiyatlı.',
    icon: 'dollar-sign'
  }
];

const TEXT = {
  en: {
    title: 'Start Your Cyprus Story',
    subtitle: 'Discover Cyprus in a car built for the journey',
    story: 'Every journey tells a story',
    confidence: 'Our premium fleet is maintained to the highest standards. Drive with confidence. Explore with freedom.',
    fleet: 'Our Fleet',
    fleetSubtitle: 'Carefully maintained. Ready for your adventure.',
    inquire: 'Inquire Now',
    cta: 'Ready for your Cyprus adventure?',
    ctaSub: 'Contact us today. We will make sure you are in the perfect car.',
    ctaBtn: 'Reserve Your Car Now',
    ctaWhatsApp: 'Message on WhatsApp',
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
    title: 'Kibrisin Hikayenizi Yazin',
    subtitle: 'Kibrisin aracinizla kesfet',
    story: 'Her seyahat bir hikaye',
    confidence: 'Premium arac filomuz en yuksek standartlarda bakımlanır.',
    fleet: 'Arac Filomuz',
    fleetSubtitle: 'Bakımı yapılmış. Maceranıza hazır.',
    inquire: 'Bilgi Al',
    cta: 'Kibris macerası için hazır?',
    ctaSub: 'Bugün bize ulaşın.',
    ctaBtn: 'Şimdi Araba Rezerve Edin',
    ctaWhatsApp: 'WhatsApp\'ta Mesaj Gönder',
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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const t = TEXT[lang];

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

    // Email validation (RFC-compliant)
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation (Cyprus +357XXXXXXXX or international E.164)
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const isCyprus = /^357[0-9]{8}$/.test(cleanPhone);
      const isIntl = /^[1-9]\d{1,14}$/.test(cleanPhone);
      if (!isCyprus && !isIntl) errors.phone = 'Enter valid phone (+357XXXXXXXX or international)';
    }

    // Message length validation
    const MAX_MESSAGE_LENGTH = 500;
    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Message must be under ${MAX_MESSAGE_LENGTH} characters (${formData.message.length}/${MAX_MESSAGE_LENGTH})`;
    }

    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Honeypot detection (bot prevention)
    if (honeypot) {
      // Fake success to fool bot (don't actually submit)
      setFormSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setFormSuccess(false);
      }, 2000);
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          car: selectedCar[lang === 'tr' ? 'name_tr' : 'name'],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setFormErrors({});
        setTimeout(() => {
          setModalOpen(false);
          setFormSuccess(false);
        }, 3000);
      } else {
        setFormError(data.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
  };

  return (
    <>
      <Head>
        <title>Cyprus Road | Premium Car Rental in Cyprus | Affordable & Reliable</title>
        <meta name="description" content="Cyprus Road premium car rental service. Discover Cyprus with our fleet of luxury and economy cars. 24/7 availability, competitive rates, and bilingual support." />
        <meta name="keywords" content="car rental Cyprus, luxury cars Cyprus, economy cars Cyprus, Cyprus Road rental, Paphos car rental, Larnaca car rental" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Cyprus Road Premium Car Rental" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Cyprus Road | Premium Car Rental in Cyprus" />
        <meta property="og:description" content="Premium car rental service in Cyprus with luxury and economy options. Book now for 24/7 service." />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content="https://cy-car-rental.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cyprus Road Premium Car Rental" />
        <link rel="canonical" href="https://cy-car-rental.vercel.app" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Cyprus Road Premium Car Rental",
            "image": "https://cy-car-rental.vercel.app/logo.png",
            "description": "Premium car rental service in Cyprus offering luxury and economy vehicles",
            "url": "https://cy-car-rental.vercel.app",
            "telephone": "+357-XXXXXXX",
            "areaServed": "CY",
            "priceRange": "$$",
            "sameAs": [
              "https://www.google.com/maps",
              "https://www.facebook.com/cyprusroad"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Cyprus",
              "addressCountry": "CY"
            }
          })}
        </script>
      </Head>

      {/* Google Analytics - Replace YOUR_GA_ID with your actual Google Analytics ID */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>

      <div className={styles.container}>
        {/* Language Modal - appears on first load */}
        {langModalOpen && (
          <div className={styles.langModalOverlay}>
            <div className={styles.langModalPopup}>
              <div className={styles.langModalHeader}>
                <svg className={styles.googleLogo} viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                  <text x="30" y="60" fontSize="32" fontWeight="bold" fill="#1f2937">Translate</text>
                </svg>
              </div>
              <h2>{TEXT.en.selectLanguage}</h2>
              <p>{TEXT.en.chooseLanguage}</p>
              <div className={styles.langModalButtons}>
                <button className={styles.langModalBtn} onClick={() => handleSelectLanguage('en')}>
                  English
                </button>
                <button className={styles.langModalBtn} onClick={() => handleSelectLanguage('tr')}>
                  Turkce
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Side Language Switcher - always visible after modal closes */}
        <div className={styles.sideLangSwitcher}>
          <button
            className={`${styles.sideLangBtn} ${lang === 'en' ? styles.active : ''}`}
            onClick={() => setLang('en')}
            title="English"
          >
            EN
          </button>
          <button
            className={`${styles.sideLangBtn} ${lang === 'tr' ? styles.active : ''}`}
            onClick={() => setLang('tr')}
            title="Turkce"
          >
            TR
          </button>
        </div>

        {/* Interactive Hero Section with Mouse Tracking */}
        <InteractiveHero language={lang} />

        {modalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button className={styles.closeBtn} onClick={() => setModalOpen(false)} disabled={formSubmitting}>
                X
              </button>
              <h3>{t.modalTitle}</h3>
              <p>{t.modalText}</p>
              {formSuccess ? (
                <div className={styles.successMessage}>
                  ✓ {lang === 'en' ? 'Your inquiry has been sent successfully!' : 'Sorgunuz başarıyla gönderildi!'}
                </div>
              ) : (
                <>
                  {formError && <div className={styles.errorAlert}>{formError}</div>}
                  <form className={styles.form} onSubmit={handleFormSubmit}>
                    {/* Honeypot field (hidden from users, catches bots) */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        name="name"
                        placeholder={t.name}
                        value={formData.name}
                        onChange={handleFormChange}
                        className={formErrors.name ? styles.inputError : ''}
                      />
                      {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="email"
                        name="email"
                        placeholder={t.email}
                        value={formData.email}
                        onChange={handleFormChange}
                        className={formErrors.email ? styles.inputError : ''}
                      />
                      {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t.phone}
                        value={formData.phone}
                        onChange={handleFormChange}
                        className={formErrors.phone ? styles.inputError : ''}
                      />
                      {formErrors.phone && <span className={styles.errorText}>{formErrors.phone}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <textarea
                        name="message"
                        placeholder={t.message}
                        value={formData.message}
                        onChange={handleFormChange}
                        maxLength={500}
                      ></textarea>
                      <span className={styles.charCounter}>{formData.message.length}/500</span>
                      {formErrors.message && <span className={styles.errorText}>{formErrors.message}</span>}
                    </div>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? (lang === 'en' ? 'Sending...' : 'Gönderiliyor...') : t.send}
                    </button>
                  </form>
                  <button className={styles.whatsappBtn} onClick={handleWhatsApp} disabled={formSubmitting}>
                    {t.whatsapp}
                  </button>
                </>
              )}
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
            <p className={styles.pricingHighlight}>
              {lang === 'en' ? 'Starting from €25/day' : '€25/günden başlayan'}
            </p>
          </div>

          <div className={styles.carsGrid}>
            {CARS.map((car, index) => {
              const carName = lang === 'tr' ? car.name_tr : car.name;
              const carDesc = lang === 'tr' ? car.description_tr : car.description;
              const carFeatures = lang === 'tr' ? car.features_tr : car.features;

              return (
                <div key={car.id} className={styles.carCard} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={styles.carImage}>
                    {imageLoading[car.id] && <div className={styles.skeleton}></div>}
                    <img
                      src={car.image}
                      alt={`${carName} ${car.year} - Cyprus rental car`}
                      className={styles.carImg}
                      onLoad={() => setImageLoading(prev => ({ ...prev, [car.id]: false }))}
                      onError={() => setImageLoading(prev => ({ ...prev, [car.id]: false }))}
                      style={{ display: imageLoading[car.id] ? 'none' : 'block' }}
                    />
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

        <section className={styles.testimonials}>
          <div className={styles.testimonialsHeader}>
            <h2>{lang === 'en' ? 'What Our Guests Say' : 'Konuklarin Yorumlari'}</h2>
          </div>

          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div>
                    <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                    <p className={styles.testimonialLocation}>{testimonial.location}</p>
                  </div>
                  <div className={styles.testimonialRating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className={styles.star}>⭐</span>
                    ))}
                  </div>
                </div>
                <p className={styles.testimonialQuote}>{lang === 'en' ? testimonial.quote : testimonial.quote_tr}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.benefits}>
          <div className={styles.benefitsHeader}>
            <h2>{lang === 'en' ? 'Why Choose Cyprus Road' : 'Neden Cyprus Road'}</h2>
          </div>

          <div className={styles.benefitsGrid}>
            {/* Benefit 1 */}
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>✓</div>
              <h3 className={styles.benefitHeadline}>{lang === 'en' ? 'Dependable Fleet' : 'Güvenilir Filomuz'}</h3>
              <p className={styles.benefitDescription}>{lang === 'en' ? 'Premium vehicles, regularly maintained. Drive without worry.' : 'Premium araçlar, düzenli bakım. Endişesiz sürün.'}</p>
            </div>

            {/* Benefit 2 */}
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>📞</div>
              <h3 className={styles.benefitHeadline}>{lang === 'en' ? 'Always Available' : 'Her Zaman Açık'}</h3>
              <p className={styles.benefitDescription}>{lang === 'en' ? 'Support when you need it. Via WhatsApp, call, or email.' : 'WhatsApp, telefon veya e-posta ile destek. Gerektiğinde yanınızda.'}</p>
            </div>

            {/* Benefit 3 */}
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🚗</div>
              <h3 className={styles.benefitHeadline}>{lang === 'en' ? 'Premium Comfort' : 'Premium Konfor'}</h3>
              <p className={styles.benefitDescription}>{lang === 'en' ? 'Modern features, smooth rides, all terrain capable.' : 'Modern özellikler, düz sürüş, her arazi yolculuğu.'}</p>
            </div>

            {/* Benefit 4 */}
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>💰</div>
              <h3 className={styles.benefitHeadline}>{lang === 'en' ? 'Fair Pricing' : 'Uygun Fiyatlandırma'}</h3>
              <p className={styles.benefitDescription}>{lang === 'en' ? 'Quality without premium markup. Adventure is affordable.' : 'Premium işçilik olmayan kalite. Macera uygun fiyatlı.'}</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>{t.cta}</h2>
          <p>{t.ctaSub}</p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaButton} onClick={() => setModalOpen(true)}>
              {t.ctaBtn}
            </button>
            <button className={styles.ctaButtonSecondary} onClick={() => {
              const message = lang === 'en' ? 'Hi, I am interested in renting a car' : 'Merhaba, araba kiralamak istiyorum';
              window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
            }}>
              {t.ctaWhatsApp}
            </button>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>{t.footer}</p>
          <p>{t.footerDetails}</p>
          <p className={styles.footerContact}>
            {lang === 'en' ? 'Call: ' : 'Ara: '}
            <a href={`tel:${WHATSAPP_NUMBER}`} className={styles.phoneLink}>{WHATSAPP_NUMBER}</a>
          </p>
        </footer>
      </div>
    </>
  );
}

// Force dynamic rendering (disable static export) so lang-based translations work
export const getServerSideProps = async () => ({
  props: {},
});
