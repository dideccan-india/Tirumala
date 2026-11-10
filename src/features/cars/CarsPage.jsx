import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button, ButtonGroup } from 'reactstrap'
import cars, { types, pickupPoints, inr } from './carsData'
import CarImage from './CarImage'
import { today, addDays, nightsBetween } from '../hotels/hotelsUtils'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'

const DEFAULTS = { type: '', mode: 'driver', seats: '1', maxPrice: '8000', sort: 'price',
  pickup: pickupPoints[0], drop: '', ptime: '09:00', rtime: '18:00' }

export default function CarsPage() {
  const [params, setParams] = useSearchParams()
  const get = (k) => params.get(k) ?? DEFAULTS[k] ?? ''
  const set = (k, v) => {
    const next = new URLSearchParams(params)
    v === '' || v == null ? next.delete(k) : next.set(k, v)
    setParams(next, { replace: true })
  }

  const mode = get('mode')
  const pdate = get('pdate') || today()
  const rdate = get('rdate') || addDays(pdate, 1)
  const days = Math.max(1, nightsBetween(pdate, rdate))
  const pickup = get('pickup')
  const drop = get('drop') || pickup

  const results = useMemo(() => {
    const by = { price: (a, b) => a.price[mode] - b.price[mode], seats: (a, b) => b.seats - a.seats }
    return cars
      .filter((c) => c.price[mode] != null && c.left > 0 &&
        (!get('type') || c.type === get('type')) &&
        c.seats >= Number(get('seats')) && c.price[mode] <= Number(get('maxPrice')))
      .sort(by[get('sort')])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const query = new URLSearchParams({ mode, pickup, drop, pdate, rdate, ptime: get('ptime'), rtime: get('rtime') }).toString()
  const reset = () => setParams({ pickup, drop, pdate, rdate, mode }, { replace: true })

  return (
    <section className="section page-offset">
      <h1 className="heading-2">Rental cars in Tirupati and Tirumala</h1>
      <p className="text-muted-soft">Drive yourself or hire a driver who knows the ghat road. Prices are per day.</p>

      <ButtonGroup className="mode-switch" aria-label="Drive option">
        <Button color="gold" outline={mode !== 'driver'} onClick={() => set('mode', 'driver')}>With driver</Button>
        <Button color="gold" outline={mode !== 'self'} onClick={() => set('mode', 'self')}>Self-drive</Button>
      </ButtonGroup>

      <div className="hotel-bar">
        <Row className="gx-3 gy-2">
          <Col xs="12" md="6" lg="3">
            <Label for="pickup">Pickup point</Label>
            <Input id="pickup" type="select" value={pickup} onChange={(e) => set('pickup', e.target.value)}>
              {pickupPoints.map((p) => <option key={p}>{p}</option>)}
            </Input>
          </Col>
          <Col xs="12" md="6" lg="3">
            <Label for="drop">Drop point</Label>
            <Input id="drop" type="select" value={drop} onChange={(e) => set('drop', e.target.value)}>
              {pickupPoints.map((p) => <option key={p}>{p}</option>)}
            </Input>
          </Col>
          <Col xs="6" lg="2">
            <Label for="pdate">Pickup date</Label>
            <Input id="pdate" type="date" min={today()} value={pdate}
              onChange={(e) => { set('pdate', e.target.value); if (e.target.value > rdate) set('rdate', addDays(e.target.value, 1)) }} />
          </Col>
          <Col xs="6" lg="2">
            <Label for="ptime">Pickup time</Label>
            <Input id="ptime" type="time" value={get('ptime')} onChange={(e) => set('ptime', e.target.value)} />
          </Col>
          <Col xs="6" lg="2">
            <Label for="rdate">Return date</Label>
            <Input id="rdate" type="date" min={pdate} value={rdate} onChange={(e) => set('rdate', e.target.value)} />
          </Col>
        </Row>
      </div>

      <div className="type-pills" role="group" aria-label="Vehicle type">
        {['', ...types].map((t) => (
          <button key={t || 'all'} type="button" aria-pressed={get('type') === t}
            className={get('type') === t ? 'is-active' : ''} onClick={() => set('type', t)}>
            {t || 'All vehicles'}
          </button>
        ))}
      </div>

      <Row className="gx-4 gy-4 mt-1">
        <Col lg="3">
          <aside className="hotel-filters" aria-label="Filters">
            <h2 className="heading-3">Filters</h2>
            <Label for="seats">Seats needed</Label>
            <Input id="seats" type="select" value={get('seats')} onChange={(e) => set('seats', e.target.value)}>
              <option value="1">Any</option><option value="4">4 or more</option>
              <option value="6">6 or more</option><option value="10">10 or more</option>
            </Input>
            <Label for="maxPrice" className="mt-3">Max price per day: <b>{inr(Number(get('maxPrice')))}</b></Label>
            <Input id="maxPrice" type="range" min="1000" max="8000" step="200" value={get('maxPrice')}
              onChange={(e) => set('maxPrice', e.target.value)} />
            <Label for="sort" className="mt-3">Sort by</Label>
            <Input id="sort" type="select" value={get('sort')} onChange={(e) => set('sort', e.target.value)}>
              <option value="price">Price, low to high</option><option value="seats">Most seats</option>
            </Input>
            <Button outline color="gold" size="sm" className="mt-4 w-100" onClick={reset}>Clear filters</Button>
          </aside>
        </Col>

        <Col lg="9">
          <p className="hotel-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'vehicle' : 'vehicles'} available, {mode === 'self' ? 'self-drive' : 'with driver'}, {days} {days === 1 ? 'day' : 'days'}
          </p>

          {results.length === 0 && (
            <div className="hotel-empty">
              <h3 className="heading-3">No vehicles match</h3>
              <p>Try another vehicle type, fewer seats or a higher price. Large vehicles come with a driver only.</p>
              <Button color="gold" onClick={reset}>Clear filters</Button>
            </div>
          )}

          <ul className="list-unstyled hotel-list">
            {results.map((c) => (
              <li key={c.id} className="hotel-card">
                <CarImage car={c} className="hotel-card__img" />
                <div className="hotel-card__body">
                  <div className="d-flex justify-content-between gap-2">
                    <h3 className="heading-3 m-0">{c.name}</h3>
                    <span className="car-type">{c.type}</span>
                  </div>
                  <p className="hotel-card__where">{c.seats} seats, {c.bags} bags, {c.fuel}, {c.gear}, AC</p>
                  <p className="hotel-card__amenities">
                    {mode === 'self'
                      ? `${c.kmSelf} km per day, then ${inr(c.extraKm)} per km. Deposit ${inr(c.deposit)}, refundable.`
                      : `Driver included. ${c.kmDriver} km per day, then ${inr(c.extraKm)} per km.`}
                  </p>
                  <div className="hotel-card__foot">
                    <div>
                      <strong>{inr(c.price[mode])}</strong> <small>per day</small>
                      {days > 1 && <small className="d-block">{inr(c.price[mode] * days)} for {days} days</small>}
                      {c.left <= 2 && <small className="d-block text-warning">Only {c.left} left</small>}
                    </div>
                    <Button tag={Link} to={`/cars/${c.id}?${query}`} color="gold" size="sm">Book this car</Button>
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