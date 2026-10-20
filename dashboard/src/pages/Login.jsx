import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { MODO_EJEMPLO } from '../api/client.js'
import { ADMIN_DEMO } from '../api/mockData.js'

export default function Login() {
  const { admin, iniciarSesion } = useAuth()
  const navegar = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (admin) return <Navigate to="/" replace />

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await iniciarSesion(correo, clave)
      navegar('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={enviar}>
        <h1>Panel de administración</h1>
        <p className="texto-suave">
          Acceso exclusivo para la administradora de Captura de Prospectos.
        </p>

        <label>
          Correo
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="error" role="alert">{error}</div>}

        <button className="btn btn-primario" type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        {MODO_EJEMPLO && (
          <div className="nota-demo">
            Modo de ejemplo. Usa <code>{ADMIN_DEMO.correo}</code> y <code>{ADMIN_DEMO.clave}</code>.
          </div>
        )}
      </form>
    </div>
  )
}
