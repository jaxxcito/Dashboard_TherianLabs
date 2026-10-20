// Servidor de prueba: reemplazo temporal del microservicio Spring Boot.
// No usa librerías externas, solo Node. Los datos viven en memoria: al reiniciar vuelven a los de ejemplo.

import http from 'node:http'
import os from 'node:os'
import { ADMIN_DEMO, captadoresIniciales, eventosIniciales, prospectosIniciales } from './seed.mjs'

const PUERTO = Number(process.env.PORT) || 8080
const TOKEN = 'token-servidor-prueba'

let captadores = structuredClone(captadoresIniciales)
let eventos = structuredClone(eventosIniciales)
let prospectos = structuredClone(prospectosIniciales)

const ESTADOS_CAPTADOR = ['PENDIENTE', 'APROBADO', 'RECHAZADO']
const ESTADOS_EVENTO = ['ACTIVO', 'CERRADO']

/* ------------------------------ utilidades ------------------------------ */

function responder(res, codigo, cuerpo) {
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(cuerpo === undefined ? '' : JSON.stringify(cuerpo))
}

function leerJson(req) {
  return new Promise((resolve, reject) => {
    let texto = ''
    req.on('data', (trozo) => (texto += trozo))
    req.on('end', () => {
      try {
        resolve(texto ? JSON.parse(texto) : {})
      } catch {
        reject(new Error('JSON inválido'))
      }
    })
    req.on('error', reject)
  })
}

const esAdmin = (req) => req.headers.authorization === `Bearer ${TOKEN}`

function siguienteIdEvento(fecha) {
  const anio = fecha.slice(0, 4)
  const usados = eventos
    .map((e) => e.id.match(new RegExp(`^EVT-${anio}-(\\d+)$`)))
    .filter(Boolean)
    .map((m) => Number(m[1]))
  const numero = (usados.length ? Math.max(...usados) : 0) + 1
  return `EVT-${anio}-${String(numero).padStart(3, '0')}`
}

/* -------------------------------- rutas --------------------------------- */

async function manejar(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost')
  const metodo = req.method

  if (metodo === 'OPTIONS') return responder(res, 204)

  // --- Login de la administradora
  if (metodo === 'POST' && pathname === '/api/admin/login') {
    const { correo = '', clave = '' } = await leerJson(req)
    if (correo.trim().toLowerCase() === ADMIN_DEMO.correo && clave === ADMIN_DEMO.clave) {
      return responder(res, 200, { token: TOKEN, nombre: ADMIN_DEMO.nombre, correo: ADMIN_DEMO.correo })
    }
    return responder(res, 401, { error: 'Credenciales inválidas' })
  }

  // --- Eventos que la app consulta sin iniciar sesión de administradora
  if (metodo === 'GET' && pathname === '/api/eventos') {
    return responder(res, 200, [...eventos].sort((a, b) => b.fecha.localeCompare(a.fecha)))
  }

  const rutaEvento = pathname.match(/^\/api\/eventos\/([^/]+)$/)
  if (metodo === 'GET' && rutaEvento) {
    const id = decodeURIComponent(rutaEvento[1]).toUpperCase()
    const evento = eventos.find((e) => e.id.toUpperCase() === id)
    return evento ? responder(res, 200, evento) : responder(res, 404, { error: 'Evento no encontrado' })
  }

  // --- Envío masivo de prospectos desde la app (RF-06)
  if (metodo === 'POST' && pathname === '/api/prospectos/lote') {
    const lote = await leerJson(req)
    if (!Array.isArray(lote)) return responder(res, 400, { error: 'Se esperaba una lista de prospectos' })

    let nuevos = 0
    for (const p of lote) {
      const repetido = prospectos.some((x) => x.rut === p.rut && x.eventoId === p.eventoId)
      if (repetido) continue
      const id = prospectos.reduce((max, x) => Math.max(max, x.id), 0) + 1
      prospectos.push({ ...p, id, captadorId: p.captadorId ?? '', estado: 'SINCRONIZADO' })
      nuevos += 1
    }
    return responder(res, 200, { recibidos: lote.length, nuevos })
  }

  // --- Desde aquí todo es solo para la administradora
  const adminRutas =
    pathname === '/api/captadores' ||
    pathname === '/api/prospectos' ||
    /^\/api\/captadores\/[^/]+\/estado$/.test(pathname) ||
    (pathname.startsWith('/api/eventos') && metodo !== 'GET')
  if (adminRutas && !esAdmin(req)) return responder(res, 401, { error: 'Falta iniciar sesión' })

  if (metodo === 'GET' && pathname === '/api/captadores') {
    return responder(res, 200, [...captadores].sort((a, b) => b.fechaCreacion - a.fechaCreacion))
  }

  const rutaCaptador = pathname.match(/^\/api\/captadores\/([^/]+)\/estado$/)
  if (metodo === 'PATCH' && rutaCaptador) {
    const { estado, motivo = '' } = await leerJson(req)
    if (!ESTADOS_CAPTADOR.includes(estado)) return responder(res, 400, { error: 'Estado no válido' })
    const captador = captadores.find((c) => c.id === rutaCaptador[1])
    if (!captador) return responder(res, 404, { error: 'Captador no encontrado' })
    captador.estado = estado
    captador.motivo = estado === 'RECHAZADO' ? motivo : ''
    return responder(res, 200, captador)
  }

  if (metodo === 'GET' && pathname === '/api/prospectos') {
    return responder(res, 200, [...prospectos].sort((a, b) => b.fechaCaptura - a.fechaCaptura))
  }

  if (metodo === 'POST' && pathname === '/api/eventos') {
    const { nombre = '', liceo = '', fecha = '' } = await leerJson(req)
    if (!nombre.trim() || !liceo.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return responder(res, 400, { error: 'Faltan datos: nombre, liceo y fecha (AAAA-MM-DD)' })
    }
    const evento = { id: siguienteIdEvento(fecha), nombre: nombre.trim(), liceo: liceo.trim(), fecha, estado: 'ACTIVO' }
    eventos.push(evento)
    return responder(res, 201, evento)
  }

  const rutaEstadoEvento = pathname.match(/^\/api\/eventos\/([^/]+)\/estado$/)
  if (metodo === 'PATCH' && rutaEstadoEvento) {
    const { estado } = await leerJson(req)
    if (!ESTADOS_EVENTO.includes(estado)) return responder(res, 400, { error: 'Estado no válido' })
    const evento = eventos.find((e) => e.id === decodeURIComponent(rutaEstadoEvento[1]))
    if (!evento) return responder(res, 404, { error: 'Evento no encontrado' })
    evento.estado = estado
    return responder(res, 200, evento)
  }

  return responder(res, 404, { error: 'Ruta no encontrada' })
}

/* ------------------------------- arranque -------------------------------- */

const servidor = http.createServer(async (req, res) => {
  try {
    await manejar(req, res)
  } catch (error) {
    responder(res, 400, { error: error.message })
  }
  console.log(`${req.method} ${req.url} -> ${res.statusCode}`)
})

servidor.listen(PUERTO, '0.0.0.0', () => {
  console.log(`Servidor de prueba listo en el puerto ${PUERTO}`)
  console.log(`  App en emulador:    http://10.0.2.2:${PUERTO}/`)
  for (const redes of Object.values(os.networkInterfaces())) {
    for (const r of redes ?? []) {
      if (r.family === 'IPv4' && !r.internal) {
        console.log(`  App en celular real: http://${r.address}:${PUERTO}/  (mismo wifi que el PC)`)
      }
    }
  }
  console.log('Los datos viven en memoria: al reiniciar vuelven a los de ejemplo.')
})
