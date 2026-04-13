import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { path: '/analisis', label: 'Análisis', icon: '📊' },
  { path: '/productos', label: 'Productos', icon: '📦' },
  { path: '/ofertas', label: 'Ofertas', icon: '🏷️' },
  { path: '/inventario', label: 'Inventario', icon: '🗃️' },
  { path: '/proveedores', label: 'Proveedores', icon: '👥' },
  { path: '/reviews', label: 'Reviews', icon: '⭐' },
]

function Sidebar() {
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
      <div className="sidebar-logout">
        <span>🚪</span>
        <span>Cerrar Sesión</span>
      </div>
    </aside>
  )
}

export default Sidebar