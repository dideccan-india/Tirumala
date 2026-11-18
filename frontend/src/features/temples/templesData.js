import gopuramImg from '../../assets/images/temple-gopuram.png'

// SAMPLE DATA. Distances, travel times, timings and fees are approximate.
// Confirm each one (TTD: tirumala.org) before publishing, or load them from your API.
// Every place uses the same photo for now; give each its own `images` array later.
export const categories = ['Tirumala', 'Tirupati temples', 'Sightseeing']

const crops = (name) => [
  { caption: name, pos: '50% 50%', zoom: 1 },
  { caption: 'Gopuram', pos: '50% 30%', zoom: 2.2 },
  { caption: 'Entrance and mural', pos: '50% 82%', zoom: 2.2 },
  { caption: 'Temple courtyard', pos: '30% 95%', zoom: 1.8 },
]

const defaultDress = 'Modest clothing. Shoulders and knees covered.'
const tirumalaDress = 'Traditional dress is required: saree or half-saree, salwar with dupatta, dhoti or kurta pyjama. Jeans and shorts are not allowed.'

const places = [
  { id: 'tirumala-venkateswara', name: 'Sri Venkateswara Temple, Tirumala', category: 'Tirumala', distanceKm: 22, travelMins: 60,
    timings: [['Darshan', 'Open most of the day and night, from early morning'], ['Daily rituals', 'Suprabhatam before dawn; Ekanta Seva late at night']],
    entry: 'Free (Sarva Darshan). Special Entry Darshan tickets are booked on the official TTD site.', dress: tirumalaDress,
    bestTime: 'Weekdays outside festival periods. Weekends and school holidays are very crowded.', visitTime: '4 to 8 hours, depending on the queue',
    mapQuery: 'Sri Venkateswara Swamy Temple Tirumala',
    about: 'The hill shrine of Lord Venkateswara is the main reason pilgrims come to Tirupati. The temple sits on the seventh hill, Venkatadri, and is one of the most visited places of worship in the world.',
    highlights: ['Main sanctum with the Venkateswara idol', 'Swami Pushkarini temple tank', 'Laddu prasadam counters'],
    tips: ['Phones, cameras and bags are not allowed inside. Use the cloakrooms at the entrance.', 'Carry a photo ID. It is needed for darshan tickets.', 'Wear comfortable footwear. You queue and walk for a long time.'] },
  { id: 'varahaswamy-tirumala', name: 'Sri Varahaswamy Temple', category: 'Tirumala', distanceKm: 22, travelMins: 60,
    timings: [['Daily', 'Early morning to late evening (approximate)']], entry: 'Free', dress: tirumalaDress,
    bestTime: 'Early morning, before you join the main darshan queue.', visitTime: '30 minutes', mapQuery: 'Sri Varahaswamy Temple Tirumala',
    about: 'Located beside the Swami Pushkarini tank, this temple is dedicated to Lord Varaha. Tradition says pilgrims should visit it before the main temple.',
    highlights: ['Beside the Pushkarini tank', 'Quiet, short queue'], tips: ['Visit here first, then go to the main temple.'] },
  { id: 'silathoranam', name: 'Silathoranam (natural rock arch)', category: 'Tirumala', distanceKm: 23, travelMins: 65,
    timings: [['Daily', 'Daylight hours']], entry: 'Free', dress: defaultDress,
    bestTime: 'Morning, when the light is good for photos.', visitTime: '30 to 45 minutes', mapQuery: 'Silathoranam Tirumala',
    about: 'A rare natural arch of rock, formed millions of years ago. It is a short drive from the main temple and is a popular quick stop.',
    highlights: ['Natural arch formation', 'Photo spot'], tips: ['Combine with Akasa Ganga on the same trip.'] },
  { id: 'akasa-ganga', name: 'Akasa Ganga waterfall', category: 'Tirumala', distanceKm: 25, travelMins: 75,
    timings: [['Daily', 'Daylight hours']], entry: 'Free', dress: defaultDress,
    bestTime: 'After the monsoon, when the water flow is strong.', visitTime: '30 minutes', mapQuery: 'Akasa Ganga Tirumala',
    about: 'A sacred waterfall in the hills near Tirumala. Water from here is used for the daily bathing of the main idol.',
    highlights: ['Sacred waterfall', 'Forest setting'], tips: ['Roads are narrow. Take a taxi or drive carefully.'] },

  { id: 'govindaraja-swamy', name: 'Sri Govindaraja Swamy Temple', category: 'Tirupati temples', distanceKm: 1, travelMins: 8,
    timings: [['Morning', 'Early morning to around noon (approximate)'], ['Evening', 'Afternoon to night (approximate)']], entry: 'Free', dress: defaultDress,
    bestTime: 'Evenings, when the gopuram is lit.', visitTime: '1 hour', mapQuery: 'Sri Govindaraja Swamy Temple Tirupati',
    about: 'A large temple in the middle of Tirupati town, dedicated to Lord Govindaraja. It is easy to reach on foot from the railway station and bus stand, so many pilgrims visit on arrival day.',
    highlights: ['Tall seven-tier gopuram', 'Walking distance from the town centre'], tips: ['Good first stop if you arrive early and your room is not ready.'] },
  { id: 'kodandarama-swamy', name: 'Sri Kodandarama Swamy Temple', category: 'Tirupati temples', distanceKm: 2, travelMins: 10,
    timings: [['Daily', 'Morning to evening (approximate)']], entry: 'Free', dress: defaultDress,
    bestTime: 'Any time. Quiet on weekdays.', visitTime: '45 minutes', mapQuery: 'Sri Kodandarama Swamy Temple Tirupati',
    about: 'A Rama temple near the railway station with a carved entrance and a calm courtyard.',
    highlights: ['Rama, Sita and Lakshmana idols', 'Short walk from the station'], tips: ['Pair it with the Govindaraja Swamy Temple.'] },
  { id: 'kapila-theertham', name: 'Kapila Theertham', category: 'Tirupati temples', distanceKm: 4, travelMins: 15,
    timings: [['Daily', 'Early morning to evening (approximate)']], entry: 'Free', dress: defaultDress,
    bestTime: 'Monsoon and winter, when the waterfall runs.', visitTime: '1 hour', mapQuery: 'Kapila Theertham Tirupati',
    about: 'A Shiva temple at the foot of the Tirumala hills, with a waterfall that falls into a sacred pond.',
    highlights: ['Waterfall and pond', 'Shiva temple at the foot of the hills'], tips: ['Rocks near the pond are slippery. Wear shoes with grip.'] },
  { id: 'padmavathi-tiruchanoor', name: 'Sri Padmavathi Temple, Tiruchanoor', category: 'Tirupati temples', distanceKm: 5, travelMins: 20,
    timings: [['Daily', 'Early morning to night (approximate)']], entry: 'Free', dress: defaultDress,
    bestTime: 'Fridays are special but crowded. Weekdays are calmer.', visitTime: '1 to 2 hours', mapQuery: 'Sri Padmavathi Ammavari Temple Tiruchanoor',
    about: 'The temple of Goddess Padmavathi, consort of Lord Venkateswara. Many pilgrims visit it before going up to Tirumala.',
    highlights: ['Padmavathi shrine', 'Temple pond (Padma Sarovaram)'], tips: ['Tradition says to visit here before Tirumala.'] },
  { id: 'srinivasa-mangapuram', name: 'Sri Kalyana Venkateswara Temple, Srinivasa Mangapuram', category: 'Tirupati temples', distanceKm: 12, travelMins: 30,
    timings: [['Daily', 'Morning to evening (approximate)']], entry: 'Free', dress: defaultDress,
    bestTime: 'Morning. Much quieter than Tirumala.', visitTime: '1 hour', mapQuery: 'Srinivasa Mangapuram Temple',
    about: 'Lord Venkateswara is worshipped here in his wedding form. The temple is peaceful and far less crowded than Tirumala.',
    highlights: ['Wedding-form idol', 'Quiet, short queues'], tips: ['Good option on a busy weekend.'] },
  { id: 'srikalahasti', name: 'Sri Kalahasteeswara Temple, Srikalahasti', category: 'Tirupati temples', distanceKm: 36, travelMins: 55,
    timings: [['Daily', 'Early morning to night (approximate)']], entry: 'Free. Rahu-Ketu pooja tickets are sold at the temple counter.', dress: defaultDress,
    bestTime: 'Morning. Allow extra time for the pooja queue.', visitTime: '2 to 3 hours', mapQuery: 'Sri Kalahasteeswara Swamy Temple Srikalahasti',
    about: 'A famous Shiva temple on the banks of the Swarnamukhi river, known for its Vayu linga and for Rahu-Ketu poojas. It is an easy half-day trip from Tirupati.',
    highlights: ['Vayu linga', 'Rahu-Ketu pooja', 'Riverside setting'], tips: ['Book a car with a driver for the round trip.'] },

  { id: 'chandragiri-fort', name: 'Chandragiri Fort', category: 'Sightseeing', distanceKm: 14, travelMins: 30,
    timings: [['Daily', 'Daytime (approximate)']], entry: 'Ticket at the gate', dress: defaultDress,
    bestTime: 'Late afternoon for cooler weather and softer light.', visitTime: '1 to 2 hours', mapQuery: 'Chandragiri Fort',
    about: 'A hill fort of the Vijayanagara period with palaces, towers and a small museum. It is a good break from temple visits.',
    highlights: ['Raja Mahal and Rani Mahal', 'Fort walls and viewpoints', 'Small museum'], tips: ['Carry water. There is little shade.'] },
  { id: 'sv-zoo-park', name: 'Sri Venkateswara Zoological Park', category: 'Sightseeing', distanceKm: 8, travelMins: 25,
    timings: [['Daily', 'Daytime. Check the weekly closing day before you go.']], entry: 'Ticket at the gate', dress: defaultDress,
    bestTime: 'Morning, when the animals are most active.', visitTime: '3 to 4 hours', mapQuery: 'Sri Venkateswara Zoological Park Tirupati',
    about: 'A large zoo in the forest near the Tirumala foothills, with a safari option. A good stop for families with children.',
    highlights: ['Lion and deer safari', 'Large forest campus'], tips: ['Plan around the heat. Mornings are best.'] },
  { id: 'talakona', name: 'Talakona waterfalls', category: 'Sightseeing', distanceKm: 58, travelMins: 100,
    timings: [['Daily', 'Daytime. Check forest department notices for closures.']], entry: 'Forest entry ticket at the gate', dress: defaultDress,
    bestTime: 'After the monsoon, from late autumn to winter.', visitTime: 'Full day', mapQuery: 'Talakona Waterfalls',
    about: 'The highest waterfall in Andhra Pradesh, inside the Sri Venkateswara National Park. A full-day trip with a short forest walk.',
    highlights: ['Tall waterfall', 'Forest trail', 'Cool weather'], tips: ['Start early.', 'Roads can be closed in heavy rain.', 'Carry food and water.'] },
].map((p) => ({ ...p, images: crops(p.name), img: gopuramImg }))

export const getPlace = (id) => places.find((p) => p.id === id)
export const directionsUrl = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`
export default places