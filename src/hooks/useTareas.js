
import { useEffect, useRef, useState } from 'react'
import {
  obtenerTareas,
  crearTareaRemota,
  actualizarTareaRemota,
  eliminarTareaRemota,
} from '../services/tareasService'

function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [agregando, setAgregando] = useState(false)
  const [errorOperacion, setErrorOperacion] = useState(null)

  const [actualizandoIds, setActualizandoIds] = useState([])
  const [eliminandoIds, setEliminandoIds] = useState([])

  const creandoRef = useRef(false)
  const actualizandoRef = useRef(new Set())

  // GET: cargar las primeras 10 tareas.
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
    const tituloLimpio =
      typeof titulo === 'string' ? titulo.trim() : ''

    if (!tituloLimpio) {
      setErrorOperacion(
        'El título de la tarea no puede estar vacío'
      )
      return false
    }

    if (creandoRef.current || cargando) {
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

  // PATCH: completar o desmarcar una tarea.
  async function alternarTarea(id) {
    const tarea = tareas.find(item => item.id === id)

    if (!tarea) {
      setErrorOperacion('No se encontró la tarea')
      return false
    }

    if (actualizandoRef.current.has(id)) {
      return false
    }

    actualizandoRef.current.add(id)
    setActualizandoIds(previas => [...previas, id])
    setErrorOperacion(null)

    const nuevoEstado = !tarea.completada

    try {
      if (tarea.remotoId !== null) {
        await actualizarTareaRemota(tarea.remotoId, {
          completada: nuevoEstado,
        })
      }

      setTareas(previas =>
        previas.map(item =>
          item.id === id
            ? { ...item, completada: nuevoEstado }
            : item
        )
      )

      return true
    } catch (err) {
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

    if (actualizandoRef.current.has(id)) {
      return false
    }

    if (tarea.titulo === tituloLimpio) {
      setErrorOperacion(null)
      return true
    }

    actualizandoRef.current.add(id)
    setActualizandoIds(previas => [...previas, id])
    setErrorOperacion(null)

    try {
      if (tarea.remotoId !== null) {
        await actualizarTareaRemota(tarea.remotoId, {
          titulo: tituloLimpio,
        })
      }

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

  // DELETE: eliminar una tarea.
  async function eliminarTarea(id) {
    const tarea = tareas.find(item => item.id === id)

    if (!tarea) {
      setErrorOperacion('No se encontró la tarea')
      return false
    }

    // Evitar eliminar mientras se edita, completa
    // o elimina la misma tarea.
    if (actualizandoRef.current.has(id)) {
      return false
    }

    actualizandoRef.current.add(id)
    setEliminandoIds(previas => [...previas, id])
    setErrorOperacion(null)

    try {
      // Las tareas originales requieren DELETE remoto.
      if (tarea.remotoId !== null) {
        await eliminarTareaRemota(tarea.remotoId)
      }

      // Eliminar solamente la tarea seleccionada.
      setTareas(previas =>
        previas.filter(item => item.id !== id)
      )

      return true
    } catch (err) {
      // Si falla DELETE, conservamos la tarea.
      setErrorOperacion(
        err.message || 'No fue posible eliminar la tarea'
      )
      return false
    } finally {
      actualizandoRef.current.delete(id)
      setEliminandoIds(previas =>
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
    eliminandoIds,
    agregarTarea,
    alternarTarea,
    editarTarea,
    eliminarTarea,
  }
}

export default useTareas
