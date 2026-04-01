# PROJECT CONTEXT - Proyecto Formativo

## 1) Estado general actual

Repositorio monorepo con dos aplicaciones principales:

- `api/`: backend Laravel 12 (API REST + auth + reportes + PDFs + eventos realtime).
- `React-Eps/`: frontend React + Vite (modulos por rol: SuperAdmin, Admin, Medico, Paciente, Farmacia, Examenes).

El proyecto esta orientado a gestion integral tipo EPS/IPS: usuarios, empresas/licencias, citas, atencion medica, historia clinica, examenes, farmacia, PQRS, reportes y paneles.

---

## 2) Stack tecnologico vigente

### Backend (`api`)

- Laravel 12
- PHP ^8.2
- Laravel Sanctum (tokens)
- Laravel Reverb + broadcasting (actividad en tiempo real)
- barryvdh/laravel-dompdf (exportacion PDF)
- Mews Purifier
- Pest para pruebas

DB soportada por Laravel config (sqlite/mysql/mariadb/pgsql/sqlsrv), con uso real de patrones orientados a PostgreSQL en algunas consultas (`ILIKE`).

### Frontend (`React-Eps`)

- React 19
- React Router DOM 7
- Vite (rolldown-vite)
- Tailwind CSS 4
- Axios
- React Hook Form + Zod
- Framer Motion
- Recharts
- SweetAlert2
- Laravel Echo + Pusher JS (realtime)

---

## 3) Arquitectura backend (actual)

### Capas principales

- Rutas: `api/routes/api.php` (principal), `web.php`, `console.php`, `channels.php`
- Controladores: `api/app/Http/Controllers/Api/*`
- Modelos Eloquent: `api/app/Models/*`
- Validaciones: `api/app/Http/Requests/*` y `api/app/Http/Requests/Auth/*`
- Recursos JSON: `api/app/Http/Resources/*`
- Servicios: `api/app/Services/*`
- Mailables: `api/app/Mail/*`
- Middleware custom: `CheckLicenciaActiva`
- Eventos: `SystemActivityEvent`

### Modulos funcionales backend

- Autenticacion usuario general (`/login`, 2FA admin, recovery password)
- Autenticacion superadmin (`/superadmin/*`, flujo separado)
- Usuarios y gestion empresarial
- Licencias y relacion empresa-licencia
- Agenda de citas (crear, actualizar, reagendar, no asistio, autocancelacion)
- Atencion medica e historia clinica (resumen, completo, evolucion, export PDF)
- Examenes clinicos (agenda, atencion, resultado)
- Farmacia (inventario, movimientos, dispensacion, dashboard, reportes)
- Catalogos internos (roles, estados, tipos, prioridades, especialidades, ubicaciones, etc.)
- PQRS y contacto
- Reporteria

### Seguridad y sesiones

- Usuario general: token Sanctum en `localStorage` (frontend)
- Superadmin: token/session separados en `sessionStorage` (frontend)
- Middleware aplicado en rutas protegidas: `auth:sanctum` + `licencia.activa`

---

## 4) Arquitectura frontend (actual)

### Estructura principal

- Entrada: `React-Eps/src/main.jsx`
- Ruteo principal: `React-Eps/src/App.jsx`
- Contextos globales:
  - `LayoutContext.jsx`
  - `ToastContext.jsx`
- Clientes API:
  - `src/Api/axios.js`
  - `src/Api/superadminAxios.js`
  - `src/Api/bloqueoAgenda.js`
- Realtime:
  - `src/lib/echo.js`

### Layouts activos por dominio

- `AdminLayout`
- `DoctorLayout`
- `PatientLayout`
- `FarmaciaLayout`
- `SuperAdminLayout`
- `LoginLayout`
- `IndexLayout`

### Modulos de paginas

- `Pages/Inicio/*`
- `Pages/Admin/*`
- `Pages/Medico/*`
- `Pages/Paciente/*`
- `Pages/Farmacia/*`
- `Pages/Examenes/*`
- `Pages/Personal/*`
- `Pages/SuperAdmin/*`

### Patrones de frontend

- Guardas de ruta por rol (`components/Routes/*`)
- Hooks de dominio para carga y estado (`src/hooks/*`)
- Validaciones con esquemas (`src/schemas/*`, `src/utils/validations/*`)
- Componentizacion por areas (`src/components/*`)

---

## 5) Dominio funcional consolidado

El sistema hoy cubre de forma integrada:

- Registro y autenticacion de actores
- Gestion de empresas y licencias
- Agenda y atencion medica
- Historia clinica y evolucion
- Remisiones y examenes
- Recetas y modulo farmacia
- PQRS/contacto
- Reportes y exportaciones PDF
- Actividad en tiempo real para paneles

---

## 6) Convenciones y reglas de trabajo

- Mantener separacion de sesiones entre usuario general y superadmin.
- No mezclar clientes Axios de dominios distintos.
- Respetar contratos JSON actuales para no romper frontend/backend.
- Evitar cambios de nombres de columnas/campos sin plan de migracion completo.
- Priorizar uso de FormRequest, Resources y servicios para logica reutilizable.
- Mantener compatibilidad funcional de rutas protegidas con licencia activa.

---

## 7) Riesgos y deuda tecnica vigente

- Dependencia parcial a PostgreSQL por consultas con `ILIKE`.
- Existen segmentos con hardcodes de estados/roles que deben migrar a constantes/enums.
- Hay heterogeneidad en algunos hooks/componentes heredados del frontend.
- Falta estandarizacion total de algunos contratos y capas de reporte.

---

## 8) Objetivo de evolucion (corto/mediano plazo)

- Estandarizar completamente:
  - validaciones
  - respuestas API
  - manejo de errores
- Reducir dependencia de SQL dialect-specific donde aplique.
- Consolidar reporteria configurable (filtros + exportes).
- Mantener estabilidad funcional antes de refactors grandes.

Principio rector:

1. Estabilidad primero.
2. Estandarizacion despues.
3. Optimizacion al final.

---

## 9) Documentacion interna actual disponible

### Backend

- `api/COMMENTARY-backend.md`
- `api/COMMENTARY-secciones.md`

### Frontend

- `React-Eps/COMMENTARY-frontend.md`
- `React-Eps/COMMENTARY-secciones-frontend.md`
- `React-Eps/src/Api/COMMENTARY-api.md`
- `React-Eps/src/Pages/COMMENTARY-pages.md`
- `React-Eps/src/components/COMMENTARY-components.md`
- `React-Eps/src/hooks/COMMENTARY-hooks.md`
- `React-Eps/src/layouts/COMMENTARY-layouts.md`
- `React-Eps/src/schemas/COMMENTARY-schemas.md`
- `React-Eps/src/data/COMMENTARY-data.md`
- `React-Eps/src/utils/COMMENTARY-utils.md`

Estas referencias sirven como mapa rapido para onboarding y mantenimiento.
