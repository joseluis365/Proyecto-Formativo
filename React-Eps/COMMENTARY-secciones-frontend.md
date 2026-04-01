# Frontend por secciones (React-Eps)

## 1) Nucleo de aplicacion
- `src/main.jsx`: bootstrap de React.
- `src/App.jsx`: definicion de rutas y composicion global.
- `src/LayoutContext.jsx` y `src/ToastContext.jsx`: contexto transversal de layout/notificaciones.

## 2) Layouts
- `src/layouts/*`: contenedores por perfil (Admin, Medico, Paciente, Farmacia, SuperAdmin, Inicio).
- `src/layouts/Layout-Components/*`: header/sidebar/footer y piezas estructurales reutilizables.

## 3) Paginas de negocio
- `src/Pages/Admin/*`, `src/Pages/Medico/*`, `src/Pages/Paciente/*`, `src/Pages/Farmacia/*`, `src/Pages/SuperAdmin/*`, `src/Pages/Examenes/*`, `src/Pages/Inicio/*`.

## 4) Componentes reutilizables
- `src/components/*`: tablas, formularios, login y utilidades UI.

## 5) Integracion con backend
- `src/Api/axios.js`, `src/Api/superadminAxios.js`, `src/Api/bloqueoAgenda.js`.

## 6) Hooks de dominio
- `src/hooks/*`: consulta de datos, filtrado, opciones de selects y logica compartida.

## 7) Validaciones y esquemas
- `src/schemas/*` y `src/utils/validations/*`: reglas de validacion por formulario/modulo.

## 8) Configuracion y datos de interfaz
- `src/data/*`, `src/constants/*`, `src/lib/*`, archivos `*FormConfig.js`.
