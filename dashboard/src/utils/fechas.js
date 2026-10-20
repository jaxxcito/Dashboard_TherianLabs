export function formatearFecha(ms) {
  return new Date(ms).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatearFechaISO(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
