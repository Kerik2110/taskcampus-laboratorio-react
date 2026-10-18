export default function Navigation({ vistaActiva = 'tareas', onCambiarVista }) {
  const vistas = [
    { id: 'resumen', etiqueta: 'RESUMEN' },
    { id: 'tareas', etiqueta: 'LISTADO DE TAREAS' },
    { id: 'nueva', etiqueta: 'NUEVA TAREA' },
  ];

  return (
    <nav className="navigation-tabs" aria-label="Navegación principal">
      {vistas.map((vista) => (
        <button
          key={vista.id}
          type="button"
          className={`nav-tab ${vistaActiva === vista.id ? 'active' : ''}`}
          onClick={() => onCambiarVista && onCambiarVista(vista.id)}
        >
          {vista.etiqueta}
        </button>
      ))}
    </nav>
  );
}