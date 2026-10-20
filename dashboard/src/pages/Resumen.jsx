import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { Cargando, Vacio } from '../components/Util.jsx'
import { formatearFecha } from '../utils/fechas.js'

export default function Resumen() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listarCaptadores(), api.listarProspectos(), api.listarEventos()])
      .then(([captadores, prospectos, eventos]) => setDatos({ captadores, prospectos, eventos }))
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="error">{error}</div>
  if (!datos) return <Cargando />

  const { captadores, prospectos, eventos } = datos
  const pendientes = captadores.filter((c) => c.estado === 'PENDIENTE')
  const aprobados = captadores.filter((c) => c.estado === 'APROBADO').length
  const activos = eventos.filter((e) => e.estado === 'ACTIVO').length

  const porEvento = eventos.map((e) => ({
    ...e,
    total: prospectos.filter((p) => p.eventoId === e.id).length,
  }))
  const maximo = Math.max(1, ...porEvento.map((e) => e.total))

  return (
    <>
      <header className="cabecera">
        <h1>Resumen</h1>
      </header>

      <section className="tarjetas">
        <Link to="/captadores" className={`tarjeta-dato ${pendientes.length ? 'destacada' : ''}`}>
          <span className="dato-numero">{pendientes.length}</span>
          <span className="dato-texto">Captadores por validar</span>
        </Link>
        <div className="tarjeta-dato">
          <span className="dato-numero">{aprobados}</span>
          <span className="dato-texto">Captadores aprobados</span>
        </div>
        <Link to="/prospectos" className="tarjeta-dato">
          <span className="dato-numero">{prospectos.length}</span>
          <span className="dato-texto">Prospectos captados</span>
        </Link>
        <Link to="/eventos" className="tarjeta-dato">
          <span className="dato-numero">{activos}</span>
          <span className="dato-texto">Eventos activos</span>
        </Link>
      </section>

      <section className="dos-columnas">
        <div className="panel">
          <h2>Esperando tu validación</h2>
          {pendientes.length === 0 ? (
            <Vacio texto="No hay captadores pendientes." />
          ) : (
            <ul className="lista">
              {pendientes.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <div>
                    <strong>{c.nombreCompleto}</strong>
                    <small>Registrado el {formatearFecha(c.fechaCreacion)}</small>
                  </div>
                  <Link className="btn btn-borde" to="/captadores">
                    Revisar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h2>Prospectos por evento</h2>
          <ul className="barras">
            {porEvento.map((e) => (
              <li key={e.id}>
                <div className="barra-titulo">
                  <span>{e.nombre}</span>
                  <strong>{e.total}</strong>
                </div>
                <div className="barra-pista">
                  <div className="barra-relleno" style={{ width: `${(e.total / maximo) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
