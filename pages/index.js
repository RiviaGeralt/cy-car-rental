import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const CARS = [
  { id: 1, name: 'Fiat 500', name_tr: 'Fiat 500', year: 2023, features: ['Bluetooth Audio', 'USB Charging', 'Air Conditioning'], features_tr: ['Bluetooth Ses', 'USB Şarj', 'Klima'], mileage: '12,450 km', fuelTank: '40L', transmission: 'Automatic', description: 'Compact and nimble. Perfect for exploring narrow streets.', description_tr: 'Kompakt ve çevik. Dar sokakları keşfetmek için mükemmel.', image: 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=400&fit=crop' },
  { id: 2, name: 'Toyota Yaris', name_tr: 'Toyota Yaris', year: 2023, features: ['Bluetooth Connectivity', 'Cruise Control', 'Rear Camera'], features_tr: ['Bluetooth Bağlantı', 'Hız Sabitleyici', 'Arka Kamera'], mileage: '8,200 km', fuelTank: '45L', transmission: 'Manual', description: 'Reliable and fuel-efficient. Smooth ride on all terrain.', description_tr: 'Güvenilir ve yakıt tasarruflu. Tüm arazi türlerinde düzgün sürüş.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop' },
];
