import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Row, Col, Input, Label, Button } from 'reactstrap'
import places, { categories } from './templesData'
import TempleImage from './TempleImage'
import '../../styles/components/Hotels.css'
import '../../styles/components/Cars.css'
import '../../styles/components/Temples.css'

export default function TemplesPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'distance'
  const maxKm = Number(params.get('maxKm') ?? 60)

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    v === '' || v == null ? next.delete(k) : next.set(k, v)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    return places
      .filter((p) => (!category || p.category === category) && p.distanceKm <= maxKm &&
        (!term || `${p.name} ${p.about}`.toLowerCase().includes(term)))
      .sort(sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => a.distanceKm - b.distanceKm)
  }, [q, category, sort, maxKm])

  return (
    <section className="section page-offset">
      <h1 className="heading-2">Temples and places to visit</h1>
      <p className="text-muted-soft">Temples in Tirumala and Tirupati, and sights nearby. Distances are by road from Tirupati.</p>

      <div className="hotel-bar">
        <Row className="gx-3 gy-2">
          <Col xs="12" md="6">
            <Label for="q">Search places</Label>
            <Input id="q" placeholder="Try Kapila, fort or waterfall" value={q} onChange={(e) => set('q', e.target.value)} />
          </Col>
          <Col xs="6" md="3">
            <Label for="maxKm">Within: <b>{maxKm} km</b></Label>
            <Input id="maxKm" type="range" min="5" max="60" step="5" value={maxKm} onChange={(e) => set('maxKm', e.target.value)} />
          </Col>
          <Col xs="6" md="3">
            <Label for="sort">Sort by</Label>
            <Input id="sort" type="select" value={sort} onChange={(e) => set('sort', e.target.value)}>
              <option value="distance">Nearest first</option>
              <option value="name">Name, A to Z</option>
            </Input>
          </Col>
        </Row>
      </div>

      <div className="type-pills" role="group" aria-label="Category">
        {['', ...categories].map((c) => (
          <button key={c || 'all'} type="button" aria-pressed={category === c}
            className={category === c ? 'is-active' : ''} onClick={() => set('category', c)}>
            {c || 'All places'}
          </button>
        ))}
      </div>

      <p className="hotel-count mt-3" aria-live="polite">
        {results.length} {results.length === 1 ? 'place' : 'places'}
      </p>

      {results.length === 0 && (
        <div className="hotel-empty">
          <h3 className="heading-3">No places match</h3>
          <p>Try a different word, or increase the distance.</p>
          <Button color="gold" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>
        </div>
      )}

      <ul className="list-unstyled hotel-list">
        {results.map((p) => (
          <li key={p.id} className="hotel-card">
            <TempleImage src={p.img} alt={p.name} className="hotel-card__img" />
            <div className="hotel-card__body">
              <div className="d-flex justify-content-between gap-2">
                <h3 className="heading-3 m-0">{p.name}</h3>
                <span className="car-type">{p.category}</span>
              </div>
              <p className="hotel-card__where">{p.distanceKm} km from Tirupati, about {p.travelMins} min by road</p>
              <p className="hotel-card__amenities">{p.about}</p>
              <div className="hotel-card__foot">
                <div><small className="d-block">Timings: {p.timings[0][1]}</small>
                  <small className="d-block">Time needed: {p.visitTime}</small></div>
                <Button tag={Link} to={`/temples/${p.id}`} color="gold" size="sm">View details</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}