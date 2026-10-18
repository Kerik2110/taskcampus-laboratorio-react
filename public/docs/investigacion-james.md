# Validación de James - TaskCampus

## Funcionalidades desarrolladas

* Renderizado dinámico de la lista de tareas con `map` y uso de `id` para las `key`.
* Edición en línea activada con doble clic sobre el título de la tarea, guardando con Enter o al perder foco, y cancelando con Escape.
* Formulario controlado con validación local para no permitir campos vacíos ni espacios en blanco.
* Sistema de filtros por estado (Todas, Pendientes, Completadas) y buscador por texto que filtra mientras se escribe.
* Panel de resumen con cálculo dinámico de tareas totales, pendientes, completadas, visibles y barra de porcentaje.
* Barra de navegación por pestañas para alternar entre las vistas de resumen, listado y nueva tarea sin recargar el navegador.
* Modal de confirmación para validar o cancelar la eliminación física de una tarea seleccionada.
* Hoja de estilos en CSS para tarjetas, botones, estados activos, bloqueo de botones y corrección de contraste para modo oscuro.

## Registro de pruebas

| Caso | Resultado | Estado |
|---|---|---|
| P10 - Renderizado dinámico | Carga la lista inicial sin warnings de keys en la consola | Correcto |
| P11 - Edición con doble clic | Abre el input en la tarea seleccionada y actualiza el título | Correcto |
| P12 - Cancelación de edición | Presionar Escape cierra el input y no altera el texto original | Correcto |
| P13 - Formulario controlado | Muestra advertencia al intentar enviar vacío y limpia el campo al agregar | Correcto |
| P14 - Filtro por estado | Separa de forma correcta las tareas según estén marcadas o no | Correcto |
| P15 - Búsqueda en tiempo real | Filtra las tareas según el texto ingresado sin importar mayúsculas | Correcto |
| P16 - Resumen y avance | Los contadores y la barra de progreso cambian de inmediato al interactuar | Correcto |
| P17 - Navegación por pestañas | Cambia de vista y resalta el botón activo de forma instantánea | Correcto |
| P18 - Modal de eliminación | Muestra el nombre de la tarea a borrar y permite cancelar la acción | Correcto |
| P19 - Bloqueo de botones | Los botones quedan deshabilitados ante entradas inválidas o en espera | Correcto |

## Análisis técnico y experimentación

### Navegación con useState y renderizado condicional
Al probar la navegación, comprobé que no era necesario instalar librerías externas de rutas como React Router. Con un estado simple (`vistaActiva`) que almacene si estoy en `'resumen'`, `'tareas'` o `'nueva'`, y usando renderizado condicional (`{vistaActiva === 'tareas' && <TaskList />}`), el navegador cambia de sección al instante. Esto mantiene el proyecto liviano, evita recargas de página completas y no pierde los datos que están en memoria.

### Estado derivado (Derived State)
Durante el desarrollo del resumen y los filtros, experimenté que era un error crear un `useState` para cada cálculo (como un estado para las tareas pendientes, otro para las completadas y otro para las filtradas). Si hacía eso, cada vez que marcaba un checkbox tenía que actualizar múltiples estados a mano, lo que provocaba desfases en los números. La solución fue calcular todo directamente en el render a partir del array principal de tareas y el texto de búsqueda. Así, la interfaz siempre muestra los datos reales y sincronizados.

### Actualización funcional del estado
Al probar la edición del título y el marcado de tareas en la lista, utilicé la actualización funcional `setTareas(prev => prev.map(...))`. Esto asegura que al modificar una tarea dentro del array, React siempre tome la última versión del estado disponible. Si no se hace de forma funcional, al realizar cambios rápidos o consecutivos se corre el riesgo de sobreescribir datos anteriores con un estado desactualizado.

### Comportamiento con API simulada e identificadores
Al interactuar con la lista de tareas simulada comprobé la importancia de las `key` en React. JSONPlaceholder siempre devuelve `id: 101` para cualquier tarea creada por POST; si usaba ese valor como identificador en la interfaz, React arrojaba errores en consola por claves duplicadas al agregar más de una tarea. Para resolverlo en mis pruebas, cada tarea nueva se generó con un identificador local único (por ejemplo con marca de tiempo), garantizando que el DOM diferencie cada elemento sin colisiones y permitiendo que la edición y el modal de borrado apunten exactamente a la tarea seleccionada.