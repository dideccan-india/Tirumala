import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button, FormGroup, FormFeedback } from 'reactstrap'
import { getHotel, inr } from './hotelsData'
import { today, addDays, nightsBetween, formatDate, GST_RATE } from './hotelsUtils'
import '../../styles/components/Hotels.css'

const EMPTY = { name: '', phone: '', email: '', idType: 'Aadhaar', idNumber: '', requests: '' }

export default function HotelDetailPage() {
  const { id } = useParams()
  const hotel = getHotel(id)
  const [params, setParams] = useSearchParams()

  const [shot, setShot] = useState(0)
  const [roomId, setRoomId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [booking, setBooking] = useState(null)

  if (!hotel) {
    return (
      <section className="section page-offset">
        <h1 className="heading-2">Hotel not found</h1>
        <p>This hotel may have been removed.</p>
        <Button tag={Link} to="/hotels" color="gold">Back to hotels</Button>
      </section>
    )
  }

  const checkin = params.get('checkin') || today()
  const checkout = params.get('checkout') || addDays(checkin, 1)
  const guests = Number(params.get('guests')) || 2
  const nights = nightsBetween(checkin, checkout)
  const setParam = (k, v) => { const n = new URLSearchParams(params); n.set(k, v); setParams(n, { replace: true }) }

  const room = hotel.rooms.find((r) => r.id === roomId)
  const roomTotal = room ? room.price * nights : 0
  const tax = Math.round(roomTotal * GST_RATE)
  const total = roomTotal + tax

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter the lead guest’s full name.'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.idNumber.trim().length < 6) e.idNumber = 'Enter your ID number. Hotels need it at check-in.'
    if (nights < 1) e.dates = 'Check-out must be after check-in.'
    if (!room) e.room = 'Choose a room first.'
    return e
  }

  const confirm = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    // TODO: POST to your API and use the booking id it returns.
    setBooking({
      ref: 'TY' + Date.now().toString().slice(-8),
      hotel: hotel.name, area: hotel.area, room: room.name,
      checkin, checkout, nights, guests, total, guest: form,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* Step 3: confirmation */
  if (booking) {
    return (
      <section className="section page-offset">
        <div className="booking-done">
          <h1 className="heading-2">Booking confirmed</h1>
          <p>We have sent the details to {booking.guest.email}. Show this reference at check-in.</p>
          <p className="booking-done__ref">{booking.ref}</p>
          <dl className="booking-done__list">
            <div><dt>Hotel</dt><dd>{booking.hotel}, {booking.area}</dd></div>
            <div><dt>Room</dt><dd>{booking.room}</dd></div>
            <div><dt>Check-in</dt><dd>{formatDate(booking.checkin)}, from 12:00 pm</dd></div>
            <div><dt>Check-out</dt><dd>{formatDate(booking.checkout)}, by 11:00 am</dd></div>
            <div><dt>Stay</dt><dd>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}, {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</dd></div>
            <div><dt>Lead guest</dt><dd>{booking.guest.name}, {booking.guest.phone}</dd></div>
            <div><dt>Total to pay</dt><dd><b>{inr(booking.total)}</b> at the hotel</dd></div>
          </dl>
          <p className="text-muted-soft">Carry a valid photo ID for every guest. Free cancellation until 24 hours before check-in.</p>
          <div className="d-flex flex-wrap gap-2">
            <Button color="gold" onClick={() => window.print()}>Print booking</Button>
            <Button tag={Link} to="/hotels" outline color="gold">Book another hotel</Button>
            <Button tag={Link} to="/temples" outline color="gold">See temples nearby</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section page-offset">
      <Link to={`/hotels?${params.toString()}`} className="back-link">Back to hotels</Link>
      <h1 className="heading-2 mt-2">{hotel.name}</h1>
      <p className="text-muted-soft">{hotel.area}, {hotel.landmark}. {hotel.distanceKm} km from Tirupati. Rated {hotel.rating.toFixed(1)} from {hotel.reviews} reviews.</p>

      {/* Gallery */}
      <div className="gallery">
        <img className="gallery__main" src={hotel.images[shot].src} alt={hotel.images[shot].caption}
          style={{ objectPosition: hotel.images[shot].pos }} />
        <div className="gallery__thumbs">
          {hotel.images.map((im, i) => (
            <button key={im.caption} type="button" className={i === shot ? 'is-active' : ''}
              aria-label={`Show ${im.caption}`} aria-pressed={i === shot} onClick={() => setShot(i)}>
              <img src={im.src} alt="" style={{ objectPosition: im.pos }} />
            </button>
          ))}
        </div>
      </div>

      <Row className="gx-5 gy-4 mt-2">
        <Col lg="7">
          <h2 className="heading-3">About this stay</h2>
          <p>{hotel.about}</p>
          <ul className="amenities list-unstyled">
            {hotel.amenities.map((a) => <li key={a}>{a}</li>)}
          </ul>

          <h2 className="heading-3 mt-4">Choose your room</h2>
          <Row className="gx-3 gy-2 mb-3">
            <Col xs="6" md="4">
              <Label for="d-in">Check-in</Label>
              <Input id="d-in" type="date" min={today()} value={checkin}
                onChange={(e) => { setParam('checkin', e.target.value); if (e.target.value >= checkout) setParam('checkout', addDays(e.target.value, 1)) }} />
            </Col>
            <Col xs="6" md="4">
              <Label for="d-out">Check-out</Label>
              <Input id="d-out" type="date" min={addDays(checkin, 1)} value={checkout} invalid={!!errors.dates}
                onChange={(e) => setParam('checkout', e.target.value)} />
              <FormFeedback>{errors.dates}</FormFeedback>
            </Col>
            <Col xs="12" md="4">
              <Label for="d-guests">Guests</Label>
              <Input id="d-guests" type="number" min="1" max="8" value={guests} onChange={(e) => setParam('guests', e.target.value)} />
            </Col>
          </Row>

          <ul className="list-unstyled rooms">
            {hotel.rooms.map((r) => {
              const fits = r.max >= guests
              const open = r.left > 0 && fits
              return (
                <li key={r.id} className={`room ${roomId === r.id ? 'is-selected' : ''} ${open ? '' : 'is-off'}`}>
                  <div>
                    <h3 className="heading-3 m-0">{r.name}</h3>
                    <p className="m-0">{r.beds}. Sleeps {r.max}.</p>
                    <small className={r.left > 0 && r.left <= 2 ? 'text-warning' : 'text-muted-soft'}>
                      {r.left === 0 ? 'Sold out for these dates'
                        : !fits ? `Too small for ${guests} guests`
                        : r.left <= 2 ? `Only ${r.left} left` : 'Available'}
                    </small>
                  </div>
                  <div className="room__buy">
                    <strong>{inr(r.price)}</strong><small>per night</small>
                    <Button color="gold" size="sm" disabled={!open || nights < 1} onClick={() => setRoomId(r.id)}>
                      {roomId === r.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
          {errors.room && <p className="text-danger">{errors.room}</p>}
        </Col>

        {/* Step 2: guest details and booking */}
        <Col lg="5">
          <form className="booking" onSubmit={confirm} noValidate>
            <h2 className="heading-3">Guest details</h2>
            <FormGroup>
              <Label for="g-name">Lead guest name</Label>
              <Input id="g-name" value={form.name} onChange={change('name')} invalid={!!errors.name} autoComplete="name" />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <Row className="gx-3">
              <Col sm="6"><FormGroup>
                <Label for="g-phone">Mobile number</Label>
                <Input id="g-phone" type="tel" inputMode="numeric" maxLength={10} value={form.phone}
                  onChange={change('phone')} invalid={!!errors.phone} autoComplete="tel" />
                <FormFeedback>{errors.phone}</FormFeedback>
              </FormGroup></Col>
              <Col sm="6"><FormGroup>
                <Label for="g-email">Email</Label>
                <Input id="g-email" type="email" value={form.email} onChange={change('email')} invalid={!!errors.email} autoComplete="email" />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup></Col>
            </Row>
            <Row className="gx-3">
              <Col sm="5"><FormGroup>
                <Label for="g-idt">ID type</Label>
                <Input id="g-idt" type="select" value={form.idType} onChange={change('idType')}>
                  <option>Aadhaar</option><option>Passport</option><option>Driving licence</option><option>Voter ID</option>
                </Input>
              </FormGroup></Col>
              <Col sm="7"><FormGroup>
                <Label for="g-id">ID number</Label>
                <Input id="g-id" value={form.idNumber} onChange={change('idNumber')} invalid={!!errors.idNumber} />
                <FormFeedback>{errors.idNumber}</FormFeedback>
              </FormGroup></Col>
            </Row>
            <FormGroup>
              <Label for="g-req">Special requests (optional)</Label>
              <Input id="g-req" type="textarea" rows="2" placeholder="Ground floor, early check-in, extra bed" value={form.requests} onChange={change('requests')} />
            </FormGroup>

            <div className="booking__summary">
              <h3 className="heading-3">Price summary</h3>
              {room ? (
                <>
                  <div><span>{room.name}, {nights} {nights === 1 ? 'night' : 'nights'}</span><span>{inr(roomTotal)}</span></div>
                  <div><span>GST ({Math.round(GST_RATE * 100)}%)</span><span>{inr(tax)}</span></div>
                  <div className="booking__total"><span>Total</span><span>{inr(total)}</span></div>
                  <small>{formatDate(checkin)} to {formatDate(checkout)}. Pay at the hotel.</small>
                </>
              ) : <p className="m-0">Select a room to see the price.</p>}
            </div>

            <Button type="submit" color="gold" className="w-100 mt-3">Confirm booking</Button>
          </form>
        </Col>
      </Row>
    </section>
  )
}