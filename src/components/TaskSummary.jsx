export default function TaskSummary({
  total = 0,
  pendientes = 0,
  completadas = 0,
  mostrando = 0,
}) {
  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <section className="card task-summary-card">
      <h2 className="section-title">Resumen de tareas</h2>

      <div className="summary-grid">
        <div className="summary-item total">
          <span className="summary-label">Total creadas</span>
          <strong className="summary-value">{total}</strong>
        </div>

        <div className="summary-item pendientes">
          <span className="summary-label">Pendientes</span>
          <strong className="summary-value">{pendientes}</strong>
        </div>

        <div className="summary-item completadas">
          <span className="summary-label">Completadas</span>
          <strong className="summary-value">{completadas}</strong>
        </div>

        <div className="summary-item mostrando">
          <span className="summary-label">Visibles ahora</span>
          <strong className="summary-value">{mostrando}</strong>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-header">
          <span>Progreso general</span>
          <span>{porcentaje}%</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>
    </section>
  );
}