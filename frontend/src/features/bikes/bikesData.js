import scooterImg from '../../assets/images/bike-scooter.png'

// Sample data. Replace with your API. Prices in INR.
// Every bike uses the same scooter photo for now; give each its own `img` later.
export const types = ['Scooter', 'Commuter', 'Sports', 'Cruiser', 'Electric']

export const shops = [
  'Tirupati railway station shop',
  'Tirupati bus stand shop',
  'Alipiri shop',
  'Tirumala shop',
  'Delivery to your hotel',
]
export const DELIVERY_FEE = 100
export const DELIVERY = 'Delivery to your hotel'
export const MIN_HOURS = 4
export const DURATIONS = [4, 6, 8, 10, 12]
export const RENTAL_GST = 0.18 // approximate; set from your rules

const bikes = [
  { id: 'honda-activa', name: 'Honda Activa 6G', type: 'Scooter', cc: '110 cc', mileage: '45 km/l', fuel: 'Petrol', gear: 'Automatic',
    hour: 60, day: 450, left: 8, about: 'Light, easy to ride and easy to park. The default choice for first-time renters.' },
  { id: 'tvs-ntorq', name: 'TVS NTorq 125', type: 'Scooter', cc: '125 cc', mileage: '40 km/l', fuel: 'Petrol', gear: 'Automatic',
    hour: 80, day: 600, left: 4, about: 'Quicker off the line, with enough pull for the Tirumala ghat road with a pillion.' },
  { id: 'suzuki-access', name: 'Suzuki Access 125', type: 'Scooter', cc: '125 cc', mileage: '48 km/l', fuel: 'Petrol', gear: 'Automatic',
    hour: 70, day: 550, left: 5, about: 'Smooth and comfortable, with a large under-seat boot for your bags.' },
  { id: 'hero-splendor', name: 'Hero Splendor Plus', type: 'Commuter', cc: '100 cc', mileage: '65 km/l', fuel: 'Petrol', gear: 'Manual',
    hour: 50, day: 400, left: 6, about: 'The most fuel-efficient option. Best for long days of temple hopping on a budget.' },
  { id: 'bajaj-pulsar', name: 'Bajaj Pulsar 150', type: 'Sports', cc: '150 cc', mileage: '48 km/l', fuel: 'Petrol', gear: 'Manual',
    hour: 90, day: 700, left: 3, about: 'Strong on climbs and stable at highway speed. Manual gears; riders should be confident.' },
  { id: 'royal-enfield', name: 'Royal Enfield Classic 350', type: 'Cruiser', cc: '350 cc', mileage: '35 km/l', fuel: 'Petrol', gear: 'Manual',
    hour: 150, day: 1200, left: 2, about: 'A relaxed ride for longer trips such as Srikalahasti. Heavy, so best for experienced riders.' },
  { id: 'ather-450', name: 'Ather 450X', type: 'Electric', cc: 'Electric', mileage: 'About 100 km per charge', fuel: 'Electric', gear: 'Automatic',
    hour: 90, day: 650, left: 2, about: 'Quiet and quick. Charge at any of our shops before you head up the hill.' },
].map((b) => ({ ...b, img: scooterImg, kmDay: 150, kmHour: 10, extraKm: b.type === 'Cruiser' ? 6 : 4,
  deposit: { Scooter: 1000, Commuter: 1000, Sports: 2000, Cruiser: 3000, Electric: 2000 }[b.type] }))

// Hourly rentals cost less than a full day; never charge more than the day rate.
export const unitPrice = (b, mode, units) => mode === 'hour' ? Math.min(b.hour * units, b.day) : b.day * units

export const getBike = (id) => bikes.find((b) => b.id === id)
export const inr = (n) => '₹' + n.toLocaleString('en-IN')
export default bikes