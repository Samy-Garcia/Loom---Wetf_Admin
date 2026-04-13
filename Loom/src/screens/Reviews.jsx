import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Reviews.css'

const reviewsGenerales = [
  {
    id: 1,
    ranking: 5,
    titulo: 'Excelente servicio',
    experiencia: 'Muy satisfecho con la compra',
    tipo: 'Positiva',
    detalles: 'El producto llegó en perfecto estado y la atención...',
  },
  {
    id: 2,
    ranking: 4,
    titulo: 'Buena calidad',
    experiencia: 'Recomendado',
    tipo: 'Positiva',
    detalles: 'Los productos son de buena calidad, aunque el e...',
  },
  {
    id: 3,
    ranking: 3,
    titulo: 'Entrega tardía',
    experiencia: 'Tardó más de lo esperado',
    tipo: 'Negativa',
    detalles: 'La entrega se retrasó varios días sin aviso previo...',
  },
]

const reviewsProductos = [
  {
    id: 1,
    ranking: 5,
    titulo: 'Tela excelente',
    experiencia: 'Muy buena calidad',
    tipo: 'Positiva',
    detalles: 'La tela es suave y duradera, totalmente recomendada...',
  },
  {
    id: 2,
    ranking: 2,
    titulo: 'Color diferente',
    experiencia: 'No era lo que esperaba',
    tipo: 'Negativa',
    detalles: 'El color del producto no coincidía con las fotos...',
  },
]

function StarRating({ count }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= count ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
      <span className="ranking-num">{count}/5</span>
    </div>
  )
}

function Reviews() {
  const [activeTab, setActiveTab] = useState('generales')
  const [search, setSearch] = useState('')

  const data = activeTab === 'generales' ? reviewsGenerales : reviewsProductos

  const filtered = data.filter(
    (r) =>
      r.titulo.toLowerCase().includes(search.toLowerCase()) ||
      r.experiencia.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <h1 className="page-title">Reviews</h1>

          <div className="reviews-card">
            {/* Tabs */}
            <div className="tabs">
              <button
                className={activeTab === 'generales' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('generales')}
              >
                Reviews Generales
              </button>
              <button
                className={activeTab === 'productos' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('productos')}
              >
                Reviews de Productos
              </button>
            </div>

            {/* Buscador */}
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={
                  activeTab === 'generales'
                    ? 'Buscar review general...'
                    : 'Buscar review de producto...'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Tabla */}
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>RANKING</th>
                  <th>TÍTULO</th>
                  <th>EXPERIENCIA</th>
                  <th>TIPO</th>
                  <th>DETALLES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => (
                  <tr key={review.id}>
                    <td><StarRating count={review.ranking} /></td>
                    <td className="titulo">{review.titulo}</td>
                    <td>{review.experiencia}</td>
                    <td>
                      <span className={`badge ${review.tipo.toLowerCase()}`}>
                        {review.tipo}
                      </span>
                    </td>
                    <td className="detalles">{review.detalles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews