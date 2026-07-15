import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { path: '/analisis', label: 'Análisis', icon: '' },
  { path: '/productos', label: 'Productos', icon: '' },
  { path: '/categorias', label: 'Categorías', icon: '' },
  { path: '/inventario', label: 'Inventario', icon: '' },
  { path: '/pedidos', label: 'Pedidos', icon: '' },
  { path: '/proveedores', label: 'Proveedores', icon: '' },
  { path: '/usuarios', label: 'Usuarios', icon: '' },
  { path: '/reviews', label: 'Reviews', icon: '' },
]

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Elimina la cookie de sesión del admin
    document.cookie = 'authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">LØØM & WEFT</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <span>Cerrar Sesión</span>
      </div>
    </aside>
  )
}

export default Sidebar
