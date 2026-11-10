import roomImg from '../../assets/images/hotel-room.png'

// Sample data. Replace with your API. Prices are per night in INR.
// Every hotel uses the same photo for now; give each its own `images` array later.
const gallery = (name) => [
  { src: roomImg, caption: `${name}: deluxe room`, pos: 'center' },
  { src: roomImg, caption: 'Bed and headboard', pos: '70% 50%' },
  { src: roomImg, caption: 'Seating area', pos: '10% 60%' },
  { src: roomImg, caption: 'Ceiling and lighting', pos: '50% 0%' },
]

const hotels = [
  {
    id: 'srinivasam-residency', name: 'Srinivasam Residency', area: 'Tirupati', distanceKm: 1,
    landmark: 'Near Tirupati railway station', price: 2400, rating: 4.3, reviews: 812,
    amenities: ['Free Wi-Fi', 'AC rooms', 'Restaurant', 'Lift', 'Parking', '24h check-in'],
    about: 'A short walk from the railway station and bus stand. Good for pilgrims arriving or leaving late.',
    rooms: [
      { id: 'std', name: 'Standard double', beds: '1 double bed', max: 2, price: 2400, left: 5 },
      { id: 'dlx', name: 'Deluxe double', beds: '1 king bed', max: 3, price: 3200, left: 2 },
      { id: 'fam', name: 'Family room', beds: '2 double beds', max: 4, price: 4300, left: 0 },
    ],
  },
  {
    id: 'alipiri-comfort-inn', name: 'Alipiri Comfort Inn', area: 'Alipiri', distanceKm: 4,
    landmark: 'Next to the Alipiri footpath', price: 1500, rating: 4.0, reviews: 436,
    amenities: ['Free Wi-Fi', 'AC rooms', 'Hot water', 'Parking', 'Luggage storage'],
    about: 'Start the Alipiri steps from the front door. Simple, clean rooms for early-morning walkers.',
    rooms: [
      { id: 'std', name: 'Standard double', beds: '1 double bed', max: 2, price: 1500, left: 8 },
      { id: 'tri', name: 'Triple room', beds: '3 single beds', max: 3, price: 2100, left: 3 },
    ],
  },
  {
    id: 'padmavathi-grand', name: 'Padmavathi Grand', area: 'Tiruchanoor', distanceKm: 6,
    landmark: '1 km from Padmavathi Temple', price: 3800, rating: 4.6, reviews: 1204,
    amenities: ['Free Wi-Fi', 'AC rooms', 'Restaurant', 'Pool', 'Lift', 'Parking', 'Airport pickup'],
    about: 'A full-service hotel close to Sri Padmavathi Temple, with a pure vegetarian restaurant.',
    rooms: [
      { id: 'dlx', name: 'Deluxe king', beds: '1 king bed', max: 2, price: 3800, left: 4 },
      { id: 'exe', name: 'Executive suite', beds: '1 king bed + sofa bed', max: 3, price: 5600, left: 1 },
      { id: 'fam', name: 'Family suite', beds: '2 queen beds', max: 4, price: 6400, left: 2 },
    ],
  },
  {
    id: 'tirumala-vista', name: 'Tirumala Vista Lodge', area: 'Tirumala', distanceKm: 22,
    landmark: '1.5 km from the main temple', price: 2900, rating: 3.9, reviews: 298,
    amenities: ['Hot water', 'AC rooms', 'Lift', 'Hill view'],
    about: 'Stay on the hill and skip the ghat road before darshan. Book early; rooms fill fast.',
    rooms: [
      { id: 'std', name: 'Standard double', beds: '1 double bed', max: 2, price: 2900, left: 3 },
      { id: 'dlx', name: 'Hill-view double', beds: '1 king bed', max: 3, price: 3600, left: 1 },
    ],
  },
  {
    id: 'kapila-heritage', name: 'Kapila Heritage Stay', area: 'Tirupati', distanceKm: 5,
    landmark: 'Near Kapila Theertham', price: 5200, rating: 4.7, reviews: 689,
    amenities: ['Free Wi-Fi', 'AC rooms', 'Restaurant', 'Pool', 'Spa', 'Lift', 'Parking', 'Airport pickup'],
    about: 'Our most comfortable option in Tirupati, with carved wood details and a quiet garden.',
    rooms: [
      { id: 'dlx', name: 'Deluxe king', beds: '1 king bed', max: 2, price: 5200, left: 6 },
      { id: 'sui', name: 'Heritage suite', beds: '1 king bed + lounge', max: 3, price: 8400, left: 2 },
    ],
  },
  {
    id: 'yatri-budget-rooms', name: 'Yatri Budget Rooms', area: 'Tirupati', distanceKm: 2,
    landmark: 'Opposite the bus stand', price: 800, rating: 3.5, reviews: 1530,
    amenities: ['Hot water', 'Fan rooms', 'Luggage storage', '24h check-in'],
    about: 'No-frills rooms for a quick overnight stop. Best for solo travellers and groups on a budget.',
    rooms: [
      { id: 'fan', name: 'Fan double', beds: '1 double bed', max: 2, price: 800, left: 10 },
      { id: 'ac', name: 'AC double', beds: '1 double bed', max: 2, price: 1100, left: 4 },
    ],
  },
].map((h) => ({ ...h, images: gallery(h.name) }))

export const areas = ['Tirupati', 'Alipiri', 'Tiruchanoor', 'Tirumala']
export const getHotel = (id) => hotels.find((h) => h.id === id)
export const inr = (n) => '₹' + n.toLocaleString('en-IN')
export default hotels