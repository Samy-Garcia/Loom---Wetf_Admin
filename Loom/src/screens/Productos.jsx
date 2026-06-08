import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Productos.css'

const estadoClass = {
  Disponible: 'badge-disponible',
  'Stock Bajo': 'badge-stockbajo',
  Agotado: 'badge-agotado',
}

const getEstado = (stock) => {
  if (stock === 0) return 'Agotado'
  if (stock <= 5) return 'Stock Bajo'
  return 'Disponible'
}

// ─── Modal Crear ────────────────────────────────────────────────────────────
function ModalCrear({ onClose, onGuardado }) {
  const [form, setForm] = useState({
    name: '', product_type: '', sub_type: '', color: '', price: '', stock: ''
  })
  const [imagenes, setImagenes] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files)
    setImagenes(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleGuardar = async () => {
    if (!form.name || !form.price || !form.stock) return setError('Nombre, precio y stock son obligatorios')
    if (imagenes.length === 0) return setError('Al menos una imagen es obligatoria')
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      imagenes.forEach(img => formData.append('images', img))

      const res = await fetch('http://localhost:4000/api/products', {
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
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nuevo Producto</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {[
            { name: 'name', label: 'Nombre *', placeholder: 'Nombre del producto' },
            { name: 'product_type', label: 'Tipo', placeholder: 'Ej: Jacket, Hoodie' },
            { name: 'sub_type', label: 'Sub-tipo', placeholder: 'Ej: Leather, Fur' },
            { name: 'color', label: 'Color', placeholder: 'Ej: Black, Gray' },
            { name: 'price', label: 'Precio *', placeholder: '0.00' },
            { name: 'stock', label: 'Stock *', placeholder: '0' },
          ].map(({ name, label, placeholder }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                type={name === 'price' || name === 'stock' ? 'number' : 'text'}
              />
            </div>
          ))}
          <div className="form-group">
            <label>Imágenes *</label>
            <div className="img-upload" onClick={() => document.getElementById('imgInputCreate').click()}>
              {previews.length > 0
                ? <div className="img-previews-grid">
                    {previews.map((src, i) => <img key={i} src={src} alt="" className="img-preview" />)}
                  </div>
                : <span>Click para subir imágenes (pueden ser varias)</span>
              }
            </div>
            <input
              id="imgInputCreate"
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImagenes}
            />
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

// ─── Modal Editar ────────────────────────────────────────────────────────────
function ModalEditar({ producto, onClose, onGuardado }) {
  const [form, setForm] = useState({
    name: producto.name || '',
    product_type: producto.product_type || '',
    sub_type: producto.sub_type || '',
    color: producto.color || '',
    price: producto.price || '',
    stock: producto.stock || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGuardar = async () => {
    if (!form.name || !form.price || !form.stock) return setError('Nombre, precio y stock son obligatorios')
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`http://localhost:4000/api/products/${producto._id}`, {
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
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Producto</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Preview imágenes actuales */}
          {producto.images?.length > 0 && (
            <div className="form-group">
              <label>Imágenes actuales</label>
              <div className="img-previews-grid">
                {producto.images.map((img, i) => (
                  <img key={i} src={img.image} alt="" className="img-preview" />
                ))}
              </div>
            </div>
          )}
          {[
            { name: 'name', label: 'Nombre' },
            { name: 'product_type', label: 'Tipo' },
            { name: 'sub_type', label: 'Sub-tipo' },
            { name: 'color', label: 'Color' },
            { name: 'price', label: 'Precio' },
            { name: 'stock', label: 'Stock' },
          ].map(({ name, label }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                type={name === 'price' || name === 'stock' ? 'number' : 'text'}
              />
            </div>
          ))}
          {error && <p className="error-msg">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-add" onClick={handleGuardar} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página Principal ────────────────────────────────────────────────────────
function Productos() {
  const [search, setSearch] = useState('')
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCrear, setShowCrear] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [eliminando, setEliminando] = useState(null)

  const fetchProductos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/products', { credentials: 'include' })
      const data = await res.json()
      setProductos(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const handleEliminar = async (producto) => {
    if (!confirm(`¿Eliminar "${producto.name}"?`)) return
    setEliminando(producto._id)
    try {
      await fetch(`http://localhost:4000/api/products/${producto._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      await fetchProductos()
    } finally {
      setEliminando(null)
    }
  }

  const filtrados = productos.filter(p =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  )

  // Stats dinámicos
  const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0)
  const valorInventario = productos.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0)
  const agotados = productos.filter(p => p.stock === 0).length

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          <div className="page-header">
            <h1 className="page-title">Productos</h1>
            <button className="btn-add" onClick={() => setShowCrear(true)}>+ Nuevo Producto</button>
          </div>

          <div className="search-box-lg">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Stats dinámicos desde API */}
          <div className="stats-grid-4">
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue"></div>
              </div>
              <div className="stat-number-p">{productos.length}</div>
              <div className="stat-label-p">Total Productos</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue"></div>
              </div>
              <div className="stat-number-p">{totalStock}</div>
              <div className="stat-label-p">Unidades en Stock</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box red"></div>
              </div>
              <div className="stat-number-p">{agotados}</div>
              <div className="stat-label-p">Productos Agotados</div>
            </div>
            <div className="stat-card-p">
              <div className="stat-card-top">
                <div className="stat-icon-box blue">💲</div>
              </div>
              <div className="stat-number-p">${valorInventario.toLocaleString()}</div>
              <div className="stat-label-p">Valor del Inventario</div>
            </div>
          </div>

          {loading && <p className="loading-msg">Cargando productos...</p>}
          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && (
            <div className="tabla-card">
              <h2 className="section-title">Productos</h2>
              <table className="productos-table">
                <thead>
                  <tr>
                    <th>NOMBRE PRODUCTO</th>
                    <th>TIPO</th>
                    <th>COLOR</th>
                    <th>PRECIO</th>
                    <th>STOCK</th>
                    <th>ESTADO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((p) => {
                    const estado = getEstado(p.stock)
                    const primeraImg = p.images?.[0]?.image
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="producto-info">
                            {primeraImg
                              ? <img src={primeraImg} alt={p.name} className="producto-img-box producto-img" />
                              : <div className="producto-img-box"></div>
                            }
                            <span className="producto-nombre">{p.name}</span>
                          </div>
                        </td>
                        <td>{p.product_type || '—'}</td>
                        <td>{p.color || '—'}</td>
                        <td>${Number(p.price).toFixed(2)}</td>
                        <td>{p.stock}</td>
                        <td>
                          <span className={`badge-estado ${estadoClass[estado]}`}>
                            • {estado}
                          </span>
                        </td>
                        <td>
                          <div className="acciones">
                            <button className="btn-editar" onClick={() => setProductoEditar(p)}>Editar</button>
                            <button
                              className="btn-eliminar"
                              onClick={() => handleEliminar(p)}
                              disabled={eliminando === p._id}
                            >
                              {eliminando === p._id ? '...' : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCrear && (
        <ModalCrear onClose={() => setShowCrear(false)} onGuardado={fetchProductos} />
      )}
      {productoEditar && (
        <ModalEditar
          producto={productoEditar}
          onClose={() => setProductoEditar(null)}
          onGuardado={() => { fetchProductos(); setProductoEditar(null) }}
        />
      )}
    </div>
  )
}

export default Productos