// Capa de acceso a datos del dashboard.
//
// MODO EJEMPLO (por defecto): guarda todo en localStorage del navegador, no necesita servidor.
// MODO REAL: crear un archivo .env con  VITE_USE_MOCK=false  y  VITE_API_URL=http://localhost:8080
//            y el dashboard llamará a los endpoints descritos en el README.

import {
  ADMIN_DEMO,
  captadoresIniciales,
  eventosIniciales,
  prospectosIniciales,
} from './mockData.js'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const MODO_EJEMPLO = USE_MOCK

/* ---------------------------- MODO EJEMPLO ---------------------------- */

const CLAVE_DB = 'dashboard_db_ejemplo_v1'

function cargarDb() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_DB))
    if (guardado) return guardado
  } catch {
    // si el localStorage falla se parte con los datos iniciales
  }
  return {
    captadores: captadoresIniciales,
    eventos: eventosIniciales,
    prospectos: prospectosIniciales,
  }
}

function guardarDb(db) {
  try {
    localStorage.setItem(CLAVE_DB, JSON.stringify(db))
  } catch {
    // sin localStorage los cambios duran solo mientras la página esté abierta
  }
}

let db = cargarDb()

const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms))

const mock = {
  async login(correo, clave) {
    await esperar()
    if (correo.trim().toLowerCase() === ADMIN_DEMO.correo && clave === ADMIN_DEMO.clave) {
      return { token: 'token-de-ejemplo', nombre: ADMIN_DEMO.nombre, correo: ADMIN_DEMO.correo }
    }
    throw new Error('Correo o contraseña incorrectos')
  },

  async listarCaptadores() {
    await esperar()
    return [...db.captadores].sort((a, b) => b.fechaCreacion - a.fechaCreacion)
  },

  async cambiarEstadoCaptador(id, estado, motivo = '') {
    await esperar()
    db = {
      ...db,
      captadores: db.captadores.map((c) =>
        c.id === id ? { ...c, estado, motivo: estado === 'RECHAZADO' ? motivo : '' } : c,
      ),
    }
    guardarDb(db)
    return db.captadores.find((c) => c.id === id)
  },

  async listarProspectos() {
    await esperar()
    return [...db.prospectos].sort((a, b) => b.fechaCaptura - a.fechaCaptura)
  },

  async listarEventos() {
    await esperar()
    return [...db.eventos].sort((a, b) => b.fecha.localeCompare(a.fecha))
  },

  async crearEvento({ nombre, liceo, fecha }) {
    await esperar()
    const numero = String(db.eventos.length + 1).padStart(3, '0')
    const evento = {
      id: `EVT-${fecha.slice(0, 4)}-${numero}`,
      nombre,
      liceo,
      fecha,
      estado: 'ACTIVO',
    }
    db = { ...db, eventos: [...db.eventos, evento] }
    guardarDb(db)
    return evento
  },

  async cambiarEstadoEvento(id, estado) {
    await esperar()
    db = { ...db, eventos: db.eventos.map((e) => (e.id === id ? { ...e, estado } : e)) }
    guardarDb(db)
    return db.eventos.find((e) => e.id === id)
  },

  restaurarDatos() {
    localStorage.removeItem(CLAVE_DB)
    db = cargarDb()
  },
}

/* ----------------------------- MODO REAL ------------------------------ */

async function peticion(ruta, opciones = {}) {
  let token = ''
  try {
    token = JSON.parse(sessionStorage.getItem('admin_sesion'))?.token ?? ''
  } catch {
    token = ''
  }

  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  })

  if (!respuesta.ok) {
    throw new Error(
      respuesta.status === 401 ? 'Credenciales inválidas' : `Error del servidor (${respuesta.status})`,
    )
  }
  return respuesta.status === 204 ? null : respuesta.json()
}

const real = {
  login: (correo, clave) =>
    peticion('/api/admin/login', { method: 'POST', body: JSON.stringify({ correo, clave }) }),

  listarCaptadores: () => peticion('/api/captadores'),

  cambiarEstadoCaptador: (id, estado, motivo = '') =>
    peticion(`/api/captadores/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado, motivo }),
    }),

  listarProspectos: () => peticion('/api/prospectos'),

  listarEventos: () => peticion('/api/eventos'),

  crearEvento: (evento) =>
    peticion('/api/eventos', { method: 'POST', body: JSON.stringify(evento) }),

  cambiarEstadoEvento: (id, estado) =>
    peticion(`/api/eventos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),

  restaurarDatos() {},
}

export const api = USE_MOCK ? mock : real
