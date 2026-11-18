export default function BikeImage({ bike, className = '' }) {
  return (
    <div className={`bike-img ${className}`}>
      <img src={bike.img} alt={bike.name} loading="lazy" />
    </div>
  )
}