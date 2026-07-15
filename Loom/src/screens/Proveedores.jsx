import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { FiX, FiStar } from 'react-icons/fi'
import './Proveedores.css'

const estadoClass = {
  Examen: 'badge-examen',
  Confiable: 'badge-confiable',
  Pendiente: 'badge-pendiente',
  Retrasado: 'badge-retrasado',
}

function ModalAgregar({ onClose, onGuardado }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', company: ''
  })
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleGuardar = async () => {
    if (!form.name || !form.email) return setError('Nombre y correo son obligatorios')
    if (!imagen) return setError('La imagen es obligatoria')
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      formData.append('image', imagen)

      const res = await fetch('http://localhost:4000/api/suppliers', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) setError(data.message || 'Error al guardar')
      else { onGuardado(); onClose() }
    } catch {
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
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          {['name', 'email', 'phone', 'address', 'company'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}{field === 'name' || field === 'email' ? ' *' : ''}</label>
              <input name={field} value={form[field]} onChange={handleChange}
                placeholder={field === 'email' ? 'correo@ejemplo.com' : field.charAt(0).toUpperCase() + field.slice(1)} />
            </div>
          ))}
          <div className="form-group">
            <label>Imagen *</label>
            <div className="img-upload" onClick={() => document.getElementById('imgInput').click()}>
              {preview
                ? <img src={preview} alt="preview" className="img-preview" />
                : <span>Click para subir imagen</span>}
            </div>
            <input id="imgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagen} />
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

function ModalEditar({ proveedor, onClose, onGuardado }) {
  const [form, setForm] = useState({
    name: proveedor.name || '',
    email: proveedor.email || '',
    phone: proveedor.phone || '',
    address: proveedor.address || '',
    company: proveedor.company || '',
  })
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(proveedor.image || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (file) { setImagen(file); setPreview(URL.createObjectURL(file)) }
  }

  const handleGuardar = async () => {
    if (!form.name || !form.email) return setError('Nombre y correo son obligatorios')
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (imagen) formData.append('image', imagen)

      const res = await fetch(`http://localhost:4000/api/suppliers/${proveedor._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) setError(data.message || 'Error al actualizar')
      else { onGuardado(); onClose() }
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Proveedor</h2>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          {['name', 'email', 'phone', 'address', 'company'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input name={field} value={form[field]} onChange={handleChange} />
            </div>
          ))}
          <div className="form-group">
            <label>Imagen</label>
            <div className="img-upload" onClick={() => document.getElementById('imgInputEdit').click()}>
              {preview
                ? <img src={preview} alt="preview" className="img-preview" />
                : <span>Click para subir imagen</span>}
            </div>
            <input id="imgInputEdit" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagen} />
          </div>
          {error && <p className="error-msg">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-add" onClick={handleGuardar} disabled={loading}>
            {loading ? 'Guardando...' : 'Actualizar'}
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const fetchProveedores = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/suppliers', { credentials: 'include' })
      const data = await res.json()
      const lista = Array.isArray(data) ? data : []
      setProveedores(lista)
      if (lista.length > 0) setSeleccionado(lista[0])
    } catch {
      setError('No se pudieron cargar los proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProveedores() }, [])

  const handleEliminar = async () => {
    if (!seleccionado) return
    if (!confirm(`¿Eliminar a ${seleccionado.name}?`)) return
    setEliminando(true)
    try {
      const res = await fetch(`http://localhost:4000/api/suppliers/${seleccionado._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        await fetchProveedores()
        setSeleccionado(null)
      }
    } finally {
      setEliminando(false)
    }
  }

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
              <div className="stat-number">{proveedores.length}</div>
              <div className="stat-label">Proveedores Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{proveedores.filter(p => p.status === 'Pendiente').length}</div>
              <div className="stat-label">Pedidos Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{proveedores.filter(p => p.isVerified).length}</div>
              <div className="stat-label">Verificados</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{proveedores.filter(p => p.status === 'Retrasado').length}</div>
              <div className="stat-label">Retrasados</div>
            </div>
          </div>

          {loading && <p className="loading-msg">Cargando proveedores...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && (
            <div className="main-grid">
              <div className="tabla-card">
                <h2 className="section-title">Proveedores</h2>
                <div className="search-box">
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
                      <th>EMPRESA</th>
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
                            {/* ✅ Usa imagen de Cloudinary si existe */}
                            {p.image
                              ? <img src={p.image} alt={p.name} className="avatar avatar-img" />
                              : <div className="avatar">{(p.name || 'P')[0]}</div>
                            }
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
                            • {p.status || 'Pendiente'}
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
                      {/* ✅ Usa imagen de Cloudinary si existe */}
                      {seleccionado.image
                        ? <img src={seleccionado.image} alt={seleccionado.name} className="avatar avatar-lg avatar-img" />
                        : <div className="avatar avatar-lg">{(seleccionado.name || 'P')[0]}</div>
                      }
                      <div>
                        <div className="detalle-nombre">{seleccionado.name}</div>
                        <div className="detalle-email">{seleccionado.email}</div>
                        <span className={`badge ${estadoClass[seleccionado.status] || 'badge-pendiente'}`}>
                          • {seleccionado.status || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                    <div className="detalle-datos">
                      <div> {seleccionado.phone || '—'}</div>
                      <div> {seleccionado.company || '—'}</div>
                      <div> {seleccionado.address || '—'}</div>
                      <div> {seleccionado.isVerified ? 'Verificado' : 'No verificado'}</div>
                    </div>
                    {/*  Botones editar / eliminar */}
                    <div className="detalle-actions">
                      <button className="btn-add" onClick={() => setShowEditModal(true)}>Editar</button>
                      <button className="btn-cancelar" onClick={handleEliminar} disabled={eliminando}>
                        {eliminando ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>

                  <div className="detalle-card">
                    <div className="eval-header">
                      <h3>Evaluación del Proveedor</h3>
                      <span className={`badge ${estadoClass[seleccionado.status] || 'badge-pendiente'}`}>
                        • {seleccionado.status || 'Pendiente'}
                      </span>
                    </div>
                    <div className="eval-stars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <FiStar key={i} className="star filled" />
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
        <ModalAgregar onClose={() => setShowModal(false)} onGuardado={fetchProveedores} />
      )}

      {showEditModal && seleccionado && (
        <ModalEditar
          proveedor={seleccionado}
          onClose={() => setShowEditModal(false)}
          onGuardado={() => { fetchProveedores(); setShowEditModal(false) }}
        />
      )}
    </div>
  )
}

export default Proveedores