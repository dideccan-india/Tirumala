import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button, Badge } from 'reactstrap'
import hotels, { areas, inr } from './hotelsData'
import { today, addDays, nightsBetween } from './hotelsUtils'
import '../../styles/components/Hotels.css'

const DEFAULTS = { q: '', area: '', maxPrice: '10000', rating: '0', sort: 'distance', guests: '2' }

export default function HotelsPage() {
  const [params, setParams] = useSearchParams()
  const get = (k) => params.get(k) ?? DEFAULTS[k] ?? ''
  const set = (k, v) => {
    const next = new URLSearchParams(params)
    v === '' || v == null ? next.delete(k) : next.set(k, v)
    setParams(next, { replace: true })
  }

  const checkin = get('checkin') || today()
  const checkout = get('checkout') || addDays(checkin, 1)
  const guests = Number(get('guests')) || 2
  const nights = nightsBetween(checkin, checkout)

  const results = useMemo(() => {
    const q = get('q').trim().toLowerCase()
    const list = hotels.filter((h) =>
      (!q || `${h.name} ${h.area} ${h.landmark}`.toLowerCase().includes(q)) &&
      (!get('area') || h.area === get('area')) &&
      h.price <= Number(get('maxPrice')) &&
      h.rating >= Number(get('rating')) &&
      h.rooms.some((r) => r.left > 0 && r.max >= guests))
    const by = {
      distance: (a, b) => a.distanceKm - b.distanceKm,
      price: (a, b) => a.price - b.price,
      rating: (a, b) => b.rating - a.rating,
    }
    return list.sort(by[get('sort')])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, guests])

  const detailQuery = new URLSearchParams({ checkin, checkout, guests }).toString()
  const reset = () => setParams({ checkin, checkout, guests }, { replace: true })

  return (
    <section className="section page-offset">
      <h1 className="heading-2">Hotels in Tirupati and Tirumala</h1>
      <p className="text-muted-soft">Pick your dates first. We only show hotels with a room free for your group.</p>

      <div className="hotel-bar">
        <Row className="gx-3 gy-2">
          <Col xs="12" md="4">
            <Label for="q">Hotel or area</Label>
            <Input id="q" placeholder="Search by name or landmark" value={get('q')} onChange={(e) => set('q', e.target.value)} />
          </Col>
          <Col xs="6" md>
            <Label for="checkin">Check-in</Label>
            <Input id="checkin" type="date" min={today()} value={checkin}
              onChange={(e) => { set('checkin', e.target.value); if (e.target.value >= checkout) set('checkout', addDays(e.target.value, 1)) }} />
          </Col>
          <Col xs="6" md>
            <Label for="checkout">Check-out</Label>
            <Input id="checkout" type="date" min={addDays(checkin, 1)} value={checkout} onChange={(e) => set('checkout', e.target.value)} />
          </Col>
          <Col xs="12" md="2">
            <Label for="guests">Guests</Label>
            <Input id="guests" type="number" min="1" max="8" value={guests} onChange={(e) => set('guests', e.target.value)} />
          </Col>
        </Row>
      </div>

      <Row className="gx-4 gy-4 mt-1">
        <Col lg="3">
          <aside className="hotel-filters" aria-label="Filters">
            <h2 className="heading-3">Filters</h2>

            <Label for="area">Location</Label>
            <Input id="area" type="select" value={get('area')} onChange={(e) => set('area', e.target.value)}>
              <option value="">All areas</option>
              {areas.map((a) => <option key={a}>{a}</option>)}
            </Input>

            <Label for="maxPrice" className="mt-3">Max price per night: <b>{inr(Number(get('maxPrice')))}</b></Label>
            <Input id="maxPrice" type="range" min="800" max="10000" step="100" value={get('maxPrice')}
              onChange={(e) => set('maxPrice', e.target.value)} />

            <Label for="rating" className="mt-3">Guest rating</Label>
            <Input id="rating" type="select" value={get('rating')} onChange={(e) => set('rating', e.target.value)}>
              <option value="0">Any</option>
              <option value="3.5">3.5 and above</option>
              <option value="4">4.0 and above</option>
              <option value="4.5">4.5 and above</option>
            </Input>

            <Label for="sort" className="mt-3">Sort by</Label>
            <Input id="sort" type="select" value={get('sort')} onChange={(e) => set('sort', e.target.value)}>
              <option value="distance">Nearest to Tirupati</option>
              <option value="price">Price, low to high</option>
              <option value="rating">Highest rated</option>
            </Input>

            <Button outline color="gold" size="sm" className="mt-4 w-100" onClick={reset}>Clear filters</Button>
          </aside>
        </Col>

        <Col lg="9">
          <p className="hotel-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'hotel' : 'hotels'} for {nights} {nights === 1 ? 'night' : 'nights'}, {guests} {guests === 1 ? 'guest' : 'guests'}
          </p>

          {results.length === 0 && (
            <div className="hotel-empty">
              <h3 className="heading-3">No hotels match these filters</h3>
              <p>Raise the maximum price, pick another area, or lower the rating.</p>
              <Button color="gold" onClick={reset}>Clear filters</Button>
            </div>
          )}

          <ul className="list-unstyled hotel-list">
            {results.map((h) => (
              <li key={h.id} className="hotel-card">
                <img src={h.images[0].src} alt={h.images[0].caption} className="hotel-card__img" loading="lazy" />
                <div className="hotel-card__body">
                  <div className="d-flex justify-content-between gap-2">
                    <h3 className="heading-3 m-0">{h.name}</h3>
                    <Badge className="hotel-rating" title={`${h.reviews} reviews`}>{h.rating.toFixed(1)}</Badge>
                  </div>
                  <p className="hotel-card__where">{h.area}, {h.landmark}. {h.distanceKm} km from Tirupati.</p>
                  <p className="hotel-card__amenities">{h.amenities.slice(0, 4).join(', ')}</p>
                  <div className="hotel-card__foot">
                    <div>
                      <strong>{inr(h.price)}</strong> <small>per night, from</small>
                      {nights > 1 && <small className="d-block">{inr(h.price * nights)} for {nights} nights</small>}
                    </div>
                    <Button tag={Link} to={`/hotels/${h.id}?${detailQuery}`} color="gold" size="sm">View rooms</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </section>
  )
}