import fleetImg from '../../assets/images/car-fleet.png'

// Sample data. Replace with your API. Prices are per day in INR.
// One fleet photo is cropped per vehicle with `pos` (focus point) and `zoom`.
// Give each car its own photo later and drop pos/zoom.
export const types = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Tempo Traveller']

export const pickupPoints = [
  'Tirupati railway station',
  'Tirupati bus stand',
  'Tirupati airport (Renigunta)',
  'Alipiri, near the footpath',
  'Tirumala bus stand',
  'Your hotel or address',
]

export const DROP_FEE = 500 // when drop point differs from pickup
export const RENTAL_GST = { self: 0.18, driver: 0.05 } // approximate; set from your rules
export const DRIVER_NIGHT_ALLOWANCE = 300 // per night, if the trip is overnight

const crop = { // focus points on the shared fleet photo
  muv: { pos: '12% 78%', zoom: 2.2 },
  suv: { pos: '30% 62%', zoom: 1.8 },
  sedan: { pos: '62% 58%', zoom: 2.2 },
  van: { pos: '88% 50%', zoom: 2.6 },
}

const cars = [
  { id: 'swift-dzire', name: 'Maruti Dzire', type: 'Sedan', seats: 4, bags: 2, fuel: 'Petrol', gear: 'Manual',
    price: { self: 1800, driver: 2600 }, left: 4, ...crop.sedan,
    about: 'Easy to drive and park. Good for two to four people on temple circuits.' },
  { id: 'hyundai-i10', name: 'Hyundai Grand i10', type: 'Hatchback', seats: 4, bags: 1, fuel: 'Petrol', gear: 'Manual',
    price: { self: 1400, driver: 2200 }, left: 3, ...crop.sedan,
    about: 'The cheapest way to get around Tirupati. Light on luggage space.' },
  { id: 'toyota-innova', name: 'Toyota Innova Crysta', type: 'MUV', seats: 7, bags: 3, fuel: 'Diesel', gear: 'Manual',
    price: { self: 3600, driver: 4200 }, left: 2, ...crop.muv,
    about: 'Roomy and steady on the ghat road. The usual pick for families of five or more.' },
  { id: 'toyota-fortuner', name: 'Toyota Fortuner', type: 'SUV', seats: 6, bags: 3, fuel: 'Diesel', gear: 'Automatic',
    price: { self: 5200, driver: 6200 }, left: 1, ...crop.suv,
    about: 'High seating and strong pull for the Tirumala climb, with room for the whole group.' },
  { id: 'mahindra-xuv', name: 'Mahindra XUV300', type: 'SUV', seats: 5, bags: 2, fuel: 'Diesel', gear: 'Manual',
    price: { self: 2800, driver: 3600 }, left: 3, ...crop.suv,
    about: 'Compact SUV with good ground clearance and a smooth ride.' },
  { id: 'honda-city', name: 'Honda City', type: 'Sedan', seats: 4, bags: 2, fuel: 'Petrol', gear: 'Automatic',
    price: { self: 2800, driver: 3600 }, left: 2, ...crop.sedan,
    about: 'A comfortable automatic for longer drives, such as Srikalahasti and back.' },
  { id: 'tempo-traveller', name: 'Tempo Traveller (12 seater)', type: 'Tempo Traveller', seats: 12, bags: 6, fuel: 'Diesel', gear: 'Manual',
    price: { self: null, driver: 7800 }, left: 2, ...crop.van,
    about: 'For large groups and temple tours. Comes with a driver only.' },
].map((c) => ({ ...c, img: fleetImg, kmSelf: 300, kmDriver: 250, extraKm: c.type === 'Tempo Traveller' ? 20 : 12,
  deposit: c.price.self ? (c.price.self > 3000 ? 10000 : 5000) : 0 }))

export const getCar = (id) => cars.find((c) => c.id === id)
export const inr = (n) => '₹' + n.toLocaleString('en-IN')
export default cars