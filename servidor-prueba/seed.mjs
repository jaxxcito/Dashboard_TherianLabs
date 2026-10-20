// Datos de ejemplo del servidor de prueba (los mismos que usa el panel en modo ejemplo).
// Las fechas se calculan al iniciar el servidor, por eso siempre se ven "recientes".

export const MODALIDADES = ['Online', 'Presencial']
export const NIVELES = ['Enseñanza Media', 'Técnico', 'Universitario', 'Otro']
export const CARRERAS = ['Informática', 'Construcción', 'Administración', 'Salud', 'Electricidad']

const DIA = 24 * 60 * 60 * 1000
const hace = (dias) => Date.now() - dias * DIA

export const ADMIN_DEMO = {
  correo: 'admin@duoc.cl',
  clave: 'admin123',
  nombre: 'Administradora Duoc',
}

export const captadoresIniciales = [
  { id: 'cap-001', nombreCompleto: 'Camila Rojas Fuentes', rut: '19.456.321-4', correo: 'camila.rojas@correo.cl', telefono: '+56 9 5123 4401', estado: 'PENDIENTE', motivo: '', fechaCreacion: hace(1) },
  { id: 'cap-002', nombreCompleto: 'Matías Soto Vera', rut: '20.112.908-K', correo: 'matias.soto@correo.cl', telefono: '+56 9 6234 1170', estado: 'APROBADO', motivo: '', fechaCreacion: hace(12) },
  { id: 'cap-003', nombreCompleto: 'Valentina Muñoz Pino', rut: '19.887.554-2', correo: 'valentina.munoz@correo.cl', telefono: '+56 9 7345 8812', estado: 'APROBADO', motivo: '', fechaCreacion: hace(10) },
  { id: 'cap-004', nombreCompleto: 'Benjamín Araya Lagos', rut: '20.334.671-8', correo: 'benjamin.araya@correo.cl', telefono: '+56 9 8456 2290', estado: 'PENDIENTE', motivo: '', fechaCreacion: hace(2) },
  { id: 'cap-005', nombreCompleto: 'Fernanda Castro Díaz', rut: '18.992.140-6', correo: 'fernanda.castro@correo.cl', telefono: '+56 9 4567 9034', estado: 'APROBADO', motivo: '', fechaCreacion: hace(8) },
  { id: 'cap-006', nombreCompleto: 'Ignacio Pizarro Salas', rut: '20.501.776-3', correo: 'ignacio.pizarro@correo.cl', telefono: '+56 9 3678 5521', estado: 'RECHAZADO', motivo: 'RUT no coincide con el registro entregado', fechaCreacion: hace(6) },
  { id: 'cap-007', nombreCompleto: 'Javiera Tapia Núñez', rut: '19.230.845-1', correo: 'javiera.tapia@correo.cl', telefono: '+56 9 2789 6643', estado: 'PENDIENTE', motivo: '', fechaCreacion: hace(0.3) },
  { id: 'cap-008', nombreCompleto: 'Sebastián Vergara Mora', rut: '20.078.213-5', correo: 'sebastian.vergara@correo.cl', telefono: '+56 9 1890 7756', estado: 'PENDIENTE', motivo: '', fechaCreacion: hace(3) },
]

export const eventosIniciales = [
  { id: 'EVT-2026-001', nombre: 'Feria Vocacional Liceo Politécnico', liceo: 'Liceo Politécnico de Valparaíso', fecha: '2026-09-18', estado: 'CERRADO' },
  { id: 'EVT-2026-002', nombre: 'Charla de Carreras Técnicas', liceo: 'Colegio San Rafael, Viña del Mar', fecha: '2026-10-22', estado: 'ACTIVO' },
  { id: 'EVT-2026-003', nombre: 'Expo Futuro Profesional', liceo: 'Liceo Técnico de Quilpué', fecha: '2026-11-05', estado: 'ACTIVO' },
  { id: 'EVT-0042', nombre: 'Feria Vocacional 2026', liceo: 'Liceo Bicentenario Ejemplo', fecha: '2026-10-14', estado: 'ACTIVO' },
]

export const prospectosIniciales = [
  { id: 1, eventoId: 'EVT-2026-001', captadorId: 'cap-002', nombreCompleto: 'Antonia Reyes Campos', rut: '22.014.553-7', correo: 'antonia.reyes@correo.cl', telefono: '+56 9 9111 2201', colegio: 'Liceo Politécnico de Valparaíso', nivelEducativo: 'Enseñanza Media', carrera: 'Informática', modalidad: 'Presencial', observaciones: 'Quiere conocer la malla de programación.', fechaCaptura: hace(31), estado: 'SINCRONIZADO' },
  { id: 2, eventoId: 'EVT-2026-001', captadorId: 'cap-002', nombreCompleto: 'Joaquín Herrera Bravo', rut: '22.130.918-2', correo: 'joaquin.herrera@correo.cl', telefono: '+56 9 9111 2202', colegio: 'Liceo Politécnico de Valparaíso', nivelEducativo: 'Enseñanza Media', carrera: 'Electricidad', modalidad: 'Presencial', observaciones: '', fechaCaptura: hace(31), estado: 'SINCRONIZADO' },
  { id: 3, eventoId: 'EVT-2026-001', captadorId: 'cap-003', nombreCompleto: 'Constanza Ibáñez Leal', rut: '21.887.402-9', correo: 'constanza.ibanez@correo.cl', telefono: '+56 9 9111 2203', colegio: 'Liceo Politécnico de Valparaíso', nivelEducativo: 'Enseñanza Media', carrera: 'Salud', modalidad: 'Presencial', observaciones: 'Consultó por becas.', fechaCaptura: hace(31), estado: 'SINCRONIZADO' },
  { id: 4, eventoId: 'EVT-2026-001', captadorId: 'cap-003', nombreCompleto: 'Vicente Gallardo Rivas', rut: '22.245.671-0', correo: 'vicente.gallardo@correo.cl', telefono: '+56 9 9111 2204', colegio: 'Liceo Politécnico de Valparaíso', nivelEducativo: 'Técnico', carrera: 'Construcción', modalidad: 'Online', observaciones: '', fechaCaptura: hace(31), estado: 'SINCRONIZADO' },
  { id: 5, eventoId: 'EVT-2026-001', captadorId: 'cap-005', nombreCompleto: 'Isidora Navarro Tello', rut: '21.763.390-4', correo: 'isidora.navarro@correo.cl', telefono: '+56 9 9111 2205', colegio: 'Liceo Politécnico de Valparaíso', nivelEducativo: 'Enseñanza Media', carrera: 'Administración', modalidad: 'Presencial', observaciones: '', fechaCaptura: hace(31), estado: 'SINCRONIZADO' },
  { id: 6, eventoId: 'EVT-2026-002', captadorId: 'cap-002', nombreCompleto: 'Tomás Cárdenas Silva', rut: '22.098.115-3', correo: 'tomas.cardenas@correo.cl', telefono: '+56 9 9111 2206', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Enseñanza Media', carrera: 'Informática', modalidad: 'Online', observaciones: 'Prefiere horario vespertino.', fechaCaptura: hace(2), estado: 'SINCRONIZADO' },
  { id: 7, eventoId: 'EVT-2026-002', captadorId: 'cap-002', nombreCompleto: 'Martina Orellana Paz', rut: '22.310.642-6', correo: 'martina.orellana@correo.cl', telefono: '+56 9 9111 2207', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Enseñanza Media', carrera: 'Salud', modalidad: 'Presencial', observaciones: '', fechaCaptura: hace(2), estado: 'SINCRONIZADO' },
  { id: 8, eventoId: 'EVT-2026-002', captadorId: 'cap-003', nombreCompleto: 'Agustín Sepúlveda Cruz', rut: '21.954.287-1', correo: 'agustin.sepulveda@correo.cl', telefono: '+56 9 9111 2208', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Técnico', carrera: 'Electricidad', modalidad: 'Presencial', observaciones: 'Ya trabaja y quiere estudiar de noche.', fechaCaptura: hace(2), estado: 'SINCRONIZADO' },
  { id: 9, eventoId: 'EVT-2026-002', captadorId: 'cap-005', nombreCompleto: 'Florencia Maldonado Vera', rut: '22.177.904-8', correo: 'florencia.maldonado@correo.cl', telefono: '+56 9 9111 2209', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Enseñanza Media', carrera: 'Administración', modalidad: 'Online', observaciones: '', fechaCaptura: hace(1), estado: 'SINCRONIZADO' },
  { id: 10, eventoId: 'EVT-2026-002', captadorId: 'cap-005', nombreCompleto: 'Maximiliano Fuentes Ortiz', rut: '22.402.538-5', correo: 'maximiliano.fuentes@correo.cl', telefono: '+56 9 9111 2210', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Enseñanza Media', carrera: 'Construcción', modalidad: 'Presencial', observaciones: '', fechaCaptura: hace(1), estado: 'SINCRONIZADO' },
  { id: 11, eventoId: 'EVT-2026-002', captadorId: 'cap-003', nombreCompleto: 'Emilia Contreras Rubio', rut: '22.265.019-K', correo: 'emilia.contreras@correo.cl', telefono: '+56 9 9111 2211', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Universitario', carrera: 'Informática', modalidad: 'Online', observaciones: 'Quiere continuidad de estudios.', fechaCaptura: hace(0.5), estado: 'SINCRONIZADO' },
  { id: 12, eventoId: 'EVT-2026-002', captadorId: 'cap-002', nombreCompleto: 'Lucas Barrientos Mena', rut: '22.351.760-2', correo: 'lucas.barrientos@correo.cl', telefono: '+56 9 9111 2212', colegio: 'Colegio San Rafael, Viña del Mar', nivelEducativo: 'Otro', carrera: 'Salud', modalidad: 'Presencial', observaciones: '', fechaCaptura: hace(0.2), estado: 'SINCRONIZADO' },
]
