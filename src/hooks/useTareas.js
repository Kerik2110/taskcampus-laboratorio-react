
import { useEffect, useState } from 'react'
import { obtenerTareas } from '../services/tareasService'

// Hook personalizado para administrar las tareas.
function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function cargarTareas() {
      try {
        const datos = await obtenerTareas({
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setTareas(datos)
          setError(null)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Error al cargar las tareas')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarTareas()

    // Cancelamos la solicitud si el efecto se limpia.
    return () => controller.abort()
  }, [])

  return {
    tareas,
    setTareas,
    cargando,
    error,
  }
}

export default useTareas
