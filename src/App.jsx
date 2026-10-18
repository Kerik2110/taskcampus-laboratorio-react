
import { useState } from 'react'
import './App.css'

import Header from './components/Header'
import TaskSummary from './components/TaskSummary'
import TaskList from './components/TaskList'
import ActionButton from './components/ActionButton'

const tareasIniciales = [
  {
    id: 'local-1',
    remotoId: null,
    titulo: 'Aprender qué es React',
    completada: false,
  },
  {
    id: 'local-2',
    remotoId: null,
    titulo: 'Crear proyecto con Vite',
    completada: false,
  },
  {
    id: 'local-3',
    remotoId: null,
    titulo: 'Practicar JSX',
    completada: false,
  },
]

function App() {
  const [tareas, setTareas] = useState(tareasIniciales)
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')

  // Valores derivados del estado principal.
  const total = tareas.length
  const completadas = tareas.filter(t => t.completada).length
  const pendientes = total - completadas

  // Aplicamos simultáneamente el filtro y la búsqueda.
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

  // Implementación local provisional.
  // Después usaremos el hook y la API.
  function handleCompletar(id) {
    setTareas(previas =>
      previas.map(tarea =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
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
      />

      <ActionButton onReview={reviewTasks} />
    </main>
  )
}

export default App
