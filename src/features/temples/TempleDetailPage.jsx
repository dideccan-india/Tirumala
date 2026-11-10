import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'
import places, { getPlace, directionsUrl } from './templesData'
import TempleImage from './TempleImage'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'
import '../../styles/components/Temples.css'

export default function TempleDetailPage() {
  const { id } = useParams()
  const place = getPlace(id)
  const [shot, setShot] = useState(0)

  if (!place) {
    return (
      <section className="section page-offset">
        <h1 className="heading-2">Place not found</h1>
        <Button tag={Link} to="/temples" color="gold">Back to temples</Button>
      </section>
    )
  }

  const current = place.images[shot]
  const more = places
    .filter((p) => p.id !== place.id && p.category === place.category)
    .sort((a, b) => Math.abs(a.distanceKm - place.distanceKm) - Math.abs(b.distanceKm - place.distanceKm))
    .slice(0, 3)
  const area = place.category === 'Tirumala' ? 'Tirumala' : 'Tirupati'

  return (
    <section className="section page-offset">
      <Link to="/temples" className="back-link">Back to temples</Link>
      <h1 className="heading-2 mt-2">{place.name}</h1>
      <p className="text-muted-soft">{place.category}. {place.distanceKm} km from Tirupati, about {place.travelMins} min by road.</p>

      <div className="gallery">
        <TempleImage src={place.img} alt={current.caption} pos={current.pos} zoom={current.zoom} className="temple-hero" />
        <div className="gallery__thumbs">
          {place.images.map((im, i) => (
            <button key={im.caption} type="button" className={i === shot ? 'is-active' : ''}
              aria-label={`Show ${im.caption}`} aria-pressed={i === shot} onClick={() => setShot(i)}>
              <TempleImage src={place.img} alt="" pos={im.pos} zoom={im.zoom} />
            </button>
          ))}
        </div>
      </div>

      <Row className="gx-5 gy-4 mt-2">
        <Col lg="7">
          <h2 className="heading-3">About</h2>
          <p>{place.about}</p>

          <h2 className="heading-3 mt-4">What to see</h2>
          <ul className="included list-unstyled">
            {place.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>

          <h2 className="heading-3 mt-4">Tips for your visit</h2>
          <ul className="included list-unstyled">
            {place.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>

          {more.length > 0 && (<>
            <h2 className="heading-3 mt-4">More places nearby</h2>
            <ul className="list-unstyled more-places">
              {more.map((p) => (
                <li key={p.id}>
                  <Link to={`/temples/${p.id}`}><b>{p.name}</b><span>{p.distanceKm} km from Tirupati</span></Link>
                </li>
              ))}
            </ul>
          </>)}
        </Col>

        <Col lg="5">
          <aside className="booking temple-info" aria-label="Visitor information">
            <h2 className="heading-3">Visitor information</h2>
            <dl>
              <div><dt>Timings</dt><dd>{place.timings.map(([l, t]) => <span key={l} className="d-block">{l}: {t}</span>)}</dd></div>
              <div><dt>Entry</dt><dd>{place.entry}</dd></div>
              <div><dt>Dress code</dt><dd>{place.dress}</dd></div>
              <div><dt>Best time</dt><dd>{place.bestTime}</dd></div>
              <div><dt>Time needed</dt><dd>{place.visitTime}</dd></div>
              <div><dt>Distance</dt><dd>{place.distanceKm} km from Tirupati, about {place.travelMins} min by road</dd></div>
            </dl>
            <p className="temple-info__note">Timings are approximate and change on festival days. Check with TTD (tirumala.org) before you travel.</p>

            <div className="d-grid gap-2">
              <Button tag="a" href={directionsUrl(place.mapQuery)} target="_blank" rel="noopener noreferrer" color="gold">Get directions</Button>
              <Button tag={Link} to={`/hotels?q=${area}`} outline color="gold">Find hotels in {area}</Button>
              <Button tag={Link} to="/cars" outline color="gold">Hire a car for the trip</Button>
              <Button tag={Link} to="/bikes" outline color="gold">Rent a bike</Button>
            </div>
          </aside>
        </Col>
      </Row>
    </section>
  )
}