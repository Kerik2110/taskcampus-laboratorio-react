
const API_URL = 'https://jsonplaceholder.typicode.com/todos'

// Función común para realizar solicitudes HTTP.
async function solicitar(url, opciones = {}) {
  const respuesta = await fetch(url, opciones)

  // Los errores HTTP no hacen que fetch falle automáticamente.
  if (!respuesta.ok) {
    throw new Error(
      `Error HTTP ${respuesta.status}: ${respuesta.statusText}`
    )
  }

  // Algunas operaciones DELETE no devuelven contenido.
  if (respuesta.status === 204) {
    return null
  }

  const texto = await respuesta.text()
  return texto ? JSON.parse(texto) : null
}

// GET: obtener las primeras 10 tareas.
export async function obtenerTareas({ signal } = {}) {
  const datos = await solicitar(
    `${API_URL}?_limit=10`,
    { signal }
  )

  if (!Array.isArray(datos)) {
    throw new Error('La API no devolvió una lista de tareas')
  }

  // Adaptamos los datos al formato interno de TaskCampus.
  return datos.map((dato) => ({
    id: `api-${dato.id}`,
    remotoId: dato.id,
    titulo: dato.title,
    completada: Boolean(dato.completed),
  }))
}

// POST: enviar una nueva tarea.
export async function crearTareaRemota(titulo) {
  return solicitar(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: 1,
      title: titulo,
      completed: false,
    }),
  })
}

// PATCH: actualizar el título o el estado de una tarea.
export async function actualizarTareaRemota(remotoId, cambios) {
  const cuerpo = {}

  if ('titulo' in cambios) {
    cuerpo.title = cambios.titulo
  }

  if ('completada' in cambios) {
    cuerpo.completed = cambios.completada
  }

  return solicitar(`${API_URL}/${remotoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cuerpo),
  })
}

// DELETE: solicitar la eliminación de una tarea.
export async function eliminarTareaRemota(remotoId) {
  return solicitar(`${API_URL}/${remotoId}`, {
    method: 'DELETE',
  })
}
