
import { useState } from 'react'
import './App.css'

import Header from './components/Header'
import TaskSummary from './components/TaskSummary'
import TaskList from './components/TaskList'
import ActionButton from './components/ActionButton'
import useTareas from './hooks/useTareas'

function App() {
  const {
    tareas,
    cargando,
    error,
    agregando,
    errorOperacion,
    actualizandoIds,
    agregarTarea,
    alternarTarea,
  } = useTareas()

  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [tituloNuevo, setTituloNuevo] = useState('')

  // Estadísticas derivadas del estado principal.
  const total = tareas.length
  const completadas = tareas.filter(
    tarea => tarea.completada
  ).length
  const pendientes = total - completadas

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

  async function handleCrear(event) {
    event.preventDefault()

    const creada = await agregarTarea(tituloNuevo)

    if (creada) {
      setTituloNuevo('')
    }
  }

  function reviewTasks() {
    alert(`Tienes ${pendientes} tareas pendientes por revisar`)
  }

  const tareasLocales = tareas.filter(
    tarea => tarea.remotoId === null
  )

  return (
    <main className="app-container">
      <Header
        title="TaskCampus"
        description="Gestor de tareas académicas"
      />

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
          Conexión exitosa: {total} tareas disponibles.
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
        onCompletar={alternarTarea}
        cargando={cargando}
        error={error}
      />

      {/* Formulario temporal de la tarea 5 */}
      <section className="card">
        <h2 className="section-title">
          Prueba de creación de tareas
        </h2>

        <form
          onSubmit={handleCrear}
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <input
            type="text"
            value={tituloNuevo}
            onChange={event =>
              setTituloNuevo(event.target.value)
            }
            placeholder="Escribe una nueva tarea"
            aria-label="Título de la nueva tarea"
            disabled={agregando}
            style={{
              padding: '10px',
              flex: '1 1 220px',
              border: '1px solid #93c5fd',
              borderRadius: '8px',
            }}
          />

          <button
            type="submit"
            className="task-button"
            disabled={agregando}
          >
            {agregando ? 'Guardando...' : 'Agregar tarea'}
          </button>
        </form>

        {tareasLocales.length > 0 && (
          <div style={{ marginTop: '18px' }}>
            <h3>Tareas creadas durante esta sesión</h3>

            <ul className="task-list">
              {tareasLocales.map(tarea => (
                <li key={tarea.id} className="task-item">
                  {tarea.titulo}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Sección temporal para comprobar PATCH */}
      <section className="card">
        <h2 className="section-title">
          Prueba de cambio de estado
        </h2>

        <p style={{ marginBottom: '16px' }}>
          Tareas pendientes: {pendientes} |
          {' '}Completadas: {completadas}
        </p>

        {errorOperacion && (
          <p
            role="alert"
            style={{
              color: '#dc2626',
              marginBottom: '12px',
            }}
          >
            {errorOperacion}
          </p>
        )}

        <ul className="task-list">
          {tareas.map(tarea => {
            const actualizando =
              actualizandoIds.includes(tarea.id)

            return (
              <li key={tarea.id} className="task-item">
                <span>
                  {tarea.titulo}
                  {' — '}
                  <strong>
                    {tarea.completada
                      ? 'Completada'
                      : 'Pendiente'}
                  </strong>
                </span>

                <button
                  type="button"
                  className="task-button-secondary"
                  disabled={actualizando}
                  onClick={() => alternarTarea(tarea.id)}
                >
                  {actualizando
                    ? 'Actualizando...'
                    : tarea.completada
                      ? 'Marcar pendiente'
                      : 'Completar'}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <ActionButton onReview={reviewTasks} />
    </main>
  )
}

export default App
