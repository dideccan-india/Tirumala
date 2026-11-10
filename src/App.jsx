import { useEffect, useState } from 'react'
import IntroAnimation from './components/intro/IntroAnimation.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  // false on every load, so the intro plays on every reload
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden'
  }, [introDone])

  return (
    <>
      <Header ready={introDone} />
      <main><AppRoutes /></main>
      <Footer />
      {!introDone && <IntroAnimation onDone={() => setIntroDone(true)} />}
    </>
  )
}