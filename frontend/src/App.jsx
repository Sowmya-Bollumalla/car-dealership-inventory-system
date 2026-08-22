import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { VehicleProvider } from './context/VehicleContext'

import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import AddVehicle from './pages/AddVehicle'

function App() {
  return (
    <BrowserRouter>
      <VehicleProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
        </Routes>
      </VehicleProvider>
    </BrowserRouter>
  )
}

export default App