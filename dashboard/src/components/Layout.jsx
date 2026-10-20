import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const MENU = [
  { to: '/', texto: 'Resumen', fin: true },
  { to: '/captadores', texto: 'Captadores' },
  { to: '/prospectos', texto: 'Prospectos' },
  { to: '/eventos', texto: 'Eventos y QR' },
]

export default function Layout() {
  const { admin, cerrarSesion } = useAuth()

  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <span className="marca-icono" aria-hidden="true">
            <svg viewBox="0 0 108 108" width="26" height="26">
              <g fill="none" stroke="#FFC20E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 42 V28 a6 6 0 0 1 6 -6 H42" />
                <path d="M66 22 H80 a6 6 0 0 1 6 6 V42" />
                <path d="M86 66 V80 a6 6 0 0 1 -6 6 H66" />
                <path d="M42 86 H28 a6 6 0 0 1 -6 -6 V66" />
              </g>
              <circle cx="54" cy="45" r="10" fill="#fff" />
              <path d="M36 72 C36 60 45 56 54 56 C63 56 72 60 72 72 Z" fill="#fff" />
            </svg>
          </span>
          <div>
            <strong>Captura de Prospectos</strong>
            <small>Panel de administración</small>
          </div>
        </div>

        <nav className="menu">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.fin}
              className={({ isActive }) => (isActive ? 'menu-link activo' : 'menu-link')}
            >
              {item.texto}
            </NavLink>
          ))}
        </nav>

        <div className="lateral-pie">
          <div className="admin-nombre">{admin.nombre}</div>
          <div className="admin-correo">{admin.correo}</div>
          <button className="btn btn-claro" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}
