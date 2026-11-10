// Shows one crop of a photo. `pos` is the focus point and `zoom` how far to zoom in.
export default function TempleImage({ src, alt, pos = '50% 50%', zoom = 1, className = '' }) {
  return (
    <div className={`temple-img ${className}`}>
      <img src={src} alt={alt} loading="lazy"
        style={{ objectPosition: pos, transformOrigin: pos, transform: `scale(${zoom})` }} />
    </div>
  )
}