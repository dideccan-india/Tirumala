import places from '../temples/templesData'

// Coordinates are APPROXIMATE and only used for distance and time estimates.
// The map itself searches by place name (`query`), so pins stay correct.
export const hubs = [
  { id: 'tirupati-station', name: 'Tirupati railway station', query: 'Tirupati Railway Station', lat: 13.6288, lng: 79.4192 },
  { id: 'tirupati-bus-stand', name: 'Tirupati bus stand', query: 'Tirupati Central Bus Station', lat: 13.6262, lng: 79.4185 },
  { id: 'tirupati-airport', name: 'Tirupati airport (Renigunta)', query: 'Tirupati Airport Renigunta', lat: 13.6325, lng: 79.5433 },
  { id: 'alipiri', name: 'Alipiri footpath', query: 'Alipiri Footpath Tirupati', lat: 13.6451, lng: 79.4097 },
  { id: 'tirumala-bus-stand', name: 'Tirumala bus stand', query: 'Tirumala Bus Stand', lat: 13.6823, lng: 79.35, hill: true },
]

const templeCoords = {
  'tirumala-venkateswara': [13.6833, 79.3472, true],
  'varahaswamy-tirumala': [13.6841, 79.3478, true],
  'silathoranam': [13.679, 79.356, true],
  'akasa-ganga': [13.658, 79.356, true],
  'govindaraja-swamy': [13.6299, 79.4225],
  'kodandarama-swamy': [13.6255, 79.4175],
  'kapila-theertham': [13.6497, 79.417],
  'padmavathi-tiruchanoor': [13.6066, 79.4572],
  'srinivasa-mangapuram': [13.5995, 79.3784],
  'srikalahasti': [13.7499, 79.6982],
  'chandragiri-fort': [13.5841, 79.3188],
  'sv-zoo-park': [13.6481, 79.3731],
  'talakona': [13.8006, 79.2352],
}

export const placePoints = places
  .filter((p) => templeCoords[p.id])
  .map((p) => {
    const [lat, lng, hill] = templeCoords[p.id]
    return { id: p.id, name: p.name, query: p.mapQuery, lat, lng, hill: !!hill, category: p.category,
      knownKm: p.distanceKm, knownMins: p.travelMins }
  })

export const allPoints = [...hubs, ...placePoints]
export const getPoint = (id) => allPoints.find((p) => p.id === id)

// Hotel areas, used to list hotels near a point.
export const areaCoords = {
  Tirupati: [13.6288, 79.4192],
  Alipiri: [13.6451, 79.4097],
  Tiruchanoor: [13.6066, 79.4572],
  Tirumala: [13.6833, 79.3472],
}

export const nearbyTypes = [
  { label: 'Hotels', q: 'hotels' },
  { label: 'Restaurants', q: 'vegetarian restaurants' },
  { label: 'Hospitals', q: 'hospitals' },
  { label: 'Petrol pumps', q: 'petrol pumps' },
  { label: 'ATMs', q: 'ATMs' },
  { label: 'Pharmacies', q: 'pharmacies' },
  { label: 'Parking', q: 'parking' },
]

export const haversineKm = (a, b) => {
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(x))
}

const round5 = (m) => Math.max(5, Math.round(m / 5) * 5)

// Estimate road distance and time. Uses our temples list when one end is the
// Tirupati railway station, otherwise a straight-line distance times a road factor.
export function estimate(a, b) {
  if (!a || !b || a.id === b.id) return null
  const known = (a.id === 'tirupati-station' && b.knownKm && b) || (b.id === 'tirupati-station' && a.knownKm && a)
  const straight = haversineKm(a, b)
  const oneHill = !!a.hill !== !!b.hill
  const anyHill = !!a.hill || !!b.hill
  let km, car, source
  if (known) { km = known.knownKm; car = known.knownMins; source = 'list' }
  else {
    km = Math.max(0.3, straight * (oneHill ? 2.2 : 1.3))
    car = round5((km / (anyHill ? 28 : 38)) * 60)
    source = 'estimate'
  }
  return { km: Math.round(km * 10) / 10, straight: Math.round(straight * 10) / 10, source, ghat: oneHill,
    car, bike: round5(car * 1.1), walk: km <= 12 ? round5((km / 4.5) * 60) : null }
}

export const formatMins = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`)
export const dirUrl = (from, to, mode) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from.id === 'me' ? `${from.lat},${from.lng}` : from.query)}` +
  `&destination=${encodeURIComponent(to.id === 'me' ? `${to.lat},${to.lng}` : to.query)}&travelmode=${{ car: 'driving', bike: 'two-wheeler', walk: 'walking' }[mode]}`