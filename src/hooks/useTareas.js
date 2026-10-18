
import { useEffect, useRef, useState } from 'react'
import {
  obtenerTareas,
  crearTareaRemota,
  actualizarTareaRemota,
} from '../services/tareasService'

function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [agregando, setAgregando] = useState(false)
  const [errorOperacion, setErrorOperacion] = useState(null)

  // Control de tareas que se están actualizando.
  const [actualizandoIds, setActualizandoIds] = useState([])
  const actualizandoRef = useRef(new Set())
  const creandoRef = useRef(false)

  // GET: cargar las primeras diez tareas.
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

  // POST: crear una tarea.
  async function agregarTarea(titulo) {
    const tituloLimpio = titulo.trim()

    if (!tituloLimpio) {
      setErrorOperacion(
        'El título de la tarea no puede estar vacío'
      )
      return false
    }

    if (creandoRef.current) {
      return false
    }

    creandoRef.current = true
    setAgregando(true)
    setErrorOperacion(null)

    try {
      await crearTareaRemota(tituloLimpio)

      const nuevaTarea = {
        id: `local-${crypto.randomUUID()}`,
        remotoId: null,
        titulo: tituloLimpio,
        completada: false,
      }

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

  // PATCH: alternar entre pendiente y completada.
  async function alternarTarea(id) {
    const tarea = tareas.find(item => item.id === id)

    if (!tarea) {
      setErrorOperacion('No se encontró la tarea')
      return false
    }

    // Impedir operaciones duplicadas sobre la misma tarea.
    if (actualizandoRef.current.has(id)) {
      return false
    }

    actualizandoRef.current.add(id)
    setActualizandoIds(previas => [...previas, id])
    setErrorOperacion(null)

    const nuevoEstado = !tarea.completada

    try {
      // Solo las tareas originales tienen recurso remoto.
      if (tarea.remotoId !== null) {
        await actualizarTareaRemota(tarea.remotoId, {
          completada: nuevoEstado,
        })
      }

      // Actualización inmutable después del éxito.
      setTareas(previas =>
        previas.map(item =>
          item.id === id
            ? { ...item, completada: nuevoEstado }
            : item
        )
      )

      return true
    } catch (err) {
      // No cambiar el estado cuando falla la API.
      setErrorOperacion(
        err.message || 'No fue posible actualizar la tarea'
      )
      return false
    } finally {
      actualizandoRef.current.delete(id)

      setActualizandoIds(previas =>
        previas.filter(itemId => itemId !== id)
      )
    }
  }


  // PATCH: editar el título de una tarea.
  async function editarTarea(id, nuevoTitulo) {
    const tituloLimpio =
      typeof nuevoTitulo === 'string'
        ? nuevoTitulo.trim()
        : ''

    if (!tituloLimpio) {
      setErrorOperacion(
        'El título de la tarea no puede estar vacío'
      )
      return false
    }

    const tarea = tareas.find(item => item.id === id)

    if (!tarea) {
      setErrorOperacion('No se encontró la tarea')
      return false
    }

    // Evitar editar una tarea que ya se está actualizando.
    if (actualizandoRef.current.has(id)) {
      return false
    }

    // No enviar solicitudes si el título no cambió.
    if (tarea.titulo === tituloLimpio) {
      setErrorOperacion(null)
      return true
    }

    actualizandoRef.current.add(id)
    setActualizandoIds(previas => [...previas, id])
    setErrorOperacion(null)

    try {
      // Las tareas originales se actualizan mediante PATCH.
      if (tarea.remotoId !== null) {
        await actualizarTareaRemota(tarea.remotoId, {
          titulo: tituloLimpio,
        })
      }

      // Actualizar únicamente la tarea seleccionada.
      setTareas(previas =>
        previas.map(item =>
          item.id === id
            ? { ...item, titulo: tituloLimpio }
            : item
        )
      )

      return true
    } catch (err) {
      setErrorOperacion(
        err.message || 'No fue posible editar la tarea'
      )
      return false
    } finally {
      actualizandoRef.current.delete(id)

      setActualizandoIds(previas =>
        previas.filter(itemId => itemId !== id)
      )
    }
  }


  return {
    tareas,
    cargando,
    error,
    agregando,
    errorOperacion,
    actualizandoIds,
    agregarTarea,
    alternarTarea,
    editarTarea,
  }
}

export default useTareas
