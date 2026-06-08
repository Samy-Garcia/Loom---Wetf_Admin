import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Proveedores.css'

const estadoClass = {
  Examen: 'badge-examen',
  Confiable: 'badge-confiable',
  Pendiente: 'badge-pendiente',
  Retrasado: 'badge-retrasado',
}

function ModalAgregar({ onClose, onGuardado }) {
  const [form, setForm] = useState({
  name: '', email: '', phone: '', address: ''
})
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  const handleImagen = (e) => {
  const file = e.target.files[0]
  if (file) {
    setImagen(file)
    setPreview(URL.createObjectURL(file))
  }
  }

  const handleGuardar = async () => {
  if (!form.name || !form.email) {
    setError('Nombre y correo son obligatorios')
    return
  }
  if (!imagen) {
    setError('La imagen es obligatoria')
    return
  }
  setLoading(true)
  setError('')
  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('address', form.address)
    formData.append('image', imagen)

    const res = await fetch('http://localhost:4000/api/suppliers', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.message || 'Error al guardar')
    } else {
      onGuardado()
      onClose()
    }
  } catch (err) {
    setError('No se pudo conectar con el servidor')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Añadir Proveedor</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Nombre *</label>
            <input name="name" placeholder="Nombre del proveedor" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Correo *</label>
            <input name="email" placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input name="phone" placeholder="+1 (000) 000-0000" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
          </div>
          <div className="form-group">
  <label>Imagen</label>
  <div className="img-upload" onClick={() => document.getElementById('imgInput').click()}>
    {preview
      ? <img src={preview} alt="preview" className="img-preview" />
      : <span>📷 Click para subir imagen</span>
    }
  </div>
  <input
    id="imgInput"
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleImagen}
  />
</div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.isVerified}
                onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
              />
              Proveedor verificado
            </label>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-add" onClick={handleGuardar} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Proveedores() {
  const [search, setSearch] = useState('')
  const [proveedores, setProveedores] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchProveedores = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/suppliers', {
        credentials: 'include',
      })
      const data = await res.json()
      const lista = Array.isArray(data) ? data : []
      setProveedores(lista)
      if (lista.length > 0) setSeleccionado(lista[0])
    } catch (err) {
      setError('No se pudieron cargar los proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProveedores() }, [])

  const filtrados = proveedores.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          <div className="page-header">
            <h1 className="page-title">Proveedores</h1>
            <button className="btn-add" onClick={() => setShowModal(true)}>+ Añadir Proveedor</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-number">{proveedores.length}</div>
              <div className="stat-label">Proveedores Activos</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <div className="stat-number">2</div>
              <div className="stat-label">Pedidos Pendientes</div>
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

          {loading && <p className="loading-msg">Cargando proveedores...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && (
            <div className="main-grid">
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
                        key={p._id}
                        onClick={() => setSeleccionado(p)}
                        className={seleccionado?._id === p._id ? 'row-selected' : ''}
                      >
                        <td>
                          <div className="proveedor-info">
                            <div className="avatar">{(p.name || 'P')[0]}</div>
                            <div>
                              <div className="proveedor-nombre">{p.name}</div>
                              <div className="proveedor-email">{p.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.company}</td>
                        <td>{p.phone}</td>
                        <td>
                          <span className={`badge ${estadoClass[p.status] || 'badge-pendiente'}`}>
                            • {p.status}
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
                    <div className="detalle-header">
                      <div className="avatar avatar-lg">{(seleccionado.name || 'P')[0]}</div>
                      <div>
                        <div className="detalle-nombre">{seleccionado.name}</div>
                        <div className="detalle-email">{seleccionado.email}</div>
                        <span className={`badge ${estadoClass[seleccionado.status] || 'badge-pendiente'}`}>
                          • {seleccionado.status}
                        </span>
                      </div>
                    </div>
                    <div className="detalle-datos">
                      <div>📞 {seleccionado.phone}</div>
                      <div>🏢 {seleccionado.company}</div>
                      <div>📍 {seleccionado.address}</div>
                    </div>
                  </div>

                  <div className="detalle-card">
                    <div className="eval-header">
                      <h3>Evaluación del Proveedor</h3>
                      <span className={`badge ${estadoClass[seleccionado.status] || 'badge-pendiente'}`}>
                        • {seleccionado.status}
                      </span>
                    </div>
                    <div className="eval-stars">
                      {'★★★★★'.split('').map((s, i) => (
                        <span key={i} className="star filled">{s}</span>
                      ))}
                      <span className="eval-pct">{seleccionado.rating || 90}%</span>
                    </div>
                    <div className="eval-bar">
                      <div className="eval-fill" style={{ width: `${seleccionado.rating || 90}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ModalAgregar
          onClose={() => setShowModal(false)}
          onGuardado={fetchProveedores}
        />
      )}
    </div>
  )
}

export default Proveedores