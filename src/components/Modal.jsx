export default function Modal({
  tarea = null,
  onConfirmar,
  onCancelar,
  deshabilitado = false,
}) {
  if (!tarea) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <h3 id="modal-title" className="modal-title">
          Confirmar eliminación
        </h3>
        
        <p className="modal-mensaje">
          ¿Estás seguro de que deseas eliminar la tarea{' '}
          <strong>"{tarea.titulo}"</strong>?
        </p>

        <p className="modal-advertencia">
          Esta acción no se puede deshacer.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="task-button btn-cancelar"
            onClick={onCancelar}
            disabled={deshabilitado}
          >
            Cancelar
          </button>
          
          <button
            type="button"
            className="task-button btn-confirmar-eliminar"
            onClick={() => onConfirmar && onConfirmar(tarea.id)}
            disabled={deshabilitado}
          >
            {deshabilitado ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}