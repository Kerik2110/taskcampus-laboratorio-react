
import { useEffect, useRef, useState } from 'react'
import {
  obtenerTareas,
  crearTareaRemota,
} from '../services/tareasService'

function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estado exclusivo para la creación de tareas.
  const [agregando, setAgregando] = useState(false)
  const [errorOperacion, setErrorOperacion] = useState(null)

  // Evita solicitudes POST simultáneas por doble clic.
  const creandoRef = useRef(false)

  // Cargar las diez tareas iniciales.
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

    return () => controller.abort()
  }, [])

  // Crear una nueva tarea mediante POST.
  async function agregarTarea(titulo) {
    const tituloLimpio = titulo.trim()

    // Validar antes de realizar la solicitud HTTP.
    if (!tituloLimpio) {
      setErrorOperacion('El título de la tarea no puede estar vacío')
      return false
    }

    if (creandoRef.current) {
      return false
    }

    creandoRef.current = true
    setAgregando(true)
    setErrorOperacion(null)

    try {
      // JSONPlaceholder simula la creación.
      await crearTareaRemota(tituloLimpio)

      // Creamos una identidad local única y estable.
      const nuevaTarea = {
        id: `local-${crypto.randomUUID()}`,
        remotoId: null,
        titulo: tituloLimpio,
        completada: false,
      }

      // Actualización funcional: conserva las tareas anteriores.
      setTareas(previas => [...previas, nuevaTarea])

      return true
    } catch (err) {
      setErrorOperacion(
        err.message || 'No fue posible crear la tarea'
      )
      return false
    } finally {
      creandoRef.current = false
      setAgregando(false)
    }
  }

  return {
    tareas,
    setTareas,
    cargando,
    error,
    agregando,
    errorOperacion,
    agregarTarea,
  }
}

export default useTareas
