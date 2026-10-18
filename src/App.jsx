
import { useState } from 'react'
import './App.css'

import Header from './components/Header'
import TaskSummary from './components/TaskSummary'
import TaskList from './components/TaskList'
import ActionButton from './components/ActionButton'
import useTareas from './hooks/useTareas'

function App() {
  // Las tareas ahora provienen de nuestro hook.
  const {
    tareas,
    setTareas,
    cargando,
    error,
  } = useTareas()

  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  // Contadores derivados de las tareas actuales.
  const total = tareas.length

  const completadas = tareas.filter(
    tarea => tarea.completada
  ).length

  const pendientes = total - completadas

  // Aplicamos filtros y búsqueda simultáneamente.
  const tareasVisibles = tareas.filter(tarea => {
    const cumpleFiltro =
      filtro === 'todas' ||
      (filtro === 'completadas' && tarea.completada) ||
      (filtro === 'pendientes' && !tarea.completada)

    const cumpleBusqueda = tarea.titulo
      .toLocaleLowerCase('es')
      .includes(busqueda.trim().toLocaleLowerCase('es'))

    return cumpleFiltro && cumpleBusqueda
  })

  // Cambio de estado local provisional.
  // En la tarea 6 lo conectaremos con PATCH.
  function handleCompletar(id) {
    setTareas(previas =>
      previas.map(tarea =>
        tarea.id === id
          ? {
              ...tarea,
              completada: !tarea.completada,
            }
          : tarea
      )
    )
  }

  function reviewTasks() {
    alert(`Tienes ${pendientes} tareas pendientes por revisar`)
  }

  return (
    <main className="app-container">
      <Header
        title="TaskCampus"
        description="Gestor de tareas académicas"
      />

      {/* Información sobre la conexión con la API */}
      {cargando && (
        <p role="status">Cargando tareas desde la API...</p>
      )}

      {error && (
        <p role="alert" style={{ color: '#dc2626' }}>
          Error: {error}
        </p>
      )}

      {!cargando && !error && (
        <p role="status">
          Conexión exitosa: {total} tareas cargadas desde la API.
        </p>
      )}

      <TaskSummary
        total={pendientes}
        pendientes={pendientes}
        completadas={completadas}
        mostrando={tareasVisibles.length}
      />

      <TaskList
        tareas={tareasVisibles}
        filtro={filtro}
        busqueda={busqueda}
        onCambiarFiltro={setFiltro}
        onCambiarBusqueda={setBusqueda}
        onCompletar={handleCompletar}
        cargando={cargando}
        error={error}
      />

      <ActionButton onReview={reviewTasks} />
    </main>
  )
}

export default App
