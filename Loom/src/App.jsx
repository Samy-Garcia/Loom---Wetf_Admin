import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Reviews from './screens/Reviews'
import Proveedores from './screens/Proveedores'
import Ofertas from './screens/Ofertas'
import Analisis from './screens/Analisis'
import Productos from './screens/Productos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/analisis" />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App