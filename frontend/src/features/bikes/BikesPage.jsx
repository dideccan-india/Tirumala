import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button, ButtonGroup } from 'reactstrap'
import bikes, { types, shops, DURATIONS, unitPrice, inr } from './bikesData'
import BikeImage from './BikeImage'
import { today, addDays, nightsBetween } from '../hotels/hotelsUtils'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'
import '../../styles/components/Bikes.css'

const DEFAULTS = { type: '', mode: 'day', maxPrice: '1500', sort: 'price', shop: shops[0], time: '09:00', hours: '6', qty: '1' }

export default function BikesPage() {
  const [params, setParams] = useSearchParams()
  const get = (k) => params.get(k) ?? DEFAULTS[k] ?? ''
  const set = (k, v) => {
    const next = new URLSearchParams(params)
    v === '' || v == null ? next.delete(k) : next.set(k, v)
    setParams(next, { replace: true })
  }

  const mode = get('mode')
  const date = get('date') || today()
  const rdate = get('rdate') || addDays(date, 1)
  const qty = Math.max(1, Number(get('qty')) || 1)
  const units = mode === 'hour' ? Number(get('hours')) : Math.max(1, nightsBetween(date, rdate))
  const unitLabel = mode === 'hour' ? 'hours' : units === 1 ? 'day' : 'days'
  const rateKey = mode === 'hour' ? 'hour' : 'day'

  const results = useMemo(() => {
    const by = { price: (a, b) => a[rateKey] - b[rateKey], cc: (a, b) => parseInt(b.cc) - parseInt(a.cc) || 0 }
    return bikes
      .filter((b) => b.left >= qty && (!get('type') || b.type === get('type')) && b[rateKey] <= Number(get('maxPrice')))
      .sort(by[get('sort')])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const query = new URLSearchParams({ mode, shop: get('shop'), date, rdate, time: get('time'), hours: get('hours'), qty }).toString()
  const reset = () => setParams({ mode, shop: get('shop'), date, rdate, qty }, { replace: true })

  return (
    <section className="section page-offset">
      <h1 className="heading-2">Rental bikes and scooters</h1>
      <p className="text-muted-soft">Rent by the hour or by the day. Two helmets are included with every bike.</p>

      <ButtonGroup className="mode-switch" aria-label="Rental period">
        <Button color="gold" outline={mode !== 'hour'} onClick={() => set('mode', 'hour')}>By the hour</Button>
        <Button color="gold" outline={mode !== 'day'} onClick={() => set('mode', 'day')}>By the day</Button>
      </ButtonGroup>

      <div className="hotel-bar">
        <Row className="gx-3 gy-2">
          <Col xs="12" md="6" lg="3">
            <Label for="shop">Pickup location</Label>
            <Input id="shop" type="select" value={get('shop')} onChange={(e) => set('shop', e.target.value)}>
              {shops.map((s) => <option key={s}>{s}</option>)}
            </Input>
          </Col>
          <Col xs="6" lg="2">
            <Label for="date">Pickup date</Label>
            <Input id="date" type="date" min={today()} value={date}
              onChange={(e) => { set('date', e.target.value); if (e.target.value > rdate) set('rdate', addDays(e.target.value, 1)) }} />
          </Col>
          <Col xs="6" lg="2">
            <Label for="time">Pickup time</Label>
            <Input id="time" type="time" value={get('time')} onChange={(e) => set('time', e.target.value)} />
          </Col>
          <Col xs="6" lg="3">
            {mode === 'hour' ? (<>
              <Label for="hours">Duration</Label>
              <Input id="hours" type="select" value={get('hours')} onChange={(e) => set('hours', e.target.value)}>
                {DURATIONS.map((h) => <option key={h} value={h}>{h} hours</option>)}
              </Input>
            </>) : (<>
              <Label for="rdate">Return date</Label>
              <Input id="rdate" type="date" min={date} value={rdate} onChange={(e) => set('rdate', e.target.value)} />
            </>)}
          </Col>
          <Col xs="6" lg="2">
            <Label for="qty">Bikes</Label>
            <Input id="qty" type="number" min="1" max="6" value={qty} onChange={(e) => set('qty', e.target.value)} />
          </Col>
        </Row>
      </div>

      <div className="type-pills" role="group" aria-label="Bike type">
        {['', ...types].map((t) => (
          <button key={t || 'all'} type="button" aria-pressed={get('type') === t}
            className={get('type') === t ? 'is-active' : ''} onClick={() => set('type', t)}>
            {t || 'All bikes'}
          </button>
        ))}
      </div>

      <Row className="gx-4 gy-4 mt-1">
        <Col lg="3">
          <aside className="hotel-filters" aria-label="Filters">
            <h2 className="heading-3">Filters</h2>
            <Label for="maxPrice">Max price per {mode === 'hour' ? 'hour' : 'day'}: <b>{inr(Number(get('maxPrice')))}</b></Label>
            <Input id="maxPrice" type="range" min="50" max="1500" step="50" value={get('maxPrice')}
              onChange={(e) => set('maxPrice', e.target.value)} />
            <Label for="sort" className="mt-3">Sort by</Label>
            <Input id="sort" type="select" value={get('sort')} onChange={(e) => set('sort', e.target.value)}>
              <option value="price">Price, low to high</option>
              <option value="cc">Engine size, high to low</option>
            </Input>
            <Button outline color="gold" size="sm" className="mt-4 w-100" onClick={reset}>Clear filters</Button>
          </aside>
        </Col>

        <Col lg="9">
          <p className="hotel-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'bike' : 'bikes'} available for {units} {unitLabel}
          </p>

          {results.length === 0 && (
            <div className="hotel-empty">
              <h3 className="heading-3">No bikes match</h3>
              <p>Try another type, a higher price, or fewer bikes.</p>
              <Button color="gold" onClick={reset}>Clear filters</Button>
            </div>
          )}

          <ul className="list-unstyled hotel-list">
            {results.map((b) => (
              <li key={b.id} className="hotel-card">
                <BikeImage bike={b} className="hotel-card__img" />
                <div className="hotel-card__body">
                  <div className="d-flex justify-content-between gap-2">
                    <h3 className="heading-3 m-0">{b.name}</h3>
                    <span className="car-type">{b.type}</span>
                  </div>
                  <p className="hotel-card__where">{b.cc}, {b.gear}, {b.mileage}</p>
                  <p className="hotel-card__amenities">
                    {mode === 'hour' ? `${b.kmHour} km per hour` : `${b.kmDay} km per day`}, then {inr(b.extraKm)} per km. Deposit {inr(b.deposit)}.
                  </p>
                  <div className="hotel-card__foot">
                    <div>
                      <strong>{inr(b.hour)}</strong> <small>per hour</small>
                      <small className="d-block">{inr(b.day)} per day</small>
                      <small className="d-block">{inr(unitPrice(b, mode, units) * qty)} for {units} {unitLabel}{qty > 1 ? `, ${qty} bikes` : ''}</small>
                      {b.left <= 2 && <small className="d-block text-warning">Only {b.left} left</small>}
                    </div>
                    <Button tag={Link} to={`/bikes/${b.id}?${query}`} color="gold" size="sm">Book this bike</Button>
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