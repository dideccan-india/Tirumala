export default function CarImage({ car, className = '' }) {
  return (
    <div className={`car-img ${className}`}>
      <img src={car.img} alt={car.name} loading="lazy"
        style={{ objectPosition: car.pos, transformOrigin: car.pos, transform: `scale(${car.zoom})` }} />
    </div>
  )
}