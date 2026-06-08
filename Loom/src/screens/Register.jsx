import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [terminos, setTerminos] = useState(false)
  const navigate = useNavigate()

  const handleRegister = () => {
    navigate('/analisis')
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="auth-logo">LØØM & WEFT</h1>
        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-sub">Completa el formulario para crear tu cuenta</p>
      </div>

      <div className="auth-card">
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <div className="input-box">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <div className="input-box">
            <span className="input-icon">✉️</span>
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
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirmar contraseña</label>
          <div className="input-box">
            <span className="input-icon">🔒</span>
            <input
              type={showConfirmar ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
            <span
              className="input-icon-right"
              onClick={() => setShowConfirmar(!showConfirmar)}
            >
              {showConfirmar ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        <label className="checkbox-label" style={{ marginBottom: '24px' }}>
          <input
            type="checkbox"
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
          />
          <span>
            Acepto los <a href="#" className="link-blue">términos y condiciones</a> y la <a href="#" className="link-blue">política de privacidad</a>
          </span>
        </label>

        <button className="btn-primary" onClick={handleRegister}>
          Crear cuenta
        </button>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login" className="link-blue">Iniciar sesión</Link>
        </p>
      </div>

      <p className="copyright">© 2024 Loom & Weft. Todos los derechos reservados.</p>
    </div>
  )
}

export default Register