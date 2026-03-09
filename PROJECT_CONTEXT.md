Stack Tecnológico – Proyecto EPS (Actualizado 2026 – Estado Final)
🔹 Backend

Laravel 12

PostgreSQL

Laravel Sanctum

Arquitectura moderna (bootstrap/app.php)

Middleware personalizado licencia.activa

API Resources (uso mayoritario, en proceso de estandarización total)

FormRequest (uso casi total, estructura consolidada)

Servicios desacoplados (inicio de arquitectura ReportService)

Configuración extensible vía config/*.php (patrón para reportes dinámicos)

Mailable para citas (CitaAgendadaMailable)

Sistema de autenticación dual

Autenticación soportada:

Usuario

SuperAdmin

🔹 Frontend

Vite + React

React Router v6

Tailwind CSS (UI Design System)

Framer Motion para animaciones

Arquitectura basada en componentes reutilizables

Data Driven UI (formularios y tablas configurables)

Arquitectura de carpetas
src/
 ├─ pages
 │   ├─ Admin
 │   ├─ SuperAdmin
 │   └─ Paciente
 ├─ layouts
 ├─ components
 ├─ hooks
 ├─ Api
 └─ assets
Componentes base del sistema

Form.jsx

FormWithIcons.jsx

DataTable.jsx

AppointmentCard.jsx

CalendarAgenda.jsx

ViewCitaModal.jsx

🔹 Hooks Dinámicos

useCitas

useReports

useTableData

hooks de catálogos (usePrioridades, useEspecialidades, etc.)

useMedicosDisponibles

Cliente API

axios.js → Admin / Médico / Paciente

superadminAxios.js → SuperAdmin

🏗 Arquitectura General
🔹 Backend

Arquitectura MVC clara y escalable.

Características principales:

Soft delete lógico mediante id_estado

Seeders idempotentes y portables

Secuencias PostgreSQL sincronizadas en Seeders

Middleware licencia.activa aplicado a rutas protegidas

Respuestas JSON mediante API Resources

Arquitectura de reportes
config/reportables.php
ReportService
ReportController

Permite generar reportes configurables sin modificar controladores.

⚠ Riesgo actual

Dependencia de PostgreSQL por uso de:

ILIKE
Plan de solución

Implementar Trait:

HasSearch

para abstraer el motor de base de datos.

🔹 Frontend

Arquitectura basada en layouts jerárquicos:

DashboardLayout
SuperAdminLayout
PatientLayout
IndexLayout
LoginLayout

Permite:

separación de roles

navegación modular

persistencia de UI

🧩 Módulos Implementados
Sistema Administrativo
Gestión Interna (CRUD completos)

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

Gestión de Usuarios

CRUD completo para:

personal

médicos

usuarios

Validación centralizada mediante:

FormRequest
Sistema de Licenciamiento

SuperAdmin controla:

empresas

licencias

activación manual

Sistema de Reportes

Centro dinámico:

/reportes

Características:

columnas dinámicas

filtros

exportación PDF

📅 Sistema de Citas
Backend

Controlador:

CitaController

Endpoints principales:

GET /api/citas
POST /api/cita
PUT /api/cita/{id}

Características:

cálculo automático de duración

notificación por correo (CitaAgendadaMailable)

Frontend
Agenda Administrativa

Archivo:

AgendaCitas.jsx

Características:

calendario

médicos colapsables

citas por médico

modales

filtros por especialidad

✔ Conectado al backend

Agenda del Médico

Archivo:

AgendaMedico.jsx

Estado actual:

✔ Conectado al backend
✔ Filtrado por doc_medico
✔ Botón Atender

🏥 Capa Clínica (Implementada)
Modelo clínico
Usuario (Paciente)
        ↓
HistorialClinico
        ↓
HistorialDetalle
        ↓
Remision
Modelos implementados

HistorialClinico

HistorialDetalle

Remision

Examen

Controlador clínico
AtencionMedicaController

Endpoint principal:

POST /api/citas/{id}/atender

Este endpoint:

busca o crea HistorialClinico

crea HistorialDetalle

registra Remision

cambia estado de cita a Atendida

🩺 Atención Médica (Frontend)

Componente:

AtenderCitaModal.jsx

Permite registrar:

diagnóstico

tratamiento

observaciones

remisiones

Integraciones:

react-hook-form

SweetAlert2

Framer Motion

👤 Portal del Paciente (Implementado)
Layout
PatientLayout.jsx

Sidebar simplificado:

Inicio

Agendar Cita

Mis Citas

Mi Historial

Páginas
src/pages/Paciente

IndexPaciente.jsx

AgendarCita.jsx

MisCitas.jsx

HistorialPaciente.jsx

Funcionalidades

Paciente puede:

agendar citas

ver citas activas

cancelar citas

consultar historial clínico

🔐 Autenticación
Usuario Normal
POST /api/login

Tabla:

usuario

Campo contraseña:

contrasena

Sesión:

localStorage

Middleware:

auth:sanctum
licencia.activa
SuperAdmin
POST /api/superadmin/login

Tabla:

superadmin

Sesión:

sessionStorage

Cliente API independiente.

📏 Reglas Arquitectónicas Activas

NO mezclar sesiones Admin / SuperAdmin / Paciente

NO modificar UserFormConfig.js

NO cambiar estructura de payload

NO asumir columnas inexistentes

NO cambiar nombres de columnas

Mantener consistencia de id_estado

Filtrar registros activos con:

id_estado = 1

No introducir lógica de negocio en controladores

Mantener compatibilidad con:

php artisan migrate:fresh --seed

Las secuencias PostgreSQL se sincronizan solo en Seeders

🧱 Estado Actual del Backend
✅ Fortalezas

Middleware de licencia estable

Seeders portables

Secuencias sincronizadas

Uso mayoritario de FormRequest

CRUD estandarizados

Sistema de citas completo

Capa clínica completamente funcional

Arquitectura preparada para escalar

⚠ Riesgos Detectados

Dependencia de ILIKE

Hardcoding parcial de id_estado

Algunos endpoints aún sin Resource

Búsquedas sin abstracción (HasSearch pendiente)

🖥 Estado Actual del Frontend
✅ Fortalezas

UI moderna con Tailwind

Animaciones con Framer Motion

Arquitectura de componentes reutilizables

Agenda administrativa funcional

Agenda médica funcional

Atención clínica funcional

Portal del paciente completo

Hooks reutilizables bien estructurados

⚠ Deuda Técnica

Duplicación parcial de modales CRUD

Algunos hooks de catálogos aún no unificados

Refactorización futura posible para optimizar layout compartidos

🌱 Seeders Portables

El sistema debe funcionar con:

php artisan migrate:fresh --seed

y generar automáticamente:

Empresa activa (id_estado = 1)

Licencia activa

Usuario admin

Estados base

Roles base

Secuencias sincronizadas

Sin:

errores 23505

errores FK

🏁 Estado Final del Sistema
Módulo	Estado
Licencias	✅
Administración	✅
Agenda	✅
Atención médica	✅
Remisiones	✅
Portal paciente	✅
Reportes	✅

Sistema clínico completo funcional.

🏛 Principio Rector del Proyecto

Primero estabilidad.
Luego estandarización.
Luego optimización.

Nunca refactorizar sin diagnóstico completo.
No parches temporales.
Arquitectura limpia antes que rapidez.