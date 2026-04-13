import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import './Analisis.css'

const ventasData = [
  { fecha: 'Apr 6', valor: 1900 },
  { fecha: 'Apr 8', valor: 1800 },
  { fecha: 'Apr 10', valor: 2100 },
  { fecha: 'Apr 11', valor: 2650 },
  { fecha: 'Apr 12', valor: 2700 },
  { fecha: 'Apr 13', valor: 2400 },
  { fecha: 'Apr 15', valor: 3100 },
  { fecha: 'Apr 16', valor: 2900 },
  { fecha: 'Apr 17', valor: 3600 },
]

const ingresosData = [
  { fecha: 'Apr 6', ingresos: 5000 },
  { fecha: 'Apr 8', ingresos: 12000 },
  { fecha: 'Apr 10', ingresos: 18000 },
  { fecha: 'Apr 11', ingresos: 14000 },
  { fecha: 'Apr 12', ingresos: 16000 },
  { fecha: 'Apr 14', ingresos: 35000 },
  { fecha: 'Apr 15', ingresos: 42000 },
]

const productosMasVendidos = [
  { nombre: 'Spider Black Leather Jacket', precio: '$169.00', vendidos: 34, icon: '🧥' },
  { nombre: 'Rhinestones Tracksuit Pants', precio: '$157.00', vendidos: 29, icon: '👖' },
  { nombre: 'Rhinestones Tracksuit Hoodie', precio: '$157.00', vendidos: 29, icon: '👕' },
]

const ultimosPedidos = [
  { id: '#00238', fecha: '10 Abr 2024', total: '$450.00', avatar: '👨' },
  { id: '#00239', fecha: '10 Abr 2024', total: '$325.00', avatar: '👩' },
  { id: '#00240', fecha: '11 Abr 2024', total: '$590.00', avatar: '👩' },
  { id: '#00241', fecha: '11 Abr 2024', total: '$420.00', avatar: '👨' },
]

function Analisis() {
  const [tabVentas, setTabVentas] = useState('Mes')
  const [tabIngresos, setTabIngresos] = useState('Dia')

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
              <div className="stat-card-number">$1,487</div>
              <div className="stat-card-sub">Usada para estadísticas anteriores</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box green">💲</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-card-label">Ventas del mes</div>
              <div className="stat-card-number">$28,756</div>
              <div className="stat-card-sub green-text">+ 48%</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-box orange">🛒</div>
                <span className="stat-dots">⋯</span>
              </div>
              <div className="stat-card-label">Pedidos en ruta</div>
              <div className="stat-card-number">8</div>
              <div className="stat-card-sub green-text">+ 1 ↑</div>
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
              <div className="sin-stock-item">
                <div className="sin-stock-img">👖</div>
                <div>
                  <div className="sin-stock-nombre">Internos Tracksuit Pants</div>
                  <div className="sin-stock-code">Set56809</div>
                  <a href="#" className="sin-stock-link">Reabastecer →</a>
                </div>
              </div>
              <div className="ultimos-exitos">
                <div className="exitos-title">Últimos éxitos</div>
                <div className="exitos-sub">#1 Edur Rhinestones - 182lbsc</div>
              </div>
            </div>
          </div>

          {/* Productos más vendidos + Últimos pedidos */}
          <div className="analisis-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h2 className="section-title">Productos más vendidos</h2>
                <a href="#" className="ver-mas">Ver todo →</a>
              </div>
              {productosMasVendidos.map((prod, i) => (
                <div key={i} className="prod-vendido-row">
                  <div className="prod-vendido-img">{prod.icon}</div>
                  <div className="prod-vendido-info">
                    <div className="prod-vendido-nombre">{prod.nombre}</div>
                    <div className="prod-vendido-precio">{prod.precio}</div>
                  </div>
                  <div className="prod-vendido-cant">
                    <div className="prod-vendido-num">{prod.vendidos}</div>
                    <div className="prod-vendido-sold">sold</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h2 className="section-title">Últimos Pedidos</h2>
                <a href="#" className="ver-mas">VER TODOS →</a>
              </div>
              {ultimosPedidos.map((ped, i) => (
                <div key={i} className="pedido-row">
                  <div className="pedido-avatar">{ped.avatar}</div>
                  <div className="pedido-info">
                    <div className="pedido-id">{ped.id}</div>
                    <div className="pedido-fecha">{ped.fecha}</div>
                  </div>
                  <div className="pedido-right">
                    <div className="pedido-total">{ped.total}</div>
                    <button className="btn-editar-sm">Editar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingresos Mensuales */}
          <div className="chart-card" style={{ marginTop: '20px' }}>
            <div className="chart-header">
              <div>
                <h2 className="section-title">Ingresos Mensuales</h2>
                <div className="ingresos-total">$88,920</div>
                <div className="ingresos-sub">Total en 2024</div>
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