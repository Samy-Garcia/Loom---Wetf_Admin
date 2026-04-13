import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Ofertas.css'

const ofertas = [
  { id: 1, codigo: 'LOOM10', descripcion: '10% OFF', tipo: '10%', inicio: '20 Apr 2024', fin: '30 Apr 2024', avatar: '👩' },
  { id: 2, codigo: 'SPRING SALE', descripcion: '15% OFF', tipo: '15%', inicio: '1 May 2024', fin: '10 May 2024', avatar: '👩' },
  { id: 3, codigo: 'LIQUIDACION', descripcion: '-20% OFF gran', tipo: '-20%', inicio: '1 May 2024', fin: '10 May 2024', avatar: '👨' },
]

const productosOferta = [
  { nombre: 'Rhinestones Tracksuit Hoodie', precio: '$169.00', descuento: '-10%' },
  { nombre: 'Rhinestones Tracksuit Pants', precio: '$157.00', descuento: '-10%' },
  { nombre: 'Fur Zip-Up', precio: '$169.00', precioAntes: '$135.20', descuento: '-20%' },
]

const inventarioBajo = [
  { nombre: 'Rhinestones Tracksuit Hoodie', unidades: '5 unidades', descuento: '-10%', precio: '$141.30', agotado: false },
  { nombre: 'Rhinestones Tracksuit Pants', unidades: '0 unidades', descuento: '', precio: '$185.20', agotado: true },
]

const proveedoresOferta = [
  { codigo: 'LOOM10', producto: 'Black Leather', precio: '$169.00' },
  { codigo: 'SPRING SALE', producto: 'Rhinestones', precio: '$157.00' },
  { codigo: 'LIQUIDACION', producto: 'Todos', precio: '$169.00' },
]

const ITEMS_POR_PAGINA = 3

function Ofertas() {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.ceil(ofertas.length / ITEMS_POR_PAGINA)
  const ofertasPagina = ofertas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA)

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">

          {/* Banner */}
          <div className="banner">
            <div className="banner-stars">✦ ✦ ✦</div>
            <h1 className="banner-title">LIQUIDACIÓN 20% OFF</h1>
            <p className="banner-sub">¡Gran remate en toda la tienda! Aprovecha nuestras ofertas antes de que acaben.</p>
            <button className="banner-btn">Ver productos en oferta</button>
          </div>

          {/* Grid principal */}
          <div className="ofertas-grid">

            {/* Tabla de ofertas */}
            <div className="tabla-card">
              <div className="tabla-header">
                <h2 className="section-title">Ofertas, Ofertas</h2>
                <a href="#" className="ver-mas">Ver mas ofertas →</a>
              </div>

              <table className="ofertas-table">
                <thead>
                  <tr>
                    <th>OFERTA / CÓDIGO</th>
                    <th>TIPO</th>
                    <th>PERIODO</th>
                    <th>ACCIÓN ▼</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertasPagina.map((oferta) => (
                    <tr key={oferta.id}>
                      <td>
                        <div className="oferta-info">
                          <div className="avatar">{oferta.avatar}</div>
                          <div>
                            <div className="oferta-codigo">{oferta.codigo}</div>
                            <div className="oferta-desc">{oferta.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="oferta-tipo">{oferta.tipo}</td>
                      <td>
                        <div className="oferta-fecha">{oferta.inicio}</div>
                        <div className="oferta-fecha">{oferta.fin}</div>
                      </td>
                      <td>
                        <button className="btn-editar">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              <div className="paginacion">
                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>←</button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagina(i + 1)}
                    className={pagina === i + 1 ? 'pag-activa' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>→</button>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="panel-derecho">

              {/* Productos en oferta */}
              <div className="panel-card">
                <h3 className="section-title">Productos en oferta</h3>
                <div className="productos-oferta-grid">
                  {productosOferta.map((prod, i) => (
                    <div key={i} className="prod-card">
                      <div className="prod-badge">{prod.descuento}</div>
                      <div className="prod-img">👕</div>
                      <div className="prod-nombre">{prod.nombre}</div>
                      <div className="prod-precio">{prod.precio}</div>
                      {prod.precioAntes && <div className="prod-antes">{prod.precioAntes}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventario Bajo */}
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="section-title">Inventario Bajo</h3>
                  <a href="#" className="ver-mas">VER TODOS →</a>
                </div>
                {inventarioBajo.map((item, i) => (
                  <div key={i} className="inv-row">
                    <div className="inv-img">👕</div>
                    <div className="inv-info">
                      <div className="inv-nombre">{item.nombre}</div>
                      <div className="inv-sub">{item.unidades} {item.descuento && `• ${item.descuento}`}</div>
                    </div>
                    <div className="inv-right">
                      <div className="inv-precio">{item.precio}</div>
                      {item.agotado && <span className="badge-agotado">AGOTADO</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Proveedores */}
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3 className="section-title">Proveedores</h3>
                  <a href="#" className="ver-mas">VER TODOS →</a>
                </div>
                {proveedoresOferta.map((prov, i) => (
                  <div key={i} className="prov-row">
                    <div className="prov-dot"></div>
                    <div className="prov-info">
                      <div className="prov-label">Oferta / Código</div>
                      <div className="prov-codigo">{prov.codigo}</div>
                    </div>
                    <div className="prov-right">
                      <div className="prov-producto">{prov.producto}</div>
                      <div className="prov-precio">{prov.precio}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ofertas