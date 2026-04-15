import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Productos.css'

const productos = [
  { id: 1, nombre: 'Spider Black Leather Jacket', precio: '$169.00', stock: 15, estado: 'Disponible', icon: '🧥' },
  { id: 2, nombre: 'Rhinestones Tracksuit Hoodie', precio: '$157.00', stock: 5, estado: 'Stock Bajo', icon: '👕' },
  { id: 3, nombre: 'Rhinestones Tracksuit Pants', precio: '$157.00', stock: 0, estado: 'Agotado', icon: '👖' },
  { id: 4, nombre: 'Detachable Fur Gray Zip-Up', precio: '$169.00', stock: 7, estado: 'Disponible', icon: '🧥' },
  { id: 5, nombre: 'Fur Zip-Up Spider', precio: '$135.00', stock: 12, estado: 'Disponible', icon: '🧥' },
  { id: 6, nombre: 'Black Leather Jacket', precio: '$189.00', stock: 3, estado: 'Stock Bajo', icon: '🧥' },
]

const estadoClass = {
  Disponible: 'badge-disponible',
  'Stock Bajo': 'badge-stockbajo',
  Agotado: 'badge-agotado',
}

function Productos() {
  const [search, setSearch] = useState('')

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Productos</h1>
            <button className="btn-add">+ Nuevo Producto</button>
          </div>

          {/* Buscador */}
          <div className="search-box-lg">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="stats-grid-4">
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">👥</div>
                <span className="stat-edit">✏️</span>
              </div>
              <div className="stat-number-p">32</div>
              <div className="stat-label-p">Total Productos</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">📦</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">$13,450</div>
              <div className="stat-label-p">Productos</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box red">🚫</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">2</div>
              <div className="stat-label-p">Productos Agotados</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">💲</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">$13,450</div>
              <div className="stat-label-p">Valor del Inventario</div>
            </div>
          </div>

          {/* Tabla */}
          <div className="tabla-card">
            <h2 className="section-title">Ofertas</h2>
            <table className="productos-table">
              <thead>
                <tr>
                  <th>NOMBRE PRODUCTO</th>
                  <th>PRECIO ▼</th>
                  <th>STOCK MÍN.</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN ▼</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="producto-info">
                        <div className="producto-img-box">{p.icon}</div>
                        <span className="producto-nombre">{p.nombre}</span>
                      </div>
                    </td>
                    <td>{p.precio}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`badge-estado ${estadoClass[p.estado]}`}>
                        • {p.estado}
                      </span>
                    </td>
                    <td>
                      <button className="btn-editar">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Productos