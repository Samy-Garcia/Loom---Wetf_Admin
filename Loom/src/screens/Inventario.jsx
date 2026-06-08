import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Inventario.css'

const API = 'http://localhost:4000/api'

const estadoClass = {
  'Stock bajo': 'badge-stockbajo',
  'Agotado': 'badge-agotado',
  'Disponible': 'badge-disponible',
}

function getEstado(stock) {
  if (stock === 0) return 'Agotado'
  if (stock <= 7) return 'Stock bajo'
  return 'Disponible'
}

function Inventario() {
  const [search, setSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [productos, setProductos] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/products`).then(r => r.json()),
      fetch(`${API}/suppliers`).then(r => r.json()),
    ])
      .then(([prods, sups]) => {
        setProductos(prods)
        setSuppliers(sups)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Stats calculadas desde los datos reales
  const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0)
  const agotados = productos.filter(p => p.stock === 0).length
  const bajoInventario = productos.filter(p => p.stock > 0 && p.stock <= 7).length

  // Categorías únicas desde los productos
  const categorias = [...new Set(productos.map(p => p.product_type).filter(Boolean))]

  const maxStock = productos.length > 0 ? Math.max(...productos.map(p => p.stock || 0), 1) : 20

  const filtrados = productos.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoriaActiva ? p.product_type === categoriaActiva : true
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
              <div className="stat-number-p">{loading ? '—' : totalStock}</div>
              <div className="stat-label-p">Productos en Stock</div>
              <div className="stat-sub-p">Unidades totales disponibles</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box orange">📦</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">{loading ? '—' : agotados}</div>
              <div className="stat-label-p">Agotados</div>
              <div className="stat-sub-p">Sin unidades disponibles</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box orange">⚠️</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">{loading ? '—' : bajoInventario}</div>
              <div className="stat-label-p">Bajo Inventario</div>
              <div className="stat-sub-p">7 unidades o menos</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">🏢</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-number-p">{loading ? '—' : suppliers.length}</div>
              <div className="stat-label-p">Proveedores</div>
              <div className="stat-sub-p">Proveedores registrados</div>
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
                <button className="cat-btn-icon">☰</button>
              </div>
            </div>

            {/* Tabla */}
            {loading ? (
              <p style={{ color: '#94a3b8', padding: '20px 0' }}>Cargando inventario...</p>
            ) : (
              <table className="inventario-table">
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th>STOCK</th>
                    <th>CATEGORÍA</th>
                    <th>ACCIONES ▼</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(p => {
                    const estado = getEstado(p.stock || 0)
                    const barWidth = Math.min((p.stock / maxStock) * 100, 100)
                    const barColor = p.stock === 0 ? '#e2e8f0' : p.stock <= 7 ? '#f59e0b' : '#3b82f6'
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="producto-info">
                            <div className="producto-img-box">
                              {p.images?.[0]?.image
                                ? <img src={p.images[0].image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                                : '📦'}
                            </div>
                            <span className="producto-nombre">{p.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="stock-cell">
                            <span className="stock-num">{p.stock ?? 0}</span>
                            <div className="stock-bar-wrap">
                              <div
                                className="stock-bar-fill"
                                style={{ width: `${barWidth}%`, backgroundColor: barColor }}
                              />
                            </div>
                            <span className={`badge-estado ${estadoClass[estado]}`}>
                              {estado}
                            </span>
                          </div>
                        </td>
                        <td className="comentarios-cell">
                          <div>{p.product_type || '—'}</div>
                          {p.sub_type && <div style={{ color: '#94a3b8', fontSize: 12 }}>{p.sub_type}</div>}
                          <div style={{ fontWeight: 500 }}>${p.price?.toFixed(2)}</div>
                        </td>
                        <td>
                          <button className="btn-editar">Editar</button>
                        </td>
                      </tr>
                    )
                  })}
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>
                        No se encontraron productos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Inventario