import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'
import { Cargando, Insignia, Vacio } from '../components/Util.jsx'
import { formatearFecha } from '../utils/fechas.js'

function descargarCsv(filas) {
  const columnas = [
    ['eventoId', 'Evento'],
    ['nombreCompleto', 'Nombre'],
    ['rut', 'RUT'],
    ['correo', 'Correo'],
    ['telefono', 'Teléfono'],
    ['colegio', 'Colegio'],
    ['nivelEducativo', 'Nivel educativo'],
    ['carrera', 'Carrera'],
    ['modalidad', 'Modalidad'],
    ['captador', 'Captador'],
    ['fecha', 'Fecha de captura'],
    ['observaciones', 'Observaciones'],
  ]
  const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const texto = [
    columnas.map(([, t]) => celda(t)).join(';'),
    ...filas.map((f) => columnas.map(([k]) => celda(f[k])).join(';')),
  ].join('\n')

  const blob = new Blob(['﻿' + texto], { type: 'text/csv;charset=utf-8' })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(blob)
  enlace.download = 'prospectos.csv'
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}

export default function Prospectos() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [evento, setEvento] = useState('')
  const [carrera, setCarrera] = useState('')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    Promise.all([api.listarProspectos(), api.listarEventos(), api.listarCaptadores()])
      .then(([prospectos, eventos, captadores]) => setDatos({ prospectos, eventos, captadores }))
      .catch((e) => setError(e.message))
  }, [])

  const filas = useMemo(() => {
    if (!datos) return []
    const nombreCaptador = Object.fromEntries(datos.captadores.map((c) => [c.id, c.nombreCompleto]))
    const q = busqueda.trim().toLowerCase()
    return datos.prospectos
      .filter(
        (p) =>
          (!evento || p.eventoId === evento) &&
          (!carrera || p.carrera === carrera) &&
          (!q ||
            p.nombreCompleto.toLowerCase().includes(q) ||
            p.rut.toLowerCase().includes(q) ||
            p.colegio.toLowerCase().includes(q)),
      )
      .map((p) => ({
        ...p,
        captador: nombreCaptador[p.captadorId] ?? '—',
        fecha: formatearFecha(p.fechaCaptura),
      }))
  }, [datos, evento, carrera, busqueda])

  if (error) return <div className="error">{error}</div>
  if (!datos) return <Cargando />

  const carreras = [...new Set(datos.prospectos.map((p) => p.carrera))].sort()

  return (
    <>
      <header className="cabecera">
        <h1>Prospectos captados</h1>
        <p className="texto-suave">Estudiantes interesados que los captadores registraron en los eventos.</p>
      </header>

      <div className="barra-herramientas">
        <div className="filtros">
          <select value={evento} onChange={(e) => setEvento(e.target.value)} aria-label="Filtrar por evento">
            <option value="">Todos los eventos</option>
            {datos.eventos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <select value={carrera} onChange={(e) => setCarrera(e.target.value)} aria-label="Filtrar por carrera">
            <option value="">Todas las carreras</option>
            {carreras.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            className="buscador"
            type="search"
            placeholder="Buscar por nombre, RUT o colegio"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button className="btn btn-borde" disabled={!filas.length} onClick={() => descargarCsv(filas)}>
          Descargar CSV ({filas.length})
        </button>
      </div>

      {filas.length === 0 ? (
        <Vacio texto="No hay prospectos con esos filtros." />
      ) : (
        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Contacto</th>
                <th>Carrera</th>
                <th>Modalidad</th>
                <th>Evento</th>
                <th>Captador</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((p) => (
                <tr key={p.id}>
                  <td data-etiqueta="Nombre">
                    <strong>{p.nombreCompleto}</strong>
                    <small className="motivo">{p.colegio} · {p.nivelEducativo}</small>
                    {p.observaciones && <small className="motivo">“{p.observaciones}”</small>}
                  </td>
                  <td data-etiqueta="RUT">{p.rut}</td>
                  <td data-etiqueta="Contacto">
                    {p.correo}
                    <small className="motivo">{p.telefono}</small>
                  </td>
                  <td data-etiqueta="Carrera">{p.carrera}</td>
                  <td data-etiqueta="Modalidad">{p.modalidad}</td>
                  <td data-etiqueta="Evento">{p.eventoId}</td>
                  <td data-etiqueta="Captador">{p.captador}</td>
                  <td data-etiqueta="Fecha">{p.fecha}</td>
                  <td data-etiqueta="Estado">
                    <Insignia estado={p.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
