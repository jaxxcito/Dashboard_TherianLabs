import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Resumen from './pages/Resumen.jsx'
import Captadores from './pages/Captadores.jsx'
import Prospectos from './pages/Prospectos.jsx'
import Eventos from './pages/Eventos.jsx'

function RutaProtegida({ children }) {
  const { admin } = useAuth()
  return admin ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/" element={<Resumen />} />
        <Route path="/captadores" element={<Captadores />} />
        <Route path="/prospectos" element={<Prospectos />} />
        <Route path="/eventos" element={<Eventos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
