import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Inventario.css'

const productos = [
  {
    id: 1, nombre: 'Spider Black Leather Jacket', icon: '🧥',
    stock: 15, maxStock: 20, estado: 'Stock bajo',
    comentarios: '$197 cot', categoria: 'Hombre'
  },
  {
    id: 2, nombre: 'Rhinestones Tracksuit Hoodie', icon: '👕',
    stock: 5, maxStock: 20, estado: 'Agotado',
    comentarios: '1 May 2024\nHasta el 1 May 2024', categoria: 'Mujer'
  },
  {
    id: 3, nombre: 'Rhinestones Tracksuit Pants', icon: '👖',
    stock: 0, maxStock: 20, estado: 'Agotado',
    comentarios: '1 May 2024\n$59.00\nHasta el 1 May 2024', categoria: 'Hombre'
  },
  {
    id: 4, nombre: 'Detachable Fur Gray Zip-Up', icon: '🧥',
    stock: 7, maxStock: 20, estado: 'Stock bajo',
    comentarios: '7 May 2024\n$169.00', categoria: 'Accesorios'
  },
  {
    id: 5, nombre: 'Fur Zip-Up Spider', icon: '🧥',
    stock: 12, maxStock: 20, estado: 'Disponible',
    comentarios: '$135.00', categoria: 'Mujer'
  },
]

const estadoClass = {
  'Stock bajo': 'badge-stockbajo',
  'Agotado': 'badge-agotado',
  'Disponible': 'badge-disponible',
}

const categorias = ['Hombre', 'Mujer', 'Accesorios']

function Inventario() {
  const [search, setSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState(null)

  const filtrados = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoriaActiva ? p.categoria === categoriaActiva : true
    return matchSearch && matchCat
  })

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Inventario</h1>
            <button className="btn-add">+ Añadir Producto</button>
          </div>

          {/* Tarjetas */}
          <div className="stats-grid-4">
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">👥</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">320</div>
              <div className="stat-label-p">Productos en Stock</div>
              <div className="stat-sub-p">Tienda del día alertas</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box orange">📦</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">15</div>
              <div className="stat-label-p">Agotados</div>
              <div className="stat-sub-p">Bajo cantidad</div>
              <div className="stat-trend green">+ 33%</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box orange">⚠️</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">7</div>
              <div className="stat-label-p">Bajo Inventario</div>
              <div className="stat-sub-p">Bajo cantidad</div>
              <div className="stat-trend green">+ 25%</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">🏢</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">5</div>
              <div className="stat-label-p">5 Proveedores</div>
              <div className="stat-sub-p">Negocios proveedor Proporcionistas</div>
              <div className="stat-trend red">+ 1 ↑</div>
            </div>
          </div>

          {/* Tabla de inventario */}
          <div className="tabla-card">
            <h2 className="section-title">Inventario</h2>

            {/* Buscador y filtros */}
            <div className="inv-filtros">
              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filtros-cats">
                {categorias.map(cat => (
                  <button
                    key={cat}
                    className={categoriaActiva === cat ? 'cat-btn active' : 'cat-btn'}
                    onClick={() => setCategoriaActiva(categoriaActiva === cat ? null : cat)}
                  >
                    {cat}
                  </button>
                ))}
                <button className="cat-btn">por (Baida Gis</button>
                <button className="cat-btn-icon">☰</button>
              </div>
            </div>

            {/* Tabla */}
            <table className="inventario-table">
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>STOCK</th>
                  <th>COMENTARIOS</th>
                  <th>ACCIONES ▼</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="producto-info">
                        <div className="producto-img-box">{p.icon}</div>
                        <span className="producto-nombre">{p.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stock-cell">
                        <span className="stock-num">{p.stock}</span>
                        <div className="stock-bar-wrap">
                          <div
                            className="stock-bar-fill"
                            style={{
                              width: `${(p.stock / p.maxStock) * 100}%`,
                              backgroundColor: p.stock === 0 ? '#e2e8f0' : p.stock <= 5 ? '#f59e0b' : '#3b82f6'
                            }}
                          ></div>
                        </div>
                        <span className={`badge-estado ${estadoClass[p.estado]}`}>
                          {p.estado}
                        </span>
                      </div>
                    </td>
                    <td className="comentarios-cell">
                      {p.comentarios.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
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

export default Inventario