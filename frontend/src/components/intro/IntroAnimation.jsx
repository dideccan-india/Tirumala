import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from 'reactstrap'
import templeImg from '../../assets/images/animation.png'
import '../../styles/components/IntroAnimation.css'

const NAME = 'Tirumala Yatra'
const FLY_AT = 4800 // ms: when the name starts flying to the header
const EASE = [0.16, 1, 0.3, 1]

const word = { hidden: {}, show: { transition: { delayChildren: 1.4, staggerChildren: 0.08 } } }
const letter = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function IntroAnimation({ onDone }) {
  const titleRef = useRef(null)
  const started = useRef(false)
  const [fly, setFly] = useState(null)

  const startFly = () => {
    if (started.current) return
    started.current = true
    const from = titleRef.current?.getBoundingClientRect()
    const to = document.getElementById('header-brand')?.getBoundingClientRect()
    if (!from || !to) return onDone()
    setFly({ x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width })
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(onDone, 300)
      return () => clearTimeout(t)
    }
    const t = setTimeout(startFly, FLY_AT)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="intro">
      {/* background layer fades away while the name flies up, revealing the page */}
      <motion.div className="intro__bg" animate={{ opacity: fly ? 0 : 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}>
        <motion.img src={templeImg} alt="" className="intro__photo"
          initial={{ scale: 1.3 }} animate={{ scale: 1 }}
          transition={{ duration: 6, ease: EASE }} />
        <motion.div className="intro__cover" initial={{ opacity: 1 }} animate={{ opacity: 0 }}
          transition={{ duration: 3, ease: 'easeOut' }} />
        <motion.div className="intro__sheen" style={{ skewX: -18 }}
          initial={{ x: '-120%' }} animate={{ x: '260%' }}
          transition={{ delay: 0.8, duration: 2.6, ease: 'easeInOut' }} />
        <div className="intro__shade" />
      </motion.div>

      <div className="intro__title">
        <motion.div style={{ transformOrigin: '0 0' }}
          animate={fly ? { x: fly.x, y: fly.y, scale: fly.scale } : { x: 0, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => fly && onDone()}>
          <motion.h1 ref={titleRef} className="brand brand--intro" aria-label={NAME}
            variants={word} initial="hidden" animate="show">
            {NAME.split('').map((ch, i) => (
              <motion.span key={i} variants={letter} className="intro__letter" aria-hidden="true">
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        <motion.span className="intro__line" initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: fly ? 0 : 1 }}
          transition={fly ? { duration: 0.3 } : { delay: 3.1, duration: 0.8, ease: EASE }} />
        <motion.p className="intro__tag" initial={{ opacity: 0 }} animate={{ opacity: fly ? 0 : 1 }}
          transition={fly ? { duration: 0.3 } : { delay: 3.5, duration: 0.8 }}>
          Govinda, Govinda
        </motion.p>
      </div>

      {!fly && (
        <Button outline color="gold" size="sm" className="intro__skip" onClick={startFly}>Skip</Button>
      )}
    </div>
  )
}