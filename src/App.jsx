
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
    eliminandoIds,
    agregarTarea,
    alternarTarea,
    editarTarea,
    eliminarTarea,
  } = useTareas()

  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [tituloNuevo, setTituloNuevo] = useState('')

  const [editandoId, setEditandoId] = useState(null)
  const [borradorTitulo, setBorradorTitulo] = useState('')

  // Estadisticas derivadas.
  const total = tareas.length
  const completadas = tareas.filter(
    tarea => tarea.completada
  ).length
  const pendientes = total - completadas

  // Filtrado y busqueda.
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

  // Crear tarea.
  async function handleCrear(event) {
    event.preventDefault()

    const creada = await agregarTarea(tituloNuevo)

    if (creada) {
      setTituloNuevo('')
    }
  }

  // Iniciar edicion.
  function iniciarEdicion(tarea) {
    setEditandoId(tarea.id)
    setBorradorTitulo(tarea.titulo)
  }

  // Cancelar edicion.
  function cancelarEdicion() {
    setEditandoId(null)
    setBorradorTitulo('')
  }

  // Guardar edicion.
  async function guardarEdicion(id) {
    const guardada = await editarTarea(id, borradorTitulo)

    if (guardada) {
      cancelarEdicion()
    }
  }

  // Confirmar antes de eliminar una tarea.
  async function handleSolicitarEliminar(id) {
    const tarea = tareas.find(item => item.id === id)

    if (!tarea) {
      return false
    }

    const confirmada = window.confirm(
      `¿Estás seguro de eliminar la tarea "${tarea.titulo}"?`
    )

    if (!confirmada) {
      return false
    }

    return eliminarTarea(id)
  }

  // Accion original.
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
        <p role="status">
          Cargando tareas desde la API...
        </p>
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

      {/* Componente de James: pendiente de integracion */}
      <TaskList
        tareas={tareasVisibles}
        filtro={filtro}
        busqueda={busqueda}
        onCambiarFiltro={setFiltro}
        onCambiarBusqueda={setBusqueda}
        onCompletar={alternarTarea}
        onEditar={editarTarea}
        onSolicitarEliminar={handleSolicitarEliminar}
        actualizandoIds={actualizandoIds}
        eliminandoIds={eliminandoIds}
        cargando={cargando}
        error={error}
      />

      {/* Formulario temporal de creacion */}
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
            disabled={agregando || cargando}
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
            disabled={agregando || cargando}
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

      {/* Pruebas temporales del CRUD */}
      <section className="card">
        <h2 className="section-title">
          Prueba de gestión de tareas
        </h2>

        <p style={{ marginBottom: '16px' }}>
          Total: {total}
          {' | '}
          Pendientes: {pendientes}
          {' | '}
          Completadas: {completadas}
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

            const eliminando =
              eliminandoIds.includes(tarea.id)

            const ocupada = actualizando || eliminando

            return (
              <li key={tarea.id} className="task-item">
                {editandoId === tarea.id ? (
                  <form
                    onSubmit={event => {
                      event.preventDefault()
                      guardarEdicion(tarea.id)
                    }}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flex: 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={borradorTitulo}
                      onChange={event =>
                        setBorradorTitulo(event.target.value)
                      }
                      onKeyDown={event => {
                        if (event.key === 'Escape') {
                          cancelarEdicion()
                        }
                      }}
                      disabled={ocupada}
                      aria-label="Editar título de tarea"
                      style={{
                        flex: 1,
                        minWidth: '160px',
                        padding: '8px',
                      }}
                    />

                    <button
                      type="submit"
                      className="task-button-secondary"
                      disabled={ocupada}
                    >
                      {actualizando
                        ? 'Guardando...'
                        : 'Guardar'}
                    </button>

                    <button
                      type="button"
                      className="task-button-secondary"
                      onClick={cancelarEdicion}
                      disabled={ocupada}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <span>
                      {tarea.titulo}
                      {' — '}
                      <strong>
                        {tarea.completada
                          ? 'Completada'
                          : 'Pendiente'}
                      </strong>
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        type="button"
                        className="task-button-secondary"
                        onClick={() => iniciarEdicion(tarea)}
                        disabled={ocupada}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="task-button-secondary"
                        onClick={() =>
                          alternarTarea(tarea.id)
                        }
                        disabled={ocupada}
                      >
                        {actualizando
                          ? 'Actualizando...'
                          : tarea.completada
                            ? 'Marcar pendiente'
                            : 'Completar'}
                      </button>

                      <button
                        type="button"
                        className="task-button-secondary"
                        onClick={() =>
                          handleSolicitarEliminar(tarea.id)
                        }
                        disabled={ocupada}
                      >
                        {eliminando
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>
                    </div>
                  </>
                )}
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
