import { useState } from 'react';

export default function TaskForm({ onCrear, deshabilitado = false, error = null }) {
  const [titulo, setTitulo] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const tituloLimpio = titulo.trim();

    // Validación de campo vacío o solo espacios
    if (!tituloLimpio) {
      setErrorLocal('El título de la tarea no puede estar vacío.');
      return;
    }

    if (tituloLimpio.length < 3) {
      setErrorLocal('El título debe tener al menos 3 caracteres.');
      return;
    }

    // Limpiar error y enviar
    setErrorLocal('');
    if (onCrear) {
      onCrear(tituloLimpio);
    }
    setTitulo('');
  };

  const handleChange = (e) => {
    setTitulo(e.target.value);
// Limpiar el error cuando el usuario empiece a escribir
    if (errorLocal) setErrorLocal(''); 
  };

  return (
    <section className="card">
      <h2 className="section-title">Crear nueva tarea</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <input
            type="text"
            className={`input-tarea ${errorLocal ? 'input-error' : ''}`}
            placeholder="Ej. Estudiar para el certamen de React..."
            value={titulo}
            onChange={handleChange}
            disabled={deshabilitado}
            autoComplete="off"
          />
          <button
            type="submit"
            className="task-button btn-crear"
            disabled={deshabilitado || !titulo.trim()}
          >
            {deshabilitado ? 'Guardando...' : 'Agregar tarea'}
          </button>
        </div>

        {/* Mensaje de validación local (campo en blanco, etc.) */}
        {errorLocal && <p className="mensaje-error">{errorLocal}</p>}

        {/* Mensaje de error remoto (si la API falla) */}
        {error && <p className="mensaje-error-api">{error}</p>}
      </form>
    </section>
  );
}