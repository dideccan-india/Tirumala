import { Container } from 'reactstrap'
import '../../styles/components/Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer text-center">
      <Container>
        <strong className="brand brand--sm">Tirumala Yatra</strong>
        <p className="site-footer__text">
          Hotels, rental cars and bikes, temple routes and distances for pilgrims to Tirupati and Tirumala.
        </p>
        <small>© {new Date().getFullYear()} Tirumala Yatra</small>
      </Container>
    </footer>
  )
}