export default function Home() {
  const cars = [
    { name: 'Fiat 500', year: 2023, features: 'Bluetooth, AC, USB' },
    { name: 'Toyota Yaris', year: 2023, features: 'Bluetooth, Cruise Control' },
    { name: 'Mercedes C-Class', year: 2023, features: 'Premium Audio, Navigation' },
  ];

  return (
    <div style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: 'white' }}>
      <h1>Cyprus Car Rental</h1>
      <p>Premium Fleet Showcase</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
        {cars.map((car, i) => (
          <div key={i} style={{ background: 'white', color: '#333', padding: '20px', borderRadius: '10px' }}>
            <h3>{car.name}</h3>
            <p>Year: {car.year}</p>
            <p>Features: {car.features}</p>
            <button style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              Inquire Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
