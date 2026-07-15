import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Categorias.css'

function ModalForm({ titulo, initialName = '', initialSubs = [], onClose, onGuardar }) {
  const [name, setName] = useState(initialName)
  const [subsText, setSubsText] = useState(initialSubs.join(', '))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGuardar = async () => {
    if (!name.trim()) return setError('El nombre es obligatorio')
    setLoading(true)
    setError('')
    try {
      const subcategories = subsText.split(',').map((s) => s.trim()).filter(Boolean)
      await onGuardar({ name: name.trim(), subcategories })
      onClose()
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Nombre de la categoría *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Camisas" />
          </div>
          <div className="form-group">
            <label>Subcategorías (separadas por coma)</label>
            <input value={subsText} onChange={(e) => setSubsText(e.target.value)} placeholder="Ej. Manga larga, Manga corta" />
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

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [eliminandoId, setEliminandoId] = useState(null)
  const [accionError, setAccionError] = useState('')

  const fetchCategorias = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/categories', { credentials: 'include' })
      const data = await res.json()
      setCategorias(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategorias() }, [])

  const handleCrear = async ({ name, subcategories }) => {
    const res = await fetch('http://localhost:4000/api/categories', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subcategories }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    await fetchCategorias()
  }

  const handleActualizar = async ({ name, subcategories }) => {
    const res = await fetch(`http://localhost:4000/api/categories/${editando._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subcategories }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    await fetchCategorias()
  }

  const handleEliminar = async (cat) => {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return
    setEliminandoId(cat._id)
    setAccionError('')
    try {
      const res = await fetch(`http://localhost:4000/api/categories/${cat._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) setAccionError(data.message)
      else await fetchCategorias()
    } finally {
      setEliminandoId(null)
    }
  }

  const filtradas = categorias.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h1 className="page-title">Categorías</h1>
            <button className="btn-add" onClick={() => setShowAddModal(true)}>+ Añadir Categoría</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{categorias.length}</div>
              <div className="stat-label">Categorías Totales</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categorias.reduce((acc, c) => acc + (c.productCount || 0), 0)}</div>
              <div className="stat-label">Productos Categorizados</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categorias.filter(c => (c.productCount || 0) === 0).length}</div>
              <div className="stat-label">Sin Productos</div>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <p className="loading-msg">Cargando categorías...</p>}
          {error && <p className="error-msg">{error}</p>}
          {accionError && <p className="error-msg">{accionError}</p>}

          {!loading && !error && (
            <div className="categorias-grid">
              {filtradas.length === 0 ? (
                <p className="empty-msg">No hay categorías registradas</p>
              ) : filtradas.map((cat) => (
                <div className="categoria-card" key={cat._id}>
                  <div className="categoria-header">
                    <h3>{cat.name}</h3>
                    <span className="badge">{cat.productCount} producto{cat.productCount === 1 ? '' : 's'}</span>
                  </div>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="subcategorias">
                      {cat.subcategories.map((s, i) => (
                        <span key={i} className="sub-chip">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="categoria-actions">
                    <button className="btn-editar" onClick={() => setEditando(cat)}>Editar</button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(cat)}
                      disabled={eliminandoId === cat._id}
                    >
                      {eliminandoId === cat._id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <ModalForm
          titulo="Añadir Categoría"
          onClose={() => setShowAddModal(false)}
          onGuardar={handleCrear}
        />
      )}

      {editando && (
        <ModalForm
          titulo="Editar Categoría"
          initialName={editando.name}
          initialSubs={editando.subcategories || []}
          onClose={() => setEditando(null)}
          onGuardar={handleActualizar}
        />
      )}
    </div>
  )
}

export default Categorias
