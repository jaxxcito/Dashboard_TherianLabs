import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'
import { Cargando, Insignia, Modal, Vacio } from '../components/Util.jsx'
import { formatearFecha } from '../utils/fechas.js'

const PESTANAS = [
  { clave: 'PENDIENTE', texto: 'Pendientes' },
  { clave: 'APROBADO', texto: 'Aprobados' },
  { clave: 'RECHAZADO', texto: 'Rechazados' },
]

export default function Captadores() {
  const [captadores, setCaptadores] = useState(null)
  const [error, setError] = useState('')
  const [pestana, setPestana] = useState('PENDIENTE')
  const [busqueda, setBusqueda] = useState('')
  const [rechazando, setRechazando] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [trabajando, setTrabajando] = useState(false)

  useEffect(() => {
    api
      .listarCaptadores()
      .then(setCaptadores)
      .catch((e) => setError(e.message))
  }, [])

  const conteo = useMemo(() => {
    const c = { PENDIENTE: 0, APROBADO: 0, RECHAZADO: 0 }
    captadores?.forEach((x) => (c[x.estado] += 1))
    return c
  }, [captadores])

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return (captadores ?? []).filter(
      (c) =>
        c.estado === pestana &&
        (!q ||
          c.nombreCompleto.toLowerCase().includes(q) ||
          c.rut.toLowerCase().includes(q) ||
          c.correo.toLowerCase().includes(q)),
    )
  }, [captadores, pestana, busqueda])

  async function cambiarEstado(captador, estado, textoMotivo = '') {
    setTrabajando(true)
    setError('')
    try {
      const actualizado = await api.cambiarEstadoCaptador(captador.id, estado, textoMotivo)
      setCaptadores((lista) => lista.map((c) => (c.id === captador.id ? actualizado : c)))
    } catch (e) {
      setError(e.message)
    } finally {
      setTrabajando(false)
    }
  }

  async function confirmarRechazo() {
    await cambiarEstado(rechazando, 'RECHAZADO', motivo.trim())
    setRechazando(null)
    setMotivo('')
  }

  if (!captadores && !error) return <Cargando />

  return (
    <>
      <header className="cabecera">
        <h1>Captadores</h1>
        <p className="texto-suave">
          Solo los captadores aprobados pueden iniciar sesión en la app y registrar prospectos.
        </p>
      </header>

      {error && <div className="error" role="alert">{error}</div>}

      <div className="barra-herramientas">
        <div className="pestanas" role="tablist">
          {PESTANAS.map((p) => (
            <button
              key={p.clave}
              role="tab"
              aria-selected={pestana === p.clave}
              className={pestana === p.clave ? 'pestana activa' : 'pestana'}
              onClick={() => setPestana(p.clave)}
            >
              {p.texto} <span className="contador">{conteo[p.clave]}</span>
            </button>
          ))}
        </div>
        <input
          className="buscador"
          type="search"
          placeholder="Buscar por nombre, RUT o correo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {visibles.length === 0 ? (
        <Vacio texto="No hay captadores en esta lista." />
      ) : (
        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Registro</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((c) => (
                <tr key={c.id}>
                  <td data-etiqueta="Nombre">
                    <strong>{c.nombreCompleto}</strong>
                    {c.estado === 'RECHAZADO' && c.motivo && (
                      <small className="motivo">Motivo: {c.motivo}</small>
                    )}
                  </td>
                  <td data-etiqueta="RUT">{c.rut}</td>
                  <td data-etiqueta="Correo">{c.correo}</td>
                  <td data-etiqueta="Teléfono">{c.telefono}</td>
                  <td data-etiqueta="Registro">{formatearFecha(c.fechaCreacion)}</td>
                  <td data-etiqueta="Estado">
                    <Insignia estado={c.estado} />
                  </td>
                  <td className="col-acciones">
                    {c.estado !== 'APROBADO' && (
                      <button
                        className="btn btn-primario"
                        disabled={trabajando}
                        onClick={() => cambiarEstado(c, 'APROBADO')}
                      >
                        Aprobar
                      </button>
                    )}
                    {c.estado !== 'RECHAZADO' && (
                      <button
                        className="btn btn-peligro"
                        disabled={trabajando}
                        onClick={() => setRechazando(c)}
                      >
                        {c.estado === 'APROBADO' ? 'Revocar' : 'Rechazar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rechazando && (
        <Modal titulo={`${rechazando.estado === 'APROBADO' ? 'Revocar acceso' : 'Rechazar captador'}`} onCerrar={() => setRechazando(null)}>
          <p>
            <strong>{rechazando.nombreCompleto}</strong> no podrá iniciar sesión en la app.
          </p>
          <label>
            Motivo (opcional)
            <textarea
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: el RUT no coincide con el registro entregado"
            />
          </label>
          <div className="modal-acciones">
            <button className="btn btn-borde" onClick={() => setRechazando(null)}>
              Cancelar
            </button>
            <button className="btn btn-peligro" disabled={trabajando} onClick={confirmarRechazo}>
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
