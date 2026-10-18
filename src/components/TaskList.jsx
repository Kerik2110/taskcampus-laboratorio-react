import { useState } from 'react';

export default function TaskList({
  tareas = [],
  filtro = 'todas',
  busqueda = '',
  onCompletar,
  onEditar,
  onSolicitarEliminar,
}) {
  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicion, setTextoEdicion] = useState('');

  // Filtrado y búsqueda sobre el listado recibido
  const tareasFiltradas = tareas.filter((tarea) => {
    if (filtro === 'pendientes' && tarea.completada) return false;
    if (filtro === 'completadas' && !tarea.completada) return false;

    if (
      busqueda.trim() !== '' &&
      !tarea.titulo.toLowerCase().includes(busqueda.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const iniciarEdicion = (tarea) => {
    setEditandoId(tarea.id);
    setTextoEdicion(tarea.titulo);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEdicion('');
  };

  const guardarEdicion = (id) => {
    const textoLimpio = textoEdicion.trim();
    if (textoLimpio !== '' && onEditar) {
      onEditar(id, textoLimpio);
    }
    cancelarEdicion();
  };

  const manejarKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      guardarEdicion(id);
    } else if (e.key === 'Escape') {
      cancelarEdicion();
    }
  };

  return (
    <section className="card">
      <h2 className="section-title">Listado de tareas</h2>

      {tareas.length === 0 ? (
        <p className="mensaje-vacio">No hay tareas registradas en el sistema.</p>
      ) : tareasFiltradas.length === 0 ? (
        <p className="mensaje-vacio">
          No se encontraron tareas que coincidan con el filtro actual.
        </p>
      ) : (
        <ul className="task-list">
          {tareasFiltradas.map((tarea) => {
            const estaEditando = editandoId === tarea.id;

            return (
              <li
                key={tarea.id}
                className={`task-item ${tarea.completada ? 'completada' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() => onCompletar && onCompletar(tarea.id)}
                  className="task-checkbox"
                  aria-label={`Marcar tarea ${tarea.titulo}`}
                />

                {estaEditando ? (
                  <input
                    type="text"
                    value={textoEdicion}
                    autoFocus
                    onChange={(e) => setTextoEdicion(e.target.value)}
                    onBlur={() => guardarEdicion(tarea.id)}
                    onKeyDown={(e) => manejarKeyDown(e, tarea.id)}
                    className="input-edicion"
                  />
                ) : (
                  <span
                    className="task-titulo"
                    onDoubleClick={() => iniciarEdicion(tarea)}
                    title="Doble clic para editar el título"
                  >
                    {tarea.titulo}
                  </span>
                )}

                <button
                  type="button"
                  className="task-button btn-eliminar"
                  onClick={() => onSolicitarEliminar && onSolicitarEliminar(tarea)}
                  title="Eliminar tarea"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}