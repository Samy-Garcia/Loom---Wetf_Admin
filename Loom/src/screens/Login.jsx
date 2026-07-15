import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/loginAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Credenciales incorrectas')
      } else {
        navigate('/analisis')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="auth-logo">LØØM & WEFT</h1>
        <h2 className="auth-title">Bienvenido de nuevo</h2>
        <p className="auth-sub">Ingresa tus credenciales para acceder al panel</p>
      </div>

      <div className="auth-card">
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <div className="input-box">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
            />
            Recordarme
          </label>
          <a href="#" className="link-blue">¿Olvidaste tu contraseña?</a>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register" className="link-blue">Crear cuenta</Link>
        </p>
      </div>

      <p className="copyright">© 2024 Loom & Weft. Todos los derechos reservados.</p>
    </div>
  )
}

export default Login