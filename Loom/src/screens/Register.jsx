import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

function Register() {
  const [step, setStep] = useState(1)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [codigo, setCodigo] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [terminos, setTerminos] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!nombre || !email || !password || !confirmar) {
      setError('Todos los campos son obligatorios')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (!terminos) {
      setError('Debes aceptar los términos y condiciones')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/registerAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: nombre, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Error al registrar')
      } else {
        setStep(2)
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificar = async () => {
    if (!codigo) {
      setError('Ingresa el código de verificación')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/registerAdmin/verifyCodeEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ verificationCodeRequest: codigo }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Código incorrecto')
      } else {
        navigate('/login')
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
        {step === 1 ? (
          <>
            <h2 className="auth-title">Crear cuenta</h2>
            <p className="auth-sub">Completa el formulario para crear tu cuenta</p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Verificar correo</h2>
            <p className="auth-sub">Ingresa el código que enviamos a {email}</p>
          </>
        )}
      </div>

      <div className="auth-card">
        {step === 1 ? (
          <>
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
                <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
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
                <span className="input-icon-right" onClick={() => setShowConfirmar(!showConfirmar)}>
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

            {error && <p className="error-msg">{error}</p>}

            <button className="btn-primary" onClick={handleRegister} disabled={loading}>
              {loading ? 'Enviando...' : 'Crear cuenta'}
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Código de verificación</label>
              <div className="input-box">
                <span className="input-icon">🔑</span>
                <input
                  type="text"
                  placeholder="Ingresa el código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button className="btn-primary" onClick={handleVerificar} disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </>
        )}

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login" className="link-blue">Iniciar sesión</Link>
        </p>
      </div>

      <p className="copyright">© 2024 Loom & Weft. Todos los derechos reservados.</p>
    </div>
  )
}

export default Register