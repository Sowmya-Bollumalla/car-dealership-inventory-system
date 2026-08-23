import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { VehicleProvider } from './context/VehicleContext'
import { WishlistProvider } from './context/WishlistContext'

import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import AddVehicle from './pages/AddVehicle'
import EditVehicle from './pages/EditVehicle'
import Wishlist from './pages/Wishlist'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VehicleProvider>
          <WishlistProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/add-vehicle" element={<AddVehicle />} />
              <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </WishlistProvider>
        </VehicleProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
