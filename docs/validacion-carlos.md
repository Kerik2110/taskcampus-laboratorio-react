
# Validación de Carlos - TaskCampus

## Funcionalidades desarrolladas

- GET: carga de 10 tareas desde JSONPlaceholder.
- POST: creación de tareas y validación de títulos.
- PATCH: completar, desmarcar y editar tareas.
- DELETE: eliminación de tareas.
- Hook personalizado useTareas.
- Gestión de estados de carga, error y operaciones pendientes.
- Identificadores locales únicos.

## Registro de pruebas

| Caso | Resultado | Estado |
|---|---|---|
| P01 - Carga de diez tareas | Se cargaron 10 tareas | Correcto |
| P02 - Creación POST | Las tareas nuevas aparecen sin recargar | Correcto |
| P03 - Título vacío | Muestra error y no crea la tarea | Correcto |
| P04 - Completar/desmarcar | PATCH actualiza estado y contadores | Correcto |
| P05 - Editar títulos | PATCH actualiza títulos originales | Correcto |
| P06 - Eliminar tareas | Pendiente de registrar evidencia final | Pendiente |
| P07 - Identificadores locales | Pendiente de registrar comprobación | Pendiente |
| P08 - Error HTTP | Failed to fetch; se conserva el estado anterior | Correcto |
| P09 - Operación pendiente | Falta evidencia de botones deshabilitados | Pendiente |

## API simulada

JSONPlaceholder no conserva las operaciones POST, PATCH y DELETE.
Los cambios exitosos se mantienen en el estado de React durante la
sesión y pueden perderse al recargar la aplicación.

Las tareas originales conservan un remotoId válido.
Las tareas creadas localmente utilizan remotoId = null y
un identificador local único.

Las operaciones posteriores sobre tareas locales se resuelven
en el estado de React, sin simular una solicitud remota inexistente.
