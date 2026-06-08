import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import './Analisis.css'

const API = 'http://localhost:4000/api'

const periodMap = {
  'Día': 'day',
  'Semana': 'week',
  'Mes': 'month',
  'Max': 'month',
  'Dia': 'day',
}

function Analisis() {
  const [tabVentas, setTabVentas] = useState('Mes')
  const [tabIngresos, setTabIngresos] = useState('Dia')

  const [stats, setStats] = useState(null)
  const [ventasData, setVentasData] = useState([])
  const [ingresosData, setIngresosData] = useState([])
  const [productosMasVendidos, setProductosMasVendidos] = useState([])
  const [sinStock, setSinStock] = useState([])
  const [ultimosPedidos, setUltimosPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  // Stats generales
  useEffect(() => {
    fetch(`${API}/orders/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  // Gráfica de ventas — se recarga al cambiar tab
  useEffect(() => {
    const period = periodMap[tabVentas] || 'month'
    fetch(`${API}/orders/sales?period=${period}`)
      .then(r => r.json())
      .then(setVentasData)
      .catch(console.error)
  }, [tabVentas])

  // Gráfica de ingresos — se recarga al cambiar tab
  useEffect(() => {
    const period = periodMap[tabIngresos] || 'day'
    fetch(`${API}/orders/revenue?period=${period}`)
      .then(r => r.json())
      .then(setIngresosData)
      .catch(console.error)
  }, [tabIngresos])

  // Productos + sin stock
  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(products => {
        // Sin stock
        setSinStock(products.filter(p => p.stock === 0))
        // Más vendidos: ordenar por campo sold si existe, si no mostrar los primeros
        const sorted = [...products]
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 3)
        setProductosMasVendidos(sorted)
      })
      .catch(console.error)
  }, [])

  // Últimos pedidos
  useEffect(() => {
    fetch(`${API}/orders?limit=4`)
      .then(r => r.json())
      .then(orders => {
        setUltimosPedidos(orders)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (n) =>
    n !== undefined && n !== null
      ? `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
      : '$0'

  const fmtDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          {/* Header */}
          <div className="analisis-header">
            <div>
              <h1 className="analisis-titulo">Hola, Admin</h1>
              <p className="analisis-sub">Aquí tienes un resumen de las estadísticas de la tienda</p>
            </div>
            <button className="btn-add">+ Añadir Proveedor</button>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="stats-top">
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">📈</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-card-label">Ventas del día</div>
              <div className="stat-card-number">
                {stats ? fmt(stats.ventasHoy) : '—'}
              </div>
              <div className="stat-card-sub">Ventas de hoy</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box green">💲</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-card-label">Ventas del mes</div>
              <div className="stat-card-number">
                {stats ? fmt(stats.ventasMes) : '—'}
              </div>
              <div className="stat-card-sub green-text">
                {stats ? `+ ${stats.crecimientoMes}%` : '—'}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box orange">🛒</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-card-label">Pedidos en ruta</div>
              <div className="stat-card-number">
                {stats ? stats.pedidosEnRuta : '—'}
              </div>
              <div className="stat-card-sub green-text">en ruta ahora</div>
            </div>
          </div>

          {/* Ventas + Sin stock */}
          <div className="analisis-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h2 className="section-title">Ventas</h2>
                <div className="tab-group">
                  {['Día', 'Semana', 'Mes', 'Max'].map(t => (
                    <button
                      key={t}
                      className={tabVentas === t ? 'tab-btn active' : 'tab-btn'}
                      onClick={() => setTabVentas(t)}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ventasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="sin-stock-card">
              <h2 className="section-title">Productos sin stock</h2>
              {sinStock.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>No hay productos sin stock</p>
              ) : (
                sinStock.slice(0, 3).map((p, i) => (
                  <div key={i} className="sin-stock-item">
                    <div className="sin-stock-img">
                      {p.images?.[0]?.image
                        ? <img src={p.images[0].image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                        : '📦'}
                    </div>
                    <div>
                      <div className="sin-stock-nombre">{p.name}</div>
                      <div className="sin-stock-code">{p.sub_type || p.product_type || ''}</div>
                      <a href="#" className="sin-stock-link">Reabastecer →</a>
                    </div>
                  </div>
                ))
              )}
              {productosMasVendidos[0] && (
                <div className="ultimos-exitos">
                  <div className="exitos-title">Últimos éxitos</div>
                  <div className="exitos-sub">#1 {productosMasVendidos[0].name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Productos más vendidos + Últimos pedidos */}
          <div className="analisis-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h2 className="section-title">Productos más vendidos</h2>
                <a href="#" className="ver-mas">Ver todo →</a>
              </div>
              {productosMasVendidos.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Cargando productos...</p>
              ) : (
                productosMasVendidos.map((prod, i) => (
                  <div key={i} className="prod-vendido-row">
                    <div className="prod-vendido-img">
                      {prod.images?.[0]?.image
                        ? <img src={prod.images[0].image} alt={prod.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                        : '🛍️'}
                    </div>
                    <div className="prod-vendido-info">
                      <div className="prod-vendido-nombre">{prod.name}</div>
                      <div className="prod-vendido-precio">${prod.price?.toFixed(2)}</div>
                    </div>
                    <div className="prod-vendido-cant">
                      <div className="prod-vendido-num">{prod.sold ?? '—'}</div>
                      <div className="prod-vendido-sold">sold</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h2 className="section-title">Últimos Pedidos</h2>
                <a href="#" className="ver-mas">VER TODOS →</a>
              </div>
              {loading ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Cargando pedidos...</p>
              ) : ultimosPedidos.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>No hay pedidos aún</p>
              ) : (
                ultimosPedidos.map((ped, i) => (
                  <div key={i} className="pedido-row">
                    <div className="pedido-avatar">
                      {ped.client?.name?.[0]?.toUpperCase() || '👤'}
                    </div>
                    <div className="pedido-info">
                      <div className="pedido-id">#{ped._id?.slice(-5).toUpperCase()}</div>
                      <div className="pedido-fecha">{fmtDate(ped.createdAt)}</div>
                    </div>
                    <div className="pedido-right">
                      <div className="pedido-total">{fmt(ped.total)}</div>
                      <button className="btn-editar-sm">Editar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ingresos Mensuales */}
          <div className="chart-card" style={{ marginTop: '20px' }}>
            <div className="chart-header">
              <div>
                <h2 className="section-title">Ingresos Mensuales</h2>
                <div className="ingresos-total">
                  {stats ? fmt(stats.ventasMes) : '—'}
                </div>
                <div className="ingresos-sub">Total del mes actual</div>
              </div>
              <div className="tab-group">
                {['Dia', 'Semana', 'Mes'].map(t => (
                  <button
                    key={t}
                    className={tabIngresos === t ? 'tab-btn active' : 'tab-btn'}
                    onClick={() => setTabIngresos(t)}
                  >{t}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ingresosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Analisis