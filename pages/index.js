import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const CARS = [
  { id: 1, name: 'Fiat 500', name_tr: 'Fiat 500', year: 2023, features: ['Bluetooth Audio', 'USB Charging', 'Air Conditioning'], features_tr: ['Bluetooth Ses', 'USB Şarj', 'Klima'], mileage: '12,450 km', fuelTank: '40L', transmission: 'Automatic', description: 'Compact and nimble.', description_tr: 'Kompakt ve çevik.', image: 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500' },
  { id: 2, name: 'Toyota Yaris', name_tr: 'Toyota Yaris', year: 2023, features: ['Connectivity', 'Cruise', 'Camera'], features_tr: ['Bağlantı', 'Hız', 'Kamera'], mileage: '8200km', fuelTank: '45L', transmission: 'Manual', description: 'Reliable and fuel-efficient.', description_tr: 'Güvenilir ve yakıt.', image: 'https://images.unsplash.com/photo-1558618666' },
];
const TEXT = {en: {title: 'Cyprus Road', modalTitle: 'Interested?'}, tr: {title: 'Kıbrıs Yolu', modalTitle: 'İlgi duyuyor?'}};
export default function Home() {
  const [lang, setLang] = useState('en');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const t = TEXT[lang];
  const handleInquire = (car) => { setSelectedCar(car); setModalOpen(true); };
  const handleWhatsApp = () => { const msg = `Hi, interested in ${selectedCar[lang === 'tr' ? 'name_tr' : 'name']}`; window.open(`https://wa.me/1234567890?text=${encodeURIComponent(msg)}`); };
  return (<><div><button onClick={() => setLang('en')}>EN</button><button onClick={() => setLang('tr')}>TR</button></div>{modalOpen && (<div><button onClick={() => setModalOpen(false)}>Close</button><p>{t.modalTitle}</p><button onClick={handleWhatsApp}>WhatsApp</button></div>)}<h1>{t.title}</h1><div>{CARS.map(car => (<div key={car.id} onClick={() => handleInquire(car)}><h3>{lang === 'tr' ? car.name_tr : car.name}</h3><p>{lang === 'tr' ? car.description_tr : car.description}</p><button>Inquire</button></div>))}</div></>);
}