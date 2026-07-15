import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './screens/Login'
import Register from './screens/Register'
import Analisis from './screens/Analisis'
import Reviews from './screens/Reviews'
import Proveedores from './screens/Proveedores'
import Ofertas from './screens/Ofertas'
import Productos from './screens/Productos'
import Inventario from './screens/Inventario'
import Pedidos from './screens/Pedidos'
import Usuarios from './screens/Usuarios'
import Categorias from './screens/Categorias'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/analisis" element={<ProtectedRoute><Analisis /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
        <Route path="/ofertas" element={<ProtectedRoute><Ofertas /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
        <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
        <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        <Route path="/categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
