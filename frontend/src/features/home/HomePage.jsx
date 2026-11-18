import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Col, FormGroup, Input, Label, Nav, NavItem, NavLink, Row, Button } from 'reactstrap'
import templeImg from '../../assets/images/animation.png'
import '../../styles/components/Homepage.css'

const tabs = {
  hotels: { label: 'Hotels', to: '/hotels',
    fields: [['Area', 'text'], ['Check-in', 'date'], ['Check-out', 'date'], ['Guests', 'number']] },
  cars: { label: 'Cars', to: '/cars',
    fields: [['Pickup point', 'text'], ['Pickup date', 'date'], ['Return date', 'date'], ['Seats', 'number']] },
  bikes: { label: 'Bikes', to: '/bikes',
    fields: [['Pickup point', 'text'], ['Pickup date', 'date'], ['Return date', 'date'], ['Bikes', 'number']] },
}

const services = [
  ['Hotels and lodges', 'Stay in Tirupati or Tirumala, sorted by distance from the temple.', '/hotels'],
  ['Rental cars', 'Cars with or without a driver for the ghat road and temple circuits.', '/cars'],
  ['Rental bikes', 'Scooters and bikes by the day, with helmets included.', '/bikes'],
  ['Temples and distances', 'Every nearby shrine with travel time from where you are staying.', '/temples'],
  ['Map and directions', 'Open any place in maps and get directions in one tap.', '/map'],
]

// Approximate road distances from Tirupati. Replace with real data from your API.
const temples = [
  ['Kapila Theertham', '4 km'],
  ['Sri Padmavathi Temple, Tiruchanoor', '5 km'],
  ['Srinivasa Mangapuram', '12 km'],
  ['Sri Venkateswara Temple, Tirumala', '22 km'],
  ['Srikalahasti', '36 km'],
]

export default function HomePage() {
  const [tab, setTab] = useState('hotels')
  const active = tabs[tab]

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${templeImg})` }}>
        <div className="hero__inner">
          <h2 className="heading-1">Plan your Tirumala trip, from stay to darshan</h2>
          <p className="lead-text">Book hotels, hire a car or bike, and see every temple and distance in one place.</p>

          <Card className="search border-0">
            <Nav tabs fill className="search__tabs">
              {Object.entries(tabs).map(([key, { label }]) => (
                <NavItem key={key}>
                  <NavLink active={tab === key} onClick={() => setTab(key)}>{label}</NavLink>
                </NavItem>
              ))}
            </Nav>
            <CardBody>
            <Row className="search__fields gx-3 gy-0">
  {active.fields.map(([label, type]) => (
    <Col key={`${tab}-${label}`} xs="6" md>
      <Label>{label}</Label>
      <Input type={type} placeholder={label} />
    </Col>
  ))}
  <Col xs="12" md="auto">
    <Label className="invisible d-none d-md-block">Search</Label>
    <Button tag={Link} to={active.to} color="gold" className="w-100">
      Search {active.label.toLowerCase()}
    </Button>
  </Col>
</Row>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="section">
        <h2 className="heading-2">Everything for the journey</h2>
        <ul className="services list-unstyled">
          {services.map(([title, text, to]) => (
            <li key={to}>
              <Link to={to}><h3 className="heading-3 m-0">{title}</h3><p>{text}</p></Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--dark">
        <h2 className="heading-2">Temples near Tirupati</h2>
        <p className="text-muted-soft">Approximate road distance from Tirupati.</p>
        <ul className="distances list-unstyled mb-4">
          {temples.map(([name, km]) => (
            <li key={name}><span>{name}</span><span className="distances__dots" /><b>{km}</b></li>
          ))}
        </ul>
        <Button tag={Link} to="/temples" color="gold">See all temples</Button>
      </section>
    </>
  )
}