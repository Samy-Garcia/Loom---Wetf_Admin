import { Navigate } from 'react-router-dom'

// Verifica si existe la cookie de sesión del admin (authCookie).
// Como la cookie no es httpOnly, se puede leer desde document.cookie.
function isAuthenticated() {
  return document.cookie
    .split(';')
    .some((c) => c.trim().startsWith('authCookie='))
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
