import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button, ButtonGroup, FormGroup, FormFeedback } from 'reactstrap'
import { getCar, pickupPoints, inr, DROP_FEE, RENTAL_GST, DRIVER_NIGHT_ALLOWANCE } from './carsData'
import CarImage from './CarImage'
import { today, addDays, nightsBetween, formatDate } from '../hotels/hotelsUtils'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'

const EMPTY = { name: '', phone: '', email: '', licence: '', passengers: '2', address: '', adult: false }

export default function CarDetailPage() {
  const { id } = useParams()
  const car = getCar(id)
  const [params, setParams] = useSearchParams()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [booking, setBooking] = useState(null)

  if (!car) {
    return (
      <section className="section page-offset">
        <h1 className="heading-2">Vehicle not found</h1>
        <Button tag={Link} to="/cars" color="gold">Back to cars</Button>
      </section>
    )
  }

  const get = (k, d) => params.get(k) || d
  const setParam = (k, v) => { const n = new URLSearchParams(params); n.set(k, v); setParams(n, { replace: true }) }

  let mode = get('mode', 'driver')
  if (car.price[mode] == null) mode = 'driver'
  const pdate = get('pdate', today())
  const rdate = get('rdate', addDays(pdate, 1))
  const pickup = get('pickup', pickupPoints[0])
  const drop = get('drop', pickup)
  const days = Math.max(1, nightsBetween(pdate, rdate))
  const nights = nightsBetween(pdate, rdate)

  const base = car.price[mode] * days
  const dropFee = drop !== pickup ? DROP_FEE : 0
  const allowance = mode === 'driver' ? nights * DRIVER_NIGHT_ALLOWANCE : 0
  const subtotal = base + dropFee + allowance
  const tax = Math.round(subtotal * RENTAL_GST[mode])
  const total = subtotal + tax
  const needsAddress = pickup === 'Your hotel or address'

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter the lead traveller’s full name.'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (mode === 'self') {
      if (form.licence.trim().length < 8) e.licence = 'Enter your driving licence number.'
      if (!form.adult) e.adult = 'Confirm your age and licence to book a self-drive car.'
    } else if (Number(form.passengers) < 1 || Number(form.passengers) > car.seats) {
      e.passengers = `This vehicle seats ${car.seats}. Choose a bigger vehicle for more people.`
    }
    if (needsAddress && !form.address.trim()) e.address = 'Enter the pickup address.'
    return e
  }

  const confirm = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    // TODO: POST to your API and use the booking id it returns.
    setBooking({ ref: 'TC' + Date.now().toString().slice(-8), car: car.name, mode, pickup: needsAddress ? form.address : pickup,
      drop, pdate, rdate, ptime: get('ptime', '09:00'), days, total, deposit: mode === 'self' ? car.deposit : 0, guest: form })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (booking) {
    return (
      <section className="section page-offset">
        <div className="booking-done">
          <h1 className="heading-2">Car booked</h1>
          <p>We have sent the details to {booking.guest.email}. {booking.mode === 'driver'
            ? 'Your driver will call you the evening before pickup.' : 'Bring your original driving licence at pickup.'}</p>
          <p className="booking-done__ref">{booking.ref}</p>
          <dl className="booking-done__list">
            <div><dt>Vehicle</dt><dd>{booking.car}, {booking.mode === 'self' ? 'self-drive' : 'with driver'}</dd></div>
            <div><dt>Pickup</dt><dd>{booking.pickup}, {formatDate(booking.pdate)} at {booking.ptime}</dd></div>
            <div><dt>Drop</dt><dd>{booking.drop}, {formatDate(booking.rdate)}</dd></div>
            <div><dt>Duration</dt><dd>{booking.days} {booking.days === 1 ? 'day' : 'days'}</dd></div>
            <div><dt>Traveller</dt><dd>{booking.guest.name}, {booking.guest.phone}</dd></div>
            <div><dt>Rental total</dt><dd><b>{inr(booking.total)}</b></dd></div>
            {booking.deposit > 0 && <div><dt>Security deposit</dt><dd>{inr(booking.deposit)}, refunded on return</dd></div>}
          </dl>
          <p className="text-muted-soft">Free cancellation until 12 hours before pickup. Tolls, parking and fuel are extra.</p>
          <div className="d-flex flex-wrap gap-2">
            <Button color="gold" onClick={() => window.print()}>Print booking</Button>
            <Button tag={Link} to="/cars" outline color="gold">Book another car</Button>
            <Button tag={Link} to="/hotels" outline color="gold">Find a hotel</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section page-offset">
      <Link to={`/cars?${params.toString()}`} className="back-link">Back to cars</Link>
      <h1 className="heading-2 mt-2">{car.name}</h1>
      <p className="text-muted-soft">{car.type}. {car.seats} seats, {car.bags} bags, {car.fuel}, {car.gear}, AC.</p>

      <Row className="gx-5 gy-4">
        <Col lg="7">
          <CarImage car={car} className="car-hero" />
          <p className="mt-3">{car.about}</p>

          <h2 className="heading-3 mt-4">Drive option</h2>
          <ButtonGroup className="mode-switch" aria-label="Drive option">
            <Button color="gold" outline={mode !== 'driver'} onClick={() => setParam('mode', 'driver')}>With driver</Button>
            <Button color="gold" outline={mode !== 'self'} disabled={car.price.self == null} onClick={() => setParam('mode', 'self')}>Self-drive</Button>
          </ButtonGroup>
          {car.price.self == null && <p><small className="text-muted-soft">This vehicle is only rented with a driver.</small></p>}

          <ul className="included list-unstyled">
            {mode === 'driver' ? (<>
              <li>Experienced local driver, familiar with the ghat road</li>
              <li>{car.kmDriver} km per day, then {inr(car.extraKm)} per km</li>
              <li>Driver night allowance {inr(DRIVER_NIGHT_ALLOWANCE)} per night for overnight trips</li>
            </>) : (<>
              <li>{car.kmSelf} km per day, then {inr(car.extraKm)} per km</li>
              <li>Refundable deposit of {inr(car.deposit)}, paid at pickup</li>
              <li>Driver must be 21 or older with an original driving licence</li>
              <li>Return with the same fuel level</li>
            </>)}
            <li>Tolls, parking and fuel are extra</li>
          </ul>

          <h2 className="heading-3 mt-4">Pickup and drop</h2>
          <Row className="gx-3 gy-2">
            <Col md="6">
              <Label for="c-pick">Pickup point</Label>
              <Input id="c-pick" type="select" value={pickup} onChange={(e) => { setParam('pickup', e.target.value); if (!params.get('drop')) setParam('drop', e.target.value) }}>
                {pickupPoints.map((p) => <option key={p}>{p}</option>)}
              </Input>
            </Col>
            <Col md="6">
              <Label for="c-drop">Drop point</Label>
              <Input id="c-drop" type="select" value={drop} onChange={(e) => setParam('drop', e.target.value)}>
                {pickupPoints.map((p) => <option key={p}>{p}</option>)}
              </Input>
              {dropFee > 0 && <small className="text-muted-soft">Different drop point adds {inr(DROP_FEE)}.</small>}
            </Col>
            <Col xs="6" md="3"><Label for="c-pd">Pickup date</Label>
              <Input id="c-pd" type="date" min={today()} value={pdate}
                onChange={(e) => { setParam('pdate', e.target.value); if (e.target.value > rdate) setParam('rdate', addDays(e.target.value, 1)) }} /></Col>
            <Col xs="6" md="3"><Label for="c-pt">Time</Label>
              <Input id="c-pt" type="time" value={get('ptime', '09:00')} onChange={(e) => setParam('ptime', e.target.value)} /></Col>
            <Col xs="6" md="3"><Label for="c-rd">Return date</Label>
              <Input id="c-rd" type="date" min={pdate} value={rdate} onChange={(e) => setParam('rdate', e.target.value)} /></Col>
            <Col xs="6" md="3"><Label for="c-rt">Time</Label>
              <Input id="c-rt" type="time" value={get('rtime', '18:00')} onChange={(e) => setParam('rtime', e.target.value)} /></Col>
          </Row>
        </Col>

        <Col lg="5">
          <form className="booking" onSubmit={confirm} noValidate>
            <h2 className="heading-3">Traveller details</h2>
            <FormGroup>
              <Label for="t-name">Full name</Label>
              <Input id="t-name" value={form.name} onChange={change('name')} invalid={!!errors.name} autoComplete="name" />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <Row className="gx-3">
              <Col sm="6"><FormGroup>
                <Label for="t-phone">Mobile number</Label>
                <Input id="t-phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={change('phone')} invalid={!!errors.phone} autoComplete="tel" />
                <FormFeedback>{errors.phone}</FormFeedback>
              </FormGroup></Col>
              <Col sm="6"><FormGroup>
                <Label for="t-email">Email</Label>
                <Input id="t-email" type="email" value={form.email} onChange={change('email')} invalid={!!errors.email} autoComplete="email" />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup></Col>
            </Row>

            {mode === 'self' ? (<>
              <FormGroup>
                <Label for="t-lic">Driving licence number</Label>
                <Input id="t-lic" value={form.licence} onChange={change('licence')} invalid={!!errors.licence} />
                <FormFeedback>{errors.licence}</FormFeedback>
              </FormGroup>
              <FormGroup check className="mb-3">
                <Input id="t-adult" type="checkbox" checked={form.adult} invalid={!!errors.adult}
                  onChange={(e) => setForm({ ...form, adult: e.target.checked })} />
                <Label check for="t-adult">I am 21 or older and will carry my original licence.</Label>
                {errors.adult && <div className="text-danger small">{errors.adult}</div>}
              </FormGroup>
            </>) : (
              <FormGroup>
                <Label for="t-pax">Number of passengers</Label>
                <Input id="t-pax" type="number" min="1" max={car.seats} value={form.passengers} onChange={change('passengers')} invalid={!!errors.passengers} />
                <FormFeedback>{errors.passengers}</FormFeedback>
              </FormGroup>
            )}

            {needsAddress && (
              <FormGroup>
                <Label for="t-addr">Pickup address</Label>
                <Input id="t-addr" type="textarea" rows="2" value={form.address} onChange={change('address')} invalid={!!errors.address} />
                <FormFeedback>{errors.address}</FormFeedback>
              </FormGroup>
            )}

            <div className="booking__summary">
              <h3 className="heading-3">Price summary</h3>
              <div><span>{inr(car.price[mode])} × {days} {days === 1 ? 'day' : 'days'}</span><span>{inr(base)}</span></div>
              {dropFee > 0 && <div><span>Different drop point</span><span>{inr(dropFee)}</span></div>}
              {allowance > 0 && <div><span>Driver night allowance, {nights} {nights === 1 ? 'night' : 'nights'}</span><span>{inr(allowance)}</span></div>}
              <div><span>GST ({Math.round(RENTAL_GST[mode] * 100)}%)</span><span>{inr(tax)}</span></div>
              <div className="booking__total"><span>Total</span><span>{inr(total)}</span></div>
              {mode === 'self' && <small>Plus a refundable deposit of {inr(car.deposit)} at pickup.</small>}
            </div>

            <Button type="submit" color="gold" className="w-100 mt-3">Confirm booking</Button>
          </form>
        </Col>
      </Row>
    </section>
  )
}