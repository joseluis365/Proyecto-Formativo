Proyecto EPS — Contexto Técnico (Actualizado 2026)
Stack Tecnológico
Backend

Laravel 12

PostgreSQL

Laravel Sanctum

Arquitectura basada en:

bootstrap/app.php

Incluye:

Middleware licencia.activa

API Resources (uso mayoritario)

FormRequest consolidado

Servicios desacoplados (ReportService)

Configuración extensible vía config/*.php

Sistema de Roles

Archivo:

app/Constants/RolConstants.php
ID	Rol
1	Super Admin
2	Admin
3	Personal Administrativo
4	Medico
5	Paciente
6	Farmaceutico

Uso en backend:

RolConstants::ADMIN
RolConstants::MEDICO
RolConstants::PACIENTE

Frontend:

src/constants/roles.js

Magic numbers eliminados completamente.

Sistema de Citas

Controlador:

CitaController

Endpoints:

GET /api/citas
GET /api/cita/{id}
POST /api/cita
PUT /api/cita/{id}
PUT /api/citas/{id}/reagendar
POST /api/citas/{id}/atender
PATCH /api/cita/{id}/no-asistio
Tipos de Cita

Tabla:

tipo_cita

Campos principales:

id_tipo_cita
tipo

Seeder:

TipoCitaSeeder

Uso en frontend mediante hook:

useTiposCita.js

Payload esperado para crear citas:

id_tipo_cita

Mapeo backend:

'tipo_cita_id' => $request->id_tipo_cita
Tipos de Evento Clínico

La tabla cita ahora funciona como evento clínico unificado.

Campo:

tipo_evento

Valores posibles:

Tipo	Descripción
consulta	cita normal
remision	cita con especialista
examen	orden de laboratorio

Esto permite que remisiones y exámenes se integren al sistema de agenda.

Flujo Clínico

Flujo principal del sistema:

Paciente agenda cita
        ↓
Médico revisa agenda
        ↓
Médico atiende consulta
        ↓
Registro SOAP
        ↓
Opcional:
  - Remisiones
  - Exámenes
        ↓
Sistema genera nuevas citas
        ↓
Paciente visualiza:
"Citas y Exámenes"
Atención Médica

Vista clínica:

/medico/consulta/:id

Características:

Apertura en nueva pestaña desde agenda

Registro clínico SOAP

Campos:

Campo	Obligatorio
Subjetivo	opcional
Diagnóstico	obligatorio
Tratamiento	obligatorio
Observaciones	opcional

Remisiones y exámenes son opcionales.

Endpoint utilizado:

POST /api/citas/{id}/atender

Controlador:

AtencionMedicaController
Capa Clínica

Tablas:

historial_clinico
historial_detalle
remision
examen

Modelos:

HistorialClinico
HistorialDetalle
Remision
Examen

Restricciones importantes:

historial_detalle.id_cita UNIQUE

Un solo registro clínico por cita

Acceso a Historial Clínico

Controlador:

HistorialClinicoController

Reglas de acceso:

Rol	Acceso
Paciente	solo su historial
Médico	historial de cualquier paciente
Admin	acceso total

Implementación:

if ($user->id_rol === RolConstants::MEDICO) {
    return;
}
Recordatorios Automáticos

Comando:

app/Console/Commands/SendAppointmentReminders.php

Cron:

0 8 * * *

Campo en tabla cita:

recordatorio_enviado

Previene envío duplicado de recordatorios.

Frontend

Stack:

React

Vite

React Router v6

Tailwind CSS

Framer Motion

Estructura:

src
├ Pages
├ layouts
├ components
├ hooks
├ Api
├ constants
└ assets
Autenticación
Usuarios normales

Storage:

localStorage

Claves:

token
user

Interceptor:

src/Api/axios.js
Super Admin

Storage:

sessionStorage

Claves:

superadmin_token
superadmin_user

Cliente API:

src/Api/superadminAxios.js
Route Guards

Ubicación:

src/components/Routes
SuperAdminRoute

Protege:

/SuperAdmin-*
AdminRoute

Protege:

/dashboard
/usuarios/*
/citas/*
/configuracion/*
/reportes

Roles:

ADMIN
PERSONAL_ADMINISTRATIVO
MedicoRoute

Protege:

/agenda-medico
/medico/*

Rol:

MEDICO
PatientRoute

Protege:

/paciente/*

Rol:

PACIENTE
Portal del Paciente

Layout:

PatientLayout.jsx

Rutas:

/paciente
/paciente/agendar
/paciente/citas
/paciente/historial
/paciente/perfil

Sección principal:

Citas y Exámenes

Muestra:

Consultas agendadas

Remisiones

Exámenes

Estado de cada evento

Experiencia de Usuario

Incluye:

Modo oscuro / claro

Wizard de agendamiento

Timeline clínica

Notificaciones

Diseño responsive

Seeders

Sistema portable con:

php artisan migrate:fresh --seed

Seeders:

RolSeeder
EstadoSeeder
TipoCitaSeeder
EmpresaSeeder
EmpresaLicenciaSeeder
AdminUsuarioSeeder
SuperadminSeeder
UsuariosPruebaSeeder
Estado Actual del Proyecto

Backend:

✔ Licencias
✔ Citas
✔ Tipos de cita
✔ Capa clínica
✔ Remisiones
✔ Exámenes
✔ Historial clínico
✔ Roles refactorizados
✔ Recordatorios automáticos

Frontend:

✔ Panel Admin completo
✔ Agenda administrativa
✔ Agenda médico funcional
✔ Consulta médica avanzada
✔ Portal paciente completo
✔ Guardas por rol
✔ Redirecciones corregidas

Principio Rector

Primero estabilidad.
Luego estandarización.
Luego optimización.

Reglas del proyecto:

Nunca refactorizar sin diagnóstico completo

No parches temporales

Arquitectura limpia antes que rapidez