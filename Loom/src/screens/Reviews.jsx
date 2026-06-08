import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Reviews.css'

function StarRating({ count }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= count ? 'star filled' : 'star'}>★</span>
      ))}
      <span className="ranking-num">{count}/5</span>
    </div>
  )
}

function Reviews() {
  const [activeTab, setActiveTab] = useState('generales')
  const [search, setSearch] = useState('')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('http://localhost:4000/api/generalReviews', {
          credentials: 'include',
        })
        const data = await res.json()
        setReviews(Array.isArray(data) ? data : [])
      } catch (err) {
        setError('No se pudieron cargar las reviews')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const filtered = reviews.filter(
    (r) =>
      (r.title || r.titulo || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.experience || r.experiencia || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <h1 className="page-title">Reviews</h1>

          <div className="reviews-card">
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

            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={activeTab === 'generales' ? 'Buscar review general...' : 'Buscar review de producto...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading && <p className="loading-msg">Cargando reviews...</p>}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && (
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-msg">No hay reviews disponibles</td>
                    </tr>
                  ) : (
                    filtered.map((review, i) => (
                      <tr key={review._id || i}>
                        <td><StarRating count={review.ranking || review.rating || 0} /></td>
                        <td className="titulo">{review.title || review.titulo}</td>
                        <td>{review.experience || review.experiencia}</td>
                        <td>
                          <span className={`badge ${(review.type || review.tipo || '').toLowerCase() === 'positiva' ? 'positiva' : 'negativa'}`}>
                            {review.type || review.tipo}
                          </span>
                        </td>
                        <td>{review.details || review.detalles}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews