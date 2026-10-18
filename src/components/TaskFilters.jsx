export default function TaskFilters({
  filtro = 'todas',
  onCambiarFiltro,
  busqueda = '',
  onCambiarBusqueda,
}) {
  const opcionesFiltro = [
    { id: 'todas', etiqueta: 'Todas' },
    { id: 'pendientes', etiqueta: 'Pendientes' },
    { id: 'completadas', etiqueta: 'Completadas' },
  ];

  return (
    <div className="filters-container card">
      <div className="search-box">
        <input
          type="text"
          className="input-busqueda"
          placeholder="🔍 Buscar tarea por título..."
          value={busqueda}
          onChange={(e) => onCambiarBusqueda && onCambiarBusqueda(e.target.value)}
        />
        {busqueda && (
          <button
            type="button"
            className="btn-limpiar-busqueda"
            onClick={() => onCambiarBusqueda && onCambiarBusqueda('')}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-buttons" role="group" aria-label="Filtro de tareas">
        {opcionesFiltro.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            className={`btn-filtro ${filtro === opcion.id ? 'active' : ''}`}
            onClick={() => onCambiarFiltro && onCambiarFiltro(opcion.id)}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}