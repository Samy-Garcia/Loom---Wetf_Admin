import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { FiX } from 'react-icons/fi'
import './Usuarios.css'

const ENDPOINTS = {
  clientes: 'registerClient',
  empleados: 'registerEmployee',
}

function ModalEditar({ tipo, usuario, onClose, onGuardado }) {
  const camposClientes = ['name', 'lastName', 'email', 'phone', 'address']
  const camposEmpleados = ['name', 'email', 'phone', 'address', 'salary']
  const campos = tipo === 'clientes' ? camposClientes : camposEmpleados

  const [form, setForm] = useState(() => {
    const initial = {}
    campos.forEach((c) => { initial[c] = usuario[c] ?? '' })
    return initial
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGuardar = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`http://localhost:4000/api/${ENDPOINTS[tipo]}/${usuario._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          <h2>Editar {tipo === 'clientes' ? 'Cliente' : 'Empleado'}</h2>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          {campos.map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input name={field} value={form[field]} onChange={handleChange} />
            </div>
          ))}
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

function Usuarios() {
  const [tab, setTab] = useState('clientes')
  const [usuarios, setUsuarios] = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const fetchUsuarios = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`http://localhost:4000/api/${ENDPOINTS[tab]}`, { credentials: 'include' })
      const data = await res.json()
      const lista = Array.isArray(data) ? data : []
      setUsuarios(lista)
      setSeleccionado(null)
    } catch {
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsuarios() }, [tab])

  const handleEliminar = async () => {
    if (!seleccionado) return
    if (!confirm(`¿Eliminar a ${seleccionado.name}?`)) return
    setEliminando(true)
    try {
      const res = await fetch(`http://localhost:4000/api/${ENDPOINTS[tab]}/${seleccionado._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        await fetchUsuarios()
        setSeleccionado(null)
      }
    } finally {
      setEliminando(false)
    }
  }

  const filtrados = usuarios.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h1 className="page-title">Usuarios</h1>
          </div>

          <div className="tabs">
            <button className={tab === 'clientes' ? 'tab active' : 'tab'} onClick={() => setTab('clientes')}>
              Clientes
            </button>
            <button className={tab === 'empleados' ? 'tab active' : 'tab'} onClick={() => setTab('empleados')}>
              Empleados
            </button>
          </div>

          {loading && <p className="loading-msg">Cargando usuarios...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && (
            <div className="main-grid">
              <div className="tabla-card">
                <h2 className="section-title">{tab === 'clientes' ? 'Clientes' : 'Empleados'}</h2>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <table className="usuarios-table">
                  <thead>
                    <tr>
                      <th>NOMBRE</th>
                      <th>CORREO</th>
                      <th>TELÉFONO</th>
                      <th>ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.length === 0 ? (
                      <tr><td colSpan="4" className="empty-msg">No hay usuarios</td></tr>
                    ) : filtrados.map((u) => (
                      <tr
                        key={u._id}
                        onClick={() => setSeleccionado(u)}
                        className={seleccionado?._id === u._id ? 'row-selected' : ''}
                      >
                        <td>
                          <div className="usuario-info">
                            <div className="avatar">{(u.name || 'U')[0]}</div>
                            <div className="usuario-nombre">{u.name} {u.lastName || ''}</div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td>
                          <span className={`badge ${(u.isVerified || u.isActive) ? 'badge-activo' : 'badge-inactivo'}`}>
                            • {(u.isVerified || u.isActive) ? 'Activo' : 'Inactivo'}
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
                      <div className="avatar avatar-lg">{(seleccionado.name || 'U')[0]}</div>
                      <div>
                        <div className="detalle-nombre">{seleccionado.name} {seleccionado.lastName || ''}</div>
                        <div className="detalle-email">{seleccionado.email}</div>
                      </div>
                    </div>
                    <div className="detalle-datos">
                      <div>{seleccionado.phone || '—'}</div>
                      <div>{seleccionado.address || '—'}</div>
                      {tab === 'empleados' && <div>Salario: ${seleccionado.salary || '—'}</div>}
                    </div>
                    <div className="detalle-actions">
                      <button className="btn-add" onClick={() => setShowEditModal(true)}>Editar</button>
                      <button className="btn-eliminar" onClick={handleEliminar} disabled={eliminando}>
                        {eliminando ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showEditModal && seleccionado && (
        <ModalEditar
          tipo={tab}
          usuario={seleccionado}
          onClose={() => setShowEditModal(false)}
          onGuardado={() => { fetchUsuarios(); setShowEditModal(false) }}
        />
      )}
    </div>
  )
}

export default Usuarios
