import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Proveedores.css'

const proveedores = [
  {
    id: 1,
    nombre: 'Diamond Supply',
    email: 'jorge@diamondsupply.com',
    empresa: 'Textiles',
    telefono: '+1 (305) 555-5378',
    estado: 'Examen',
    avatar: 'D',
    contacto: 'Jorge López',
    direccion: 'Pasadena 153',
    ciudad: 'Viloria, FL, EE. UU',
    productos: [
      { nombre: 'Black Leather', precio: '$95.00', stock: 20 },
      { nombre: 'Hoodie', precio: '$90.00', stock: 20 },
      { nombre: 'Pants', precio: '$65.00', stock: 20 },
      { nombre: 'Fur Jacket', precio: '$90.00', stock: 20 },
    ],
    pedidos: [
      { id: '#0235', fecha: '18 Abr 2024', estado: 'Recibido', cantidad: '$6,900.00', total: '$6,900.00' },
      { id: '#0254', fecha: '10 Abr 2024', estado: 'En camino', cantidad: '$4,600.00', total: '$4,800.00' },
      { id: '#0253', fecha: '5 Abr 2024', estado: 'Pendiente', cantidad: '$6,450.00', total: '$6,450.00' },
    ],
    evaluacion: { porcentaje: 92, entrega: '5 días', categorias: ['Hoodies', 'Pantas', 'Zip Up Hoodies'] },
  },
  {
    id: 2,
    nombre: 'Black Thread Factory',
    email: 'contact@blackthread.com',
    empresa: 'Manufactura',
    telefono: '+1 (305) 555-5388',
    estado: 'Confiable',
    avatar: 'B',
    contacto: 'María Rodríguez',
    direccion: 'Calle 45 #12',
    ciudad: 'Miami, FL, EE. UU',
    productos: [
      { nombre: 'Black Tee', precio: '$40.00', stock: 15 },
      { nombre: 'Cargo Pants', precio: '$70.00', stock: 10 },
    ],
    pedidos: [
      { id: '#0210', fecha: '1 Mar 2024', estado: 'Recibido', cantidad: '$3,200.00', total: '$3,200.00' },
    ],
    evaluacion: { porcentaje: 98, entrega: '3 días', categorias: ['Camisetas', 'Pantalones'] },
  },
  {
    id: 3,
    nombre: 'Urban Street Supply',
    email: 'info@urbanstreet.com',
    empresa: 'Distribución',
    telefono: '+1 (305) 555-5378',
    estado: 'Confiable',
    avatar: 'U',
    contacto: 'Carlos Méndez',
    direccion: 'Av. Principal 88',
    ciudad: 'Orlando, FL, EE. UU',
    productos: [
      { nombre: 'Snapback', precio: '$30.00', stock: 25 },
      { nombre: 'Windbreaker', precio: '$85.00', stock: 8 },
    ],
    pedidos: [
      { id: '#0198', fecha: '15 Feb 2024', estado: 'Recibido', cantidad: '$2,500.00', total: '$2,500.00' },
    ],
    evaluacion: { porcentaje: 95, entrega: '4 días', categorias: ['Accesorios', 'Chaquetas'] },
  },
  {
    id: 4,
    nombre: 'Blue Stitch Manufacturing',
    email: 'sales@bluestitch.com',
    empresa: 'Textiles',
    telefono: '+1 (305) 555-4321',
    estado: 'Pendiente',
    avatar: 'B',
    contacto: 'Ana Gómez',
    direccion: 'Boulevard 22',
    ciudad: 'Tampa, FL, EE. UU',
    productos: [
      { nombre: 'Denim Jacket', precio: '$110.00', stock: 12 },
    ],
    pedidos: [
      { id: '#0301', fecha: '20 Abr 2024', estado: 'Pendiente', cantidad: '$5,000.00', total: '$5,000.00' },
    ],
    evaluacion: { porcentaje: 75, entrega: '7 días', categorias: ['Denim', 'Casualwear'] },
  },
  {
    id: 5,
    nombre: 'SkyFabric Imports',
    email: 'laura@skyfabric.com',
    empresa: 'Importación',
    telefono: '+1 (305) 555-5378',
    estado: 'Retrasado',
    avatar: 'S',
    contacto: 'Laura Kim',
    direccion: 'Harbor St. 9',
    ciudad: 'Jacksonville, FL, EE. UU',
    productos: [
      { nombre: 'Silk Shirt', precio: '$75.00', stock: 5 },
    ],
    pedidos: [
      { id: '#0289', fecha: '2 Abr 2024', estado: 'Retrasado', cantidad: '$1,800.00', total: '$1,800.00' },
    ],
    evaluacion: { porcentaje: 60, entrega: '10 días', categorias: ['Importados', 'Lujo'] },
  },
]

const estadoClass = {
  Examen: 'badge-examen',
  Confiable: 'badge-confiable',
  Pendiente: 'badge-pendiente',
  Retrasado: 'badge-retrasado',
}

const pedidoClass = {
  Recibido: 'pedido-recibido',
  'En camino': 'pedido-camino',
  Pendiente: 'pedido-pendiente',
  Retrasado: 'pedido-retrasado',
}

function Proveedores() {
  const [search, setSearch] = useState('')
  const [seleccionado, setSeleccionado] = useState(proveedores[0])

  const filtrados = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Proveedores</h1>
            <button className="btn-add">+ Añadir Proveedor</button>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-number">5</div>
              <div className="stat-label">Proveedores Activos</div>
              <div className="stat-sub">Proveedores este mes</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <div className="stat-number">2</div>
              <div className="stat-label">Pedidos Pendientes</div>
              <div className="stat-sub">Estado: permita, vista</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💲</span>
              <div className="stat-number">$8,540</div>
              <div className="stat-label">Deuda Total</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🕐</span>
              <div className="stat-number">1</div>
              <div className="stat-label">Última Entrega</div>
              <div className="stat-sub">Hace 2 días</div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="main-grid">

            {/* Tabla de proveedores */}
            <div className="tabla-card">
              <h2 className="section-title">Proveedores</h2>
              <div className="search-box">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar proveedor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <table className="proveedores-table">
                <thead>
                  <tr>
                    <th>PROVEEDOR</th>
                    <th>EMPRESAS</th>
                    <th>TELÉFONO</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSeleccionado(p)}
                      className={seleccionado.id === p.id ? 'row-selected' : ''}
                    >
                      <td>
                        <div className="proveedor-info">
                          <div className="avatar">{p.avatar}</div>
                          <div>
                            <div className="proveedor-nombre">{p.nombre}</div>
                            <div className="proveedor-email">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.empresa}</td>
                      <td>{p.telefono}</td>
                      <td>
                        <span className={`badge ${estadoClass[p.estado]}`}>
                          • {p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Panel de detalle */}
            <div className="detalle-col">

              {/* Info del proveedor */}
              <div className="detalle-card">
                <div className="detalle-header">
                  <div className="avatar avatar-lg">{seleccionado.avatar}</div>
                  <div>
                    <div className="detalle-nombre">{seleccionado.nombre}</div>
                    <div className="detalle-contacto">{seleccionado.contacto}</div>
                    <div className="detalle-email">{seleccionado.email}</div>
                    <span className={`badge ${estadoClass[seleccionado.estado]}`}>
                      • {seleccionado.estado}
                    </span>
                  </div>
                </div>
                <div className="detalle-datos">
                  <div>📞 {seleccionado.telefono}</div>
                  <div>✉️ {seleccionado.direccion}</div>
                  <div>📍 {seleccionado.ciudad}</div>
                </div>

                {/* Productos suministrados */}
                <div className="productos-section">
                  <h3>Productos Suministrados</h3>
                  <div className="productos-grid">
                    {seleccionado.productos.map((prod, i) => (
                      <div key={i} className="producto-card">
                        <div className="producto-img">👕</div>
                        <div className="producto-nombre">{prod.nombre}</div>
                        <div className="producto-precio">{prod.precio} — {prod.stock}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pedidos */}
              <div className="detalle-card">
                <h3 className="section-title">Pedidos</h3>
                <table className="pedidos-table">
                  <thead>
                    <tr>
                      <th>PEDIDO</th>
                      <th>FECHA</th>
                      <th>ESTADO</th>
                      <th>CANTIDAD</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seleccionado.pedidos.map((ped, i) => (
                      <tr key={i}>
                        <td className="pedido-id">{ped.id}</td>
                        <td>{ped.fecha}</td>
                        <td>
                          <span className={`badge-pedido ${pedidoClass[ped.estado]}`}>
                            {ped.estado}
                          </span>
                        </td>
                        <td>{ped.cantidad}</td>
                        <td className="pedido-total">{ped.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Evaluación */}
              <div className="detalle-card">
                <div className="eval-header">
                  <h3>Evaluación del Proveedor</h3>
                  <span className={`badge ${estadoClass[seleccionado.estado]}`}>
                    • {seleccionado.estado}
                  </span>
                </div>
                <div className="eval-body">
                  <div className="eval-row">
                    <span>📦 Almacenía</span>
                  </div>
                  <div className="eval-stars">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="star filled">{s}</span>
                    ))}
                    <span className="eval-pct">{seleccionado.evaluacion.porcentaje}%</span>
                  </div>
                  <div className="eval-bar">
                    <div
                      className="eval-fill"
                      style={{ width: `${seleccionado.evaluacion.porcentaje}%` }}
                    ></div>
                  </div>
                  <div className="eval-info">
                    <span>Entrega promedio</span>
                    <span>{seleccionado.evaluacion.entrega}</span>
                  </div>
                  <div className="eval-tags">
                    {seleccionado.evaluacion.categorias.map((cat, i) => (
                      <span key={i} className="eval-tag">{cat}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proveedores