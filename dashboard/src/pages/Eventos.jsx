import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { api } from '../api/client.js'
import { Cargando, Insignia, Modal, Vacio } from '../components/Util.jsx'
import { formatearFechaISO } from '../utils/fechas.js'

// Lo que lee la app del captador al escanear: ID del evento y datos para registrar a los alumnos.
function contenidoQr(evento) {
  return JSON.stringify({
    id: evento.id,
    liceo: evento.liceo,
    nombre: evento.nombre,
    fecha: evento.fecha,
  })
}

function VistaQr({ evento, onCerrar }) {
  const contenedor = useRef(null)

  function descargar() {
    const canvas = contenedor.current.querySelector('canvas')
    const enlace = document.createElement('a')
    enlace.href = canvas.toDataURL('image/png')
    enlace.download = `qr-${evento.id}.png`
    enlace.click()
  }

  return (
    <Modal titulo={`QR del evento ${evento.id}`} onCerrar={onCerrar}>
      <div className="qr-caja" ref={contenedor}>
        <QRCodeCanvas value={contenidoQr(evento)} size={240} marginSize={2} level="M" />
      </div>
      <p className="texto-suave centrado">
        {evento.nombre}
        <br />
        {evento.liceo} · {formatearFechaISO(evento.fecha)}
      </p>
      <p className="texto-suave centrado">
        Si el colegio no tiene el QR a mano, el captador puede escribir el código <strong>{evento.id}</strong>.
      </p>
      <div className="modal-acciones">
        <button className="btn btn-borde" onClick={onCerrar}>
          Cerrar
        </button>
        <button className="btn btn-primario" onClick={descargar}>
          Descargar PNG
        </button>
      </div>
    </Modal>
  )
}

export default function Eventos() {
  const [eventos, setEventos] = useState(null)
  const [error, setError] = useState('')
  const [viendoQr, setViendoQr] = useState(null)
  const [form, setForm] = useState({ nombre: '', liceo: '', fecha: '' })
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    api
      .listarEventos()
      .then(setEventos)
      .catch((e) => setError(e.message))
  }, [])

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function crear(e) {
    e.preventDefault()
    setCreando(true)
    setError('')
    try {
      const nuevo = await api.crearEvento({
        nombre: form.nombre.trim(),
        liceo: form.liceo.trim(),
        fecha: form.fecha,
      })
      setEventos((lista) => [nuevo, ...lista])
      setForm({ nombre: '', liceo: '', fecha: '' })
      setViendoQr(nuevo)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreando(false)
    }
  }

  async function alternarEstado(evento) {
    try {
      const actualizado = await api.cambiarEstadoEvento(
        evento.id,
        evento.estado === 'ACTIVO' ? 'CERRADO' : 'ACTIVO',
      )
      setEventos((lista) => lista.map((x) => (x.id === evento.id ? actualizado : x)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (!eventos && !error) return <Cargando />

  return (
    <>
      <header className="cabecera">
        <h1>Eventos y QR</h1>
        <p className="texto-suave">
          Crea el evento, descarga su QR y entrégalo al colegio o liceo para que los captadores lo escaneen.
        </p>
      </header>

      {error && <div className="error" role="alert">{error}</div>}

      <form className="panel formulario-evento" onSubmit={crear}>
        <h2>Nuevo evento</h2>
        <div className="fila-formulario">
          <label>
            Nombre del evento
            <input value={form.nombre} onChange={cambiar('nombre')} required placeholder="Ej: Feria Vocacional" />
          </label>
          <label>
            Liceo o colegio
            <input value={form.liceo} onChange={cambiar('liceo')} required placeholder="Ej: Liceo Técnico de Quilpué" />
          </label>
          <label>
            Fecha
            <input type="date" value={form.fecha} onChange={cambiar('fecha')} required />
          </label>
        </div>
        <button className="btn btn-primario" type="submit" disabled={creando}>
          {creando ? 'Creando…' : 'Crear evento y generar QR'}
        </button>
      </form>

      {eventos.length === 0 ? (
        <Vacio texto="Todavía no hay eventos." />
      ) : (
        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Evento</th>
                <th>Liceo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.id}>
                  <td data-etiqueta="Código"><code>{ev.id}</code></td>
                  <td data-etiqueta="Evento"><strong>{ev.nombre}</strong></td>
                  <td data-etiqueta="Liceo">{ev.liceo}</td>
                  <td data-etiqueta="Fecha">{formatearFechaISO(ev.fecha)}</td>
                  <td data-etiqueta="Estado"><Insignia estado={ev.estado} /></td>
                  <td className="col-acciones">
                    <button className="btn btn-borde" onClick={() => setViendoQr(ev)}>
                      Ver QR
                    </button>
                    <button className="btn btn-borde" onClick={() => alternarEstado(ev)}>
                      {ev.estado === 'ACTIVO' ? 'Cerrar' : 'Reabrir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viendoQr && <VistaQr evento={viendoQr} onCerrar={() => setViendoQr(null)} />}
    </>
  )
}
