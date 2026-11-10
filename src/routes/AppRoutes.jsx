import { Routes, Route } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import HotelsPage from '../features/hotels/HotelsPage'
import HotelDetailPage from '../features/hotels/HotelDetailPage'
import CarsPage from '../features/cars/CarsPage'
import CarDetailPage from '../features/cars/CarDetailPage'
import BikesPage from '../features/bikes/BikesPage'
import BikeDetailPage from '../features/bikes/BikeDetailPage'
import TemplesPage from '../features/temples/TemplesPage'
import TempleDetailPage from '../features/temples/TempleDetailPage'
import MapPage from '../features/map/MapPage'
import LoginPage from '../features/auth/LoginPage'     
import SignupPage from '../features/auth/SignupPage'

const ComingSoon = ({ title }) => (
  <section className="section page-offset">
    <h1 className="heading-2">{title}</h1>
    <p>This page is coming next.</p>
  </section>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:id" element={<HotelDetailPage />} />
      <Route path="/cars" element={<CarsPage />} />
      <Route path="/cars/:id" element={<CarDetailPage />} />
      <Route path="/bikes" element={<BikesPage />} />
      <Route path="/bikes/:id" element={<BikeDetailPage />} />
      <Route path="/temples" element={<TemplesPage />} />
      <Route path="/temples/:id" element={<TempleDetailPage />} />
      <Route path="/map" element={<MapPage />} />
       <Route path="/login" element={<LoginPage />} />     
      <Route path="/signup" element={<SignupPage />} /> 
    </Routes>
  )
}