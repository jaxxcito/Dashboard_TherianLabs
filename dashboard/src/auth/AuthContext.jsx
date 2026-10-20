import { createContext, useContext, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

const CLAVE = 'admin_sesion'

function leerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(leerSesion)

  async function iniciarSesion(correo, clave) {
    const sesion = await api.login(correo, clave)
    sessionStorage.setItem(CLAVE, JSON.stringify(sesion))
    setAdmin(sesion)
  }

  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
