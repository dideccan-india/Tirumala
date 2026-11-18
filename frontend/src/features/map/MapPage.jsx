import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Input, Label, Button, ButtonGroup, Alert } from 'reactstrap'
import hotels, { inr } from '../hotels/hotelsData'
import { hubs, placePoints, getPoint, areaCoords, nearbyTypes, haversineKm, estimate, formatMins, dirUrl } from './mapData'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'
import '../../styles/components/Temples.css'
import '../../styles/components/Map.css'

// Optional: add VITE_GOOGLE_MAPS_API_KEY to .env to use Google's official Embed API.
// Without a key the page uses Google's keyless embed, which needs no setup.
const KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY

const embedSrc = ({ view, from, to, mode, nearby, center }) => {
  const q = (p) => encodeURIComponent(p.id === 'me' ? `${p.lat},${p.lng}` : p.query)
  if (view === 'nearby') {
    const text = `${nearby.q} near ${center.id === 'me' ? `${center.lat},${center.lng}` : center.query}`
    return KEY
      ? `https://www.google.com/maps/embed/v1/search?key=${KEY}&q=${encodeURIComponent(text)}`
      : `https://maps.google.com/maps?q=${encodeURIComponent(text)}&output=embed`
  }
  if (!from || !to) return `https://maps.google.com/maps?q=${q(to || from)}&output=embed`
  return KEY
    ? `https://www.google.com/maps/embed/v1/directions?key=${KEY}&origin=${q(from)}&destination=${q(to)}&mode=${mode === 'walk' ? 'walking' : 'driving'}`
    : `https://maps.google.com/maps?saddr=${q(from)}&daddr=${q(to)}&dirflg=${mode === 'walk' ? 'w' : 'd'}&output=embed`
}

export default function MapPage() {
  const [params, setParams] = useSearchParams()
  const [me, setMe] = useState(null) // { lat, lng, accuracy }
  const [locState, setLocState] = useState('idle') // idle | loading | ok | denied | error | unsupported
  const [mode, setMode] = useState('car')
  const [nearby, setNearby] = useState(null)

  const meGroup = me ? { id: 'me', name: 'My location', lat: me.lat, lng: me.lng, query: `${me.lat},${me.lng}` } : null
  const resolve = (id) => (id === 'me' ? meGroup : getPoint(id))
  const from = resolve(params.get('from') || 'tirupati-station') || getPoint('tirupati-station')
  const to = resolve(params.get('to') || 'tirumala-venkateswara') || getPoint('tirumala-venkateswara')

  const setPoint = (key, id) => { const n = new URLSearchParams(params); n.set(key, id); setParams(n, { replace: true }); setNearby(null) }
  const swap = () => { setParams({ from: to.id, to: from.id }, { replace: true }); setNearby(null) }

  const locate = () => {
    if (!('geolocation' in navigator)) return setLocState('unsupported')
    setLocState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy) })
        setLocState('ok')
        setPoint('from', 'me')
      },
      (err) => setLocState(err.code === 1 ? 'denied' : 'error'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  const trip = useMemo(() => estimate(from, to), [from, to])
  const center = to
  const view = nearby ? 'nearby' : 'route'
  const src = embedSrc({ view, from, to, mode, nearby, center })

  const nearTemples = useMemo(() => placePoints
    .filter((p) => p.id !== center.id)
    .map((p) => ({ ...p, away: haversineKm(center, p) }))
    .sort((a, b) => a.away - b.away).slice(0, 4), [center])

  const nearHotels = useMemo(() => {
    const [area] = Object.entries(areaCoords)
      .map(([name, [lat, lng]]) => [name, haversineKm(center, { lat, lng })])
      .sort((a, b) => a[1] - b[1])[0]
    return { area, list: hotels.filter((h) => h.area === area).slice(0, 3) }
  }, [center])

  const options = (
    <>
      {meGroup && <option value="me">My current location</option>}
      <optgroup label="Travel hubs">{hubs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</optgroup>
      {['Tirumala', 'Tirupati temples', 'Sightseeing'].map((c) => (
        <optgroup key={c} label={c}>
          {placePoints.filter((p) => p.category === c).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </optgroup>
      ))}
    </>
  )

  const locMessage = {
    loading: 'Waiting for your permission and location…',
    ok: me && `Using your location (accurate to about ${me.accuracy} m).`,
    denied: 'Location access was blocked. Allow it in your browser settings, or choose a starting point from the list.',
    error: 'We could not get your location. Check your connection and GPS, or choose a starting point from the list.',
    unsupported: 'This browser cannot share your location. Choose a starting point from the list.',
  }[locState]

  return (
    <section className="section page-offset">
      <h1 className="heading-2">Map and directions</h1>
      <p className="text-muted-soft">Pick two places to see the route, distance and travel time. Everything opens in Google Maps for turn-by-turn navigation.</p>

      <div className="map-layout">
        <aside className="booking map-panel" aria-label="Route planner">
          <Label for="from">From</Label>
          <Input id="from" type="select" value={from.id} onChange={(e) => setPoint('from', e.target.value)}>{options}</Input>

          <Button color="link" size="sm" className="map-swap" onClick={swap} aria-label="Swap start and destination">Swap</Button>

          <Label for="to">To</Label>
          <Input id="to" type="select" value={to.id} onChange={(e) => setPoint('to', e.target.value)}>{options}</Input>

          <Button outline color="gold" size="sm" className="w-100 mt-3" onClick={locate} disabled={locState === 'loading'}>
            {locState === 'loading' ? 'Finding you…' : 'Use my current location'}
          </Button>
          {locMessage && (
            <Alert color={locState === 'ok' ? 'success' : locState === 'loading' ? 'info' : 'warning'} className="mt-2 mb-0 py-2 small" role="status">
              {locMessage}
            </Alert>
          )}

          <ButtonGroup className="mode-switch mt-3 w-100" aria-label="Travel mode">
            {[['car', 'Car'], ['bike', 'Bike'], ['walk', 'Walk']].map(([k, l]) => (
              <Button key={k} color="gold" outline={mode !== k} disabled={k === 'walk' && trip && trip.walk == null}
                onClick={() => setMode(k)}>{l}</Button>
            ))}
          </ButtonGroup>

          <div className="route-card" aria-live="polite">
            {trip ? (<>
              <div className="route-card__main">
                <div><strong>{trip.km} km</strong><span>by road</span></div>
                <div><strong>{formatMins(trip[mode] ?? trip.car)}</strong><span>{mode === 'walk' ? 'on foot' : mode === 'bike' ? 'by bike' : 'by car'}</span></div>
              </div>
              <small>
                {trip.source === 'list'
                  ? 'Distance and time from our temples list.'
                  : `Estimate from the straight-line distance (${trip.straight} km). Google Maps shows the exact route.`}
                {trip.ghat && ' Includes the winding Tirumala ghat road, which is slower.'}
              </small>
            </>) : <small>Choose two different places to see the distance.</small>}
          </div>

          <div className="d-grid gap-2 mt-3">
            <Button tag="a" color="gold" href={dirUrl(from, to, mode)} target="_blank" rel="noopener noreferrer">Start navigation in Google Maps</Button>
            {placePoints.some((p) => p.id === to.id) && (
              <Button tag={Link} to={`/temples/${to.id}`} outline color="gold">About this place</Button>
            )}
          </div>
        </aside>

        <div className="map-frame-wrap">
          <iframe key={src} className="map-frame" title={view === 'nearby' ? `${nearby.label} near ${center.name}` : `Route from ${from.name} to ${to.name}`}
            src={src} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>

      <h2 className="heading-3 mt-5">Nearby {center.name}</h2>
      <p className="text-muted-soft">Choose a type to search the map around your destination.</p>
      <div className="type-pills" role="group" aria-label="Nearby services">
        {nearbyTypes.map((t) => (
          <button key={t.label} type="button" aria-pressed={nearby?.label === t.label}
            className={nearby?.label === t.label ? 'is-active' : ''} onClick={() => setNearby(nearby?.label === t.label ? null : t)}>
            {t.label}
          </button>
        ))}
        {nearby && <button type="button" onClick={() => setNearby(null)}>Back to route</button>}
      </div>

      <div className="map-nearby">
        <div>
          <h3 className="heading-3">Temples and sights</h3>
          <ul className="list-unstyled more-places">
            {nearTemples.map((p) => (
              <li key={p.id}>
                <Link to={`/map?from=${from.id}&to=${p.id}`}><b>{p.name}</b><span>about {Math.max(1, Math.round(p.away))} km away</span></Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="heading-3">Hotels in {nearHotels.area}</h3>
          <ul className="list-unstyled more-places">
            {nearHotels.list.map((h) => (
              <li key={h.id}><Link to={`/hotels/${h.id}`}><b>{h.name}</b><span>from {inr(h.price)}</span></Link></li>
            ))}
          </ul>
          <Button tag={Link} to={`/hotels?area=${nearHotels.area}`} outline color="gold" size="sm">See all hotels in {nearHotels.area}</Button>
        </div>
      </div>
    </section>
  )
}