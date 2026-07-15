import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Pedidos.css'

const estadoClass = {
  pendiente: 'badge-pendiente',
  en_ruta: 'badge-ruta',
  entregado: 'badge-entregado',
  cancelado: 'badge-cancelado',
}

const estadoLabel = {
  pendiente: 'Pendiente',
  en_ruta: 'En ruta',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [actualizando, setActualizando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const fetchPedidos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/orders', { credentials: 'include' })
      const data = await res.json()
      setPedidos(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPedidos() }, [])

  const handleCambiarEstado = async (nuevoEstado) => {
    if (!seleccionado) return
    setActualizando(true)
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${seleccionado._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nuevoEstado }),
      })
      if (res.ok) {
        await fetchPedidos()
        setSeleccionado((prev) => prev ? { ...prev, status: nuevoEstado } : prev)
      }
    } finally {
      setActualizando(false)
    }
  }

  const handleEliminar = async () => {
    if (!seleccionado) return
    if (!confirm('¿Eliminar este pedido?')) return
    setEliminando(true)
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${seleccionado._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        await fetchPedidos()
        setSeleccionado(null)
      }
    } finally {
      setEliminando(false)
    }
  }

  const filtrados = pedidos.filter((p) => {
    const clienteNombre = p.client?.name || ''
    const coincideBusqueda = clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      (p._id || '').toLowerCase().includes(search.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || p.status === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h1 className="page-title">Pedidos</h1>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{pedidos.length}</div>
              <div className="stat-label">Pedidos Totales</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pedidos.filter(p => p.status === 'pendiente').length}</div>
              <div className="stat-label">Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pedidos.filter(p => p.status === 'en_ruta').length}</div>
              <div className="stat-label">En ruta</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pedidos.filter(p => p.status === 'entregado').length}</div>
              <div className="stat-label">Entregados</div>
            </div>
          </div>

          {loading && <p className="loading-msg">Cargando pedidos...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && (
            <div className="main-grid">
              <div className="tabla-card">
                <h2 className="section-title">Pedidos</h2>
                <div className="filtros-row">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Buscar por cliente o ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="select-filtro">
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <table className="pedidos-table">
                  <thead>
                    <tr>
                      <th>CLIENTE</th>
                      <th>FECHA</th>
                      <th>TOTAL</th>
                      <th>ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length === 0 ? (
                      <tr><td colSpan="4" className="empty-msg">No hay pedidos</td></tr>
                    ) : filtrados.map((p) => (
                      <tr
                        key={p._id}
                        onClick={() => setSeleccionado(p)}
                        className={seleccionado?._id === p._id ? 'row-selected' : ''}
                      >
                        <td>{p.client?.name || 'Cliente eliminado'}</td>
                        <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                        <td>${(p.total || 0).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${estadoClass[p.status] || 'badge-pendiente'}`}>
                            • {estadoLabel[p.status] || p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {seleccionado && (
                <div className="detalle-col">
                  <div className="detalle-card">
                    <div className="detalle-header-simple">
                      <div className="detalle-nombre">Pedido #{seleccionado._id?.slice(-6)}</div>
                      <span className={`badge ${estadoClass[seleccionado.status] || 'badge-pendiente'}`}>
                        • {estadoLabel[seleccionado.status] || seleccionado.status}
                      </span>
                    </div>
                    <div className="detalle-datos">
                      <div>Cliente: {seleccionado.client?.name || '—'}</div>
                      <div>Correo: {seleccionado.client?.email || '—'}</div>
                      <div>Fecha: {seleccionado.createdAt ? new Date(seleccionado.createdAt).toLocaleString() : '—'}</div>
                      <div>Total: ${(seleccionado.total || 0).toFixed(2)}</div>
                    </div>

                    <h3 className="items-title">Productos</h3>
                    <ul className="items-list">
                      {(seleccionado.items || []).map((item, i) => (
                        <li key={i}>
                          {item.product?.name || 'Producto eliminado'} × {item.quantity} — ${(item.unitPrice || 0).toFixed(2)}
                        </li>
                      ))}
                    </ul>

                    <div className="form-group">
                      <label>Cambiar estado</label>
                      <select
                        value={seleccionado.status}
                        onChange={(e) => handleCambiarEstado(e.target.value)}
                        disabled={actualizando}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_ruta">En ruta</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>

                    <div className="detalle-actions">
                      <button className="btn-cancelar" onClick={handleEliminar} disabled={eliminando}>
                        {eliminando ? 'Eliminando...' : 'Eliminar Pedido'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pedidos
