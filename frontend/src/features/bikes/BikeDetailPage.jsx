import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button, ButtonGroup, FormGroup, FormFeedback } from 'reactstrap'
import { getBike, shops, DELIVERY, DELIVERY_FEE, DURATIONS, MIN_HOURS, RENTAL_GST, unitPrice, inr } from './bikesData'
import BikeImage from './BikeImage'
import { today, addDays, nightsBetween, formatDate } from '../hotels/hotelsUtils'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'
import '../../styles/components/Bikes.css'

const EMPTY = { name: '', phone: '', email: '', licence: '', address: '', adult: false }

export default function BikeDetailPage() {
  const { id } = useParams()
  const bike = getBike(id)
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [booking, setBooking] = useState(null)

  if (!bike) {
    return (
      <section className="section page-offset">
        <h1 className="heading-2">Bike not found</h1>
        <Button tag={Link} to="/bikes" color="gold">Back to bikes</Button>
      </section>
    )
  }

  const get = (k, d) => params.get(k) || d
  const setParam = (k, v) => { const n = new URLSearchParams(params); n.set(k, v); setParams(n, { replace: true }) }

  const mode = get('mode', 'day')
  const shop = get('shop', shops[0])
  const date = get('date', today())
  const rdate = get('rdate', addDays(date, 1))
  const time = get('time', '09:00')
  const hours = Number(get('hours', '6'))
  const qty = Math.min(bike.left, Math.max(1, Number(get('qty', '1')) || 1))
  const units = mode === 'hour' ? hours : Math.max(1, nightsBetween(date, rdate))
  const unitLabel = mode === 'hour' ? 'hours' : units === 1 ? 'day' : 'days'
  const delivery = shop === DELIVERY

  const base = unitPrice(bike, mode, units) * qty
  const deliveryFee = delivery ? DELIVERY_FEE : 0
  const subtotal = base + deliveryFee
  const tax = Math.round(subtotal * RENTAL_GST)
  const total = subtotal + tax
  const deposit = bike.deposit * qty
  const included = mode === 'hour' ? bike.kmHour * units : bike.kmDay * units

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter the rider’s full name.'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.licence.trim().length < 8) e.licence = 'Enter your two-wheeler driving licence number.'
    if (!form.adult) e.adult = 'Confirm your age and licence to book.'
    if (delivery && !form.address.trim()) e.address = 'Enter your hotel name and address.'
    return e
  }

  const confirm = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    // TODO: POST to your API and use the booking id it returns.
    setBooking({ ref: 'TB' + Date.now().toString().slice(-8), bike: bike.name, qty, mode, units, unitLabel,
      shop: delivery ? form.address : shop, date, rdate, time, total, deposit, guest: form })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (booking) {
    return (
      <section className="section page-offset">
        <div className="booking-done">
          <h1 className="heading-2">Bike booked</h1>
          <p>We have sent the details to {booking.guest.email}. Bring your original licence and one photo ID when you collect the bike.</p>
          <p className="booking-done__ref">{booking.ref}</p>
          <dl className="booking-done__list">
            <div><dt>Bike</dt><dd>{booking.qty} × {booking.bike}</dd></div>
            <div><dt>Pickup</dt><dd>{booking.shop}</dd></div>
            <div><dt>From</dt><dd>{formatDate(booking.date)} at {booking.time}</dd></div>
            <div><dt>{booking.mode === 'hour' ? 'Duration' : 'Return on'}</dt>
              <dd>{booking.mode === 'hour' ? `${booking.units} hours` : formatDate(booking.rdate)}</dd></div>
            <div><dt>Rider</dt><dd>{booking.guest.name}, {booking.guest.phone}</dd></div>
            <div><dt>Rental total</dt><dd><b>{inr(booking.total)}</b></dd></div>
            <div><dt>Security deposit</dt><dd>{inr(booking.deposit)}, refunded on return</dd></div>
          </dl>
          <p className="text-muted-soft">Free cancellation until 6 hours before pickup. Fuel and parking are extra. Late return is charged at the hourly rate.</p>
          <div className="d-flex flex-wrap gap-2">
            <Button color="gold" onClick={() => window.print()}>Print booking</Button>
            <Button tag={Link} to="/bikes" outline color="gold">Book another bike</Button>
            <Button tag={Link} to="/temples" outline color="gold">See temples nearby</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section page-offset">
      <Link to={`/bikes?${params.toString()}`} className="back-link">Back to bikes</Link>
      <h1 className="heading-2 mt-2">{bike.name}</h1>
      <p className="text-muted-soft">{bike.type}. {bike.cc}, {bike.gear}, {bike.mileage}.</p>

      <Row className="gx-5 gy-4">
        <Col lg="7">
          <BikeImage bike={bike} className="bike-hero" />
          <p className="mt-3">{bike.about}</p>

          <ul className="included list-unstyled">
            <li>Two helmets included (rider and pillion)</li>
            <li>{included} km included for this rental, then {inr(bike.extraKm)} per km</li>
            <li>Deposit of {inr(bike.deposit)} per bike, refunded on return</li>
            <li>{bike.fuel === 'Electric' ? 'Returned with at least 20% charge' : 'Returned with the same fuel level'}</li>
            <li>Rider must be 18 or older with a valid two-wheeler licence</li>
            <li>{inr(bike.hour)} per hour or {inr(bike.day)} per day. Hourly rentals never cost more than a full day.</li>
          </ul>

          <h2 className="heading-3 mt-4">Rental period and pickup</h2>
          <ButtonGroup className="mode-switch mb-3" aria-label="Rental period">
            <Button color="gold" outline={mode !== 'hour'} onClick={() => setParam('mode', 'hour')}>By the hour</Button>
            <Button color="gold" outline={mode !== 'day'} onClick={() => setParam('mode', 'day')}>By the day</Button>
          </ButtonGroup>
          <Row className="gx-3 gy-2">
            <Col xs="12">
              <Label for="b-shop">Pickup location</Label>
              <Input id="b-shop" type="select" value={shop} onChange={(e) => setParam('shop', e.target.value)}>
                {shops.map((s) => <option key={s}>{s}</option>)}
              </Input>
              {delivery && <small className="text-muted-soft">Delivery adds {inr(DELIVERY_FEE)}.</small>}
            </Col>
            <Col xs="6" md="3"><Label for="b-date">Pickup date</Label>
              <Input id="b-date" type="date" min={today()} value={date}
                onChange={(e) => { setParam('date', e.target.value); if (e.target.value > rdate) setParam('rdate', addDays(e.target.value, 1)) }} /></Col>
            <Col xs="6" md="3"><Label for="b-time">Pickup time</Label>
              <Input id="b-time" type="time" value={time} onChange={(e) => setParam('time', e.target.value)} /></Col>
            <Col xs="6" md="3">
              {mode === 'hour' ? (<>
                <Label for="b-hours">Duration</Label>
                <Input id="b-hours" type="select" value={hours} onChange={(e) => setParam('hours', e.target.value)}>
                  {DURATIONS.map((h) => <option key={h} value={h}>{h} hours</option>)}
                </Input>
                <small className="text-muted-soft">Minimum {MIN_HOURS} hours.</small>
              </>) : (<>
                <Label for="b-rdate">Return date</Label>
                <Input id="b-rdate" type="date" min={date} value={rdate} onChange={(e) => setParam('rdate', e.target.value)} />
              </>)}
            </Col>
            <Col xs="6" md="3"><Label for="b-qty">Bikes</Label>
              <Input id="b-qty" type="number" min="1" max={bike.left} value={qty} onChange={(e) => setParam('qty', e.target.value)} />
              <small className={bike.left <= 2 ? 'text-warning' : 'text-muted-soft'}>{bike.left} available</small></Col>
          </Row>
        </Col>

        <Col lg="5">
          <form className="booking" onSubmit={confirm} noValidate>
            <h2 className="heading-3">Rider details</h2>
            <FormGroup>
              <Label for="r-name">Full name</Label>
              <Input id="r-name" value={form.name} onChange={change('name')} invalid={!!errors.name} autoComplete="name" />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <Row className="gx-3">
              <Col sm="6"><FormGroup>
                <Label for="r-phone">Mobile number</Label>
                <Input id="r-phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={change('phone')} invalid={!!errors.phone} autoComplete="tel" />
                <FormFeedback>{errors.phone}</FormFeedback>
              </FormGroup></Col>
              <Col sm="6"><FormGroup>
                <Label for="r-email">Email</Label>
                <Input id="r-email" type="email" value={form.email} onChange={change('email')} invalid={!!errors.email} autoComplete="email" />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup></Col>
            </Row>
            <FormGroup>
              <Label for="r-lic">Driving licence number</Label>
              <Input id="r-lic" value={form.licence} onChange={change('licence')} invalid={!!errors.licence} />
              <FormFeedback>{errors.licence}</FormFeedback>
            </FormGroup>
            {delivery && (
              <FormGroup>
                <Label for="r-addr">Hotel name and address</Label>
                <Input id="r-addr" type="textarea" rows="2" value={form.address} onChange={change('address')} invalid={!!errors.address} />
                <FormFeedback>{errors.address}</FormFeedback>
              </FormGroup>
            )}
            <FormGroup check className="mb-3">
              <Input id="r-adult" type="checkbox" checked={form.adult} invalid={!!errors.adult}
                onChange={(e) => setForm({ ...form, adult: e.target.checked })} />
              <Label check for="r-adult">I am 18 or older and will carry my original licence.</Label>
              {errors.adult && <div className="text-danger small">{errors.adult}</div>}
            </FormGroup>

            <div className="booking__summary">
              <h3 className="heading-3">Price summary</h3>
              <div><span>{qty} × {bike.name}, {units} {unitLabel}</span><span>{inr(base)}</span></div>
              {deliveryFee > 0 && <div><span>Hotel delivery</span><span>{inr(deliveryFee)}</span></div>}
              <div><span>GST ({Math.round(RENTAL_GST * 100)}%)</span><span>{inr(tax)}</span></div>
              <div className="booking__total"><span>Total</span><span>{inr(total)}</span></div>
              <small>Plus a refundable deposit of {inr(deposit)} at pickup.</small>
            </div>

            <Button type="submit" color="gold" className="w-100 mt-3">Confirm booking</Button>
          </form>
        </Col>
      </Row>
    </section>
  )
}