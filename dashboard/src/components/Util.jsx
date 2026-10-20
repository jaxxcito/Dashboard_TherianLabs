const ETIQUETAS = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  SINCRONIZADO: 'Sincronizado',
  ACTIVO: 'Activo',
  CERRADO: 'Cerrado',
}

export function Insignia({ estado }) {
  return <span className={`insignia insignia-${estado.toLowerCase()}`}>{ETIQUETAS[estado] ?? estado}</span>
}

export function Vacio({ texto }) {
  return <div className="vacio">{texto}</div>
}

export function Cargando() {
  return <div className="vacio">Cargando…</div>
}

export function Modal({ titulo, children, onCerrar }) {
  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{titulo}</h3>
        {children}
      </div>
    </div>
  )
}
