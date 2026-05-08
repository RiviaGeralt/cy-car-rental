import Head from 'next/head';
import styles from '../styles/Home.module.css';

const CARS = [
  {
    id: 1,
    name: 'Fiat 500',
    year: 2023,
    features: ['Bluetooth Audio', 'USB Charging', 'Air Conditioning'],
    mileage: '12,450 km',
    fuelTank: '40L',
    transmission: 'Automatic',
    description: 'Compact and nimble. Perfect for exploring narrow streets.',
  },
  {
    id: 2,
    name: 'Toyota Yaris',
    year: 2023,
    features: ['Bluetooth Connectivity', 'Cruise Control', 'Rear Camera'],
    mileage: '8,200 km',
    fuelTank: '45L',
    transmission: 'Manual',
    description: 'Reliable and fuel-efficient. Smooth ride on all terrain.',
  },
  {
    id: 3,
    name: 'Mercedes C-Class',
    year: 2023,
    features: ['Premium Audio', 'Navigation System', 'Leather Seats', 'Sunroof'],
    mileage: '5,100 km',
    fuelTank: '66L',
    transmission: 'Automatic',
    description: 'Luxury and comfort. Experience Cyprus in style.',
  },
  {
    id: 4,
    name: 'Honda CR-V',
    year: 2022,
    features: ['Apple CarPlay', 'All-Wheel Drive', 'Panoramic Sunroof', 'Bluetooth'],
    mileage: '18,900 km',
    fuelTank: '58L',
    transmission: 'Automatic',
    description: 'Spacious and capable. Adventure-ready.',
  },
  {
    id: 5,
    name: 'Volkswagen Golf',
    year: 2023,
    features: ['Climate Control', 'Keyless Entry', 'Bluetooth', 'Touchscreen'],
    mileage: '9,750 km',
    fuelTank: '50L',
    transmission: 'Automatic',
    description: 'Modern engineering meets everyday comfort.',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Cyprus Car Rental | Premium Fleet</title>
        <meta name="description" content="Discover your perfect Cyprus adventure with our premium car rental fleet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Cyprus Road</h1>
            <p className={styles.subtitle}>Discover Cyprus in a car built for the journey</p>
          </div>
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h2>Every journey tells a story</h2>
            <p>Our premium fleet is maintained to the highest standards. Drive with confidence. Explore with freedom.</p>
          </div>
        </section>

        {/* Fleet Section */}
        <section className={styles.fleet}>
          <div className={styles.fleetHeader}>
            <h2>Our Fleet</h2>
            <p>Carefully maintained. Ready for your adventure.</p>
          </div>

          <div className={styles.carsGrid}>
            {CARS.map((car, index) => (
              <div key={car.id} className={styles.carCard} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={styles.carIndex}>{String(car.id).padStart(2, '0')}</div>
                
                <div className={styles.carHeader}>
                  <h3 className={styles.carName}>{car.name}</h3>
                  <p className={styles.carYear}>{car.year}</p>
                </div>

                <p className={styles.carDescription}>{car.description}</p>

                <div className={styles.specs}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Mileage</span>
                    <span className={styles.specValue}>{car.mileage}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Fuel Tank</span>
                    <span className={styles.specValue}>{car.fuelTank}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Transmission</span>
                    <span className={styles.specValue}>{car.transmission}</span>
                  </div>
                </div>

                <div className={styles.features}>
                  {car.features.map((feature, idx) => (
                    <span key={idx} className={styles.feature}>
                      ✓ {feature}
                    </span>
                  ))}
                </div>

                <button className={styles.inquireBtn}>Inquire Now</button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <h2>Ready for your Cyprus adventure?</h2>
          <p>Contact us today. We'll make sure you're in the perfect car.</p>
          <button className={styles.ctaButton}>Get in Touch</button>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Cyprus Road Premium Car Rental</p>
          <p>📍 Across Cyprus | 📞 Available 24/7 | 🗺️ Find us on Google Maps</p>
        </footer>
      </div>
    </>
  );
}
