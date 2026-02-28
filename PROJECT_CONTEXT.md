Stack Tecnológico
🔹 Backend

Laravel 12

PostgreSQL

Laravel Sanctum

Arquitectura moderna (bootstrap/app.php)

Middleware personalizado licencia.activa

API Resources (uso mayoritario, en proceso de estandarización total)

FormRequest (uso casi total, estructura consolidada)

Servicios desacoplados (inicio de arquitectura ReportService)

Configuración extensible vía config/*.php (nuevo patrón para reportes)

🔹 Frontend

React + React Router v6

Arquitectura con Layouts anidados (<Outlet />)

Separación estricta Admin / SuperAdmin

axios.js para Admin

superadminAxios.js para SuperAdmin

Hooks reutilizables (useTableData, hooks por entidad)

framer-motion para animaciones UI

Módulo Gestión Interna consolidado

Módulo Reportes en arquitectura profesional escalable

🏗 Arquitectura General
🔹 Backend

Separación clara MVC

Soft delete lógico mediante id_estado

Seeders estructurados, idempotentes y portables

Secuencias PostgreSQL sincronizadas dentro de Seeders (no en migraciones)

Middleware de licencia aplicado a rutas protegidas

Contratos JSON estandarizados con API Resources

Inicio de arquitectura desacoplada para reportes:

config/reportables.php

ReportService

ReportController

⚠ Riesgo actual:

Dependencia a PostgreSQL por uso de ILIKE (pendiente abstracción con Trait HasSearch)

🔹 Frontend

Layouts jerárquicos:

DashboardLayout

SuperAdminLayout

IndexLayout

Módulos implementados:

Gestión Interna (CRUD completo):

Prioridades

Tipos de Cita

Categorías de Examen

Categorías de Medicamento

Especialidades

Farmacias

Departamentos

Ciudades

Roles

Estados

Hook centralizado:

useTableData para paginación, filtros y búsqueda

Deuda técnica controlada:

Duplicación parcial en modales CRUD

Algunos hooks aún no totalmente unificados

Refactorización futura planificada, no urgente

🔐 Autenticación
Usuario Normal

POST /api/login

Tabla: usuario

Campo: contrasena (mutator automático hash)

Sesión: localStorage

Middleware: auth:sanctum + licencia.activa

SuperAdmin

POST /api/superadmin/login

Tabla: superadmin

Sesión: sessionStorage

Flujo independiente

Axios independiente

No comparte token con Admin normal

📏 Reglas Arquitectónicas Activas

NO mezclar sesiones Admin y SuperAdmin.

NO modificar UserFormConfig.js sin autorización.

NO cambiar estructura de payload.

NO asumir campos inexistentes.

NO cambiar nombres de columnas.

Respetar consistencia de id_estado.

Filtrar registros activos con id_estado = 1.

No introducir lógica de negocio en controladores.

Mantener compatibilidad total con migrate:fresh --seed.

No usar migraciones para sincronizar secuencias.

Las secuencias se sincronizan dentro de Seeders.

🧱 Estado Actual del Backend
✅ Fortalezas

Middleware de licencia estable.

Seeders completamente portables.

Secuencias PostgreSQL sincronizadas correctamente.

Uso mayoritario de FormRequest.

Soft delete homogéneo por id_estado.

CRUD estandarizados.

Arquitectura lista para escalar.

Inicio de sistema profesional de reportes configurable.

⚠ Riesgos Detectados

Uso de ILIKE (dependencia PostgreSQL).

Hardcoding parcial de id_estado = 1.

Algunos endpoints aún no usan Resource consistentemente.

Búsquedas no abstractas (pendiente Trait HasSearch).

🖥 Estado Actual del Frontend
✅ Fortalezas

Rutas anidadas funcionales.

Layout persistente estable.

Separación modular clara.

CRUD consistentes.

Módulo Gestión Interna consolidado.

Arquitectura preparada para módulo Reportes profesional.

⚠ Deuda Técnica

Duplicación en modales CRUD.

Unificación futura pendiente.

Algunas inconsistencias menores en hooks de catálogos.

🌱 Seeders Portables

El sistema debe funcionar correctamente con:

php artisan migrate:fresh --seed

Y dejar automáticamente:

Empresa activa (id_estado = 1)

Licencia activa con fechas válidas

Usuario admin activo

Estados base creados

Roles base creados

Secuencias sincronizadas

Sin errores 23505

Sin errores de FK

🎯 Nuevo Objetivo Arquitectónico (2026)
Consolidación y Profesionalización
🔹 Backend

Implementar Trait HasSearch para eliminar dependencia ILIKE

Estandarizar 100% API Resources

Eliminar validaciones manuales en controllers

Migrar hardcodes a constantes / Enums

Implementar módulo Reportes configurable (Opción C)

config/reportables.php

ReportService

Exportación PDF y Excel

Mantener portabilidad total

🔹 Frontend

Implementar módulo Reportes profesional

Filtros dinámicos

Exportación PDF y Excel

Mantener coherencia visual

No romper formularios existentes

Refactorización progresiva controlada

🏛 Principio Rector del Proyecto

Primero estabilidad.
Luego estandarización.
Luego optimización.
Nunca refactorizar sin diagnóstico completo.
No parches temporales.
Arquitectura limpia antes que rapidez.