import { useState } from 'react'
import { Link, NavLink as RouterLink } from 'react-router-dom'
import { Nav, NavItem, NavLink, Button, Container } from 'reactstrap'
import HeaderActions from './HeaderActions'
import '../../styles/components/Header.css'

const links = [
  ['/hotels', 'Hotels'], ['/cars', 'Cars'], ['/bikes', 'Bikes'],
  ['/temples', 'Temples'], ['/map', 'Map'],
]

// ready=false while the intro plays: the name stays hidden because the
// intro title flies to this exact spot (#header-brand) and then takes over.
export default function Header({ ready }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-header">
      <Container fluid className="site-header__bar px-gutter">
        <Link to="/" className="site-header__brand" onClick={close}>
          <span id="header-brand" className={`brand ${ready ? '' : 'is-hidden'}`}>Tirumala Yatra</span>
        </Link>

        <Button outline color="gold" size="sm" className="site-header__toggle"
          aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </Button>

        <nav className={`site-header__nav ${open ? 'is-open' : ''} ${ready ? '' : 'is-hidden'}`}>
          <Nav>
            {links.map(([to, label]) => (
              <NavItem key={to}>
                <NavLink tag={RouterLink} to={to} onClick={close}>{label}</NavLink>
              </NavItem>
            ))}
          </Nav>
         <HeaderActions onNavigate={close} />
        </nav>
      </Container>
    </header>
  )
}