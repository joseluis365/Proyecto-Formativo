Stack Tecnológico
Backend

Laravel 12

PostgreSQL (actualmente dependiente de ILIKE)

Laravel Sanctum

Arquitectura moderna (bootstrap/app.php)

Middleware personalizado licencia.activa

API Resources (uso parcial, en proceso de estandarización)

FormRequest (uso mayoritario, pendiente unificación total)

Frontend

React + React Router v6

Arquitectura con Layouts anidados (<Outlet />)

Separación estricta Admin / SuperAdmin

axios.js para Admin

superadminAxios.js para SuperAdmin

Hooks reutilizables (useTableData, hooks de catálogos)

framer-motion para animaciones UI

Arquitectura General
Backend

Separación clara MVC

Soft delete lógico mediante id_estado

Seeders estructurados y portables

Middleware de licencia aplicado a rutas protegidas

Contratos JSON parcialmente estandarizados con Resources

Riesgo actual: dependencia a PostgreSQL por uso de ILIKE

Frontend

Layouts jerárquicos:

DashboardLayout

SuperAdminLayout

IndexLayout

Módulo Gestión Interna implementado con rutas anidadas reales

Hook centralizado useTableData para paginación y filtros

Duplicación detectada en modales CRUD (pendiente unificación futura)

Autenticación
Usuario normal

POST /api/login

Tabla: usuario

Campo: contrasena (mutator automático hash)

Sesión: localStorage

Protegido con auth:sanctum + licencia.activa

SuperAdmin

POST /api/superadmin/login

Tabla: superadmin

Sesión: sessionStorage

Flujo independiente del Admin normal

No comparte axios ni token

Reglas Arquitectónicas Activas

NO mezclar sesiones Admin y SuperAdmin.

NO modificar UserFormConfig.js sin autorización explícita.

NO cambiar estructura de payload.

NO asumir campos que no existan en BD.

NO cambiar nombres de columnas.

Respetar consistencia de id_estado.

Filtrar registros activos con id_estado = 1.

No introducir lógica de negocio en controladores.

Mantener compatibilidad con migrate:fresh --seed.

Estado Actual del Backend
Fortalezas

Middleware de licencia correctamente implementado.

Seeders idempotentes y portables.

Uso mayoritario de FormRequest.

Arquitectura estable y funcional.

Riesgos Detectados

Uso de ILIKE (dependencia PostgreSQL).

Hardcoding de estados (id_estado = 1).

Validaciones fragmentadas en algunos update.

Uso inconsistente de API Resources en ciertos endpoints.

Estado Actual del Frontend
Fortalezas

Rutas anidadas correctamente implementadas.

Layout persistente funcional.

Separación modular clara.

Hook useTableData centralizado.

Deuda Técnica Detectada

Duplicación de modales CRUD.

Inconsistencias en uso de hooks en algunos catálogos.

Duplicación parcial de instancias axios.

Componentes atómicos no completamente unificados.

Seeders Portables

El sistema debe funcionar con:

php artisan migrate:fresh --seed

Y dejar automáticamente:

Empresa activa (id_estado = 1)

Licencia activa con fechas válidas

Usuario admin activo

Estados y roles correctamente creados

Objetivo Arquitectónico Actual

Consolidación y Profesionalización del Sistema:

Frontend

Unificación futura de modales CRUD.

Estandarización completa de catálogos.

Eliminación progresiva de duplicación.

Mantener estabilidad sin romper formularios existentes.

Backend

Eliminar dependencia ILIKE (hacer búsquedas agnósticas).

Estandarizar uso de API Resources en todos los controladores.

Eliminar validaciones manuales en controllers.

Migrar hardcodes a constantes o Enums.

Mantener portabilidad total.

Principio Rector del Proyecto

Primero estabilidad.
Luego estandarización.
Luego optimización.
Nunca refactorizar sin diagnóstico completo.