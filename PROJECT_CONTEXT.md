Stack Tecnológico – Proyecto EPS (Actualizado 2026)
🔹 Backend
Framework

Laravel 12

PostgreSQL

Laravel Sanctum

Arquitectura

Arquitectura moderna basada en:

bootstrap/app.php

Incluye:

Middleware personalizado licencia.activa

Uso mayoritario de API Resources

FormRequest consolidado para validaciones

Servicios desacoplados (inicio de ReportService)

Configuración extensible mediante:

config/*.php
Sistema de Roles (Refactorizado)

Sistema centralizado de roles:

app/Constants/RolConstants.php
Roles del sistema
ID	Rol
1	Super Admin
2	Admin
3	Personal Administrativo
4	Medico
5	Paciente
6	Farmaceutico

Uso en controladores:

RolConstants::ADMIN
RolConstants::MEDICO
RolConstants::PACIENTE

Eliminado completamente:

where('id_rol', 2)
case 4
case 5
Sistema de Recordatorios Automáticos (Nuevo)

Implementado sistema de recordatorios automáticos de citas.

Componente principal
app/Console/Commands/SendAppointmentReminders.php
Funcionamiento

Cada día a las 08:00 AM el sistema:

Busca citas con fecha mañana

Filtra estado Agendada

Crea notificación interna

Envía email recordatorio (opcional)

Idempotencia implementada

Campo agregado a tabla cita:

recordatorio_enviado

Esto evita envío duplicado de recordatorios si el scheduler se ejecuta múltiples veces.

Scheduler

Configurado en:

routes/console.php

Expresión cron:

0 8 * * *
🔹 Frontend
Framework

Vite + React

React Router v6

Tailwind CSS

Framer Motion

Arquitectura
src/
 ├─ Pages
 │   ├─ Admin
 │   ├─ SuperAdmin
 │   ├─ Paciente
 │   └─ Inicio
 ├─ layouts
 ├─ components
 ├─ hooks
 ├─ Api
 ├─ constants
 └─ assets
🔐 Sistema de Autenticación
Usuarios normales

Storage:

localStorage

Claves:

token
user

Interceptor:

src/Api/axios.js

Si recibe 401:

localStorage.removeItem("token")
localStorage.removeItem("user")
window.location.href = "/login"
Super Admin

Storage:

sessionStorage

Claves:

superadmin_token
superadmin_user

Cliente API separado:

src/Api/superadminAxios.js
🛡 Sistema de Route Guards

Ubicación:

src/components/Routes/
SuperAdminRoute

Protege:

/SuperAdmin-*

Usa:

sessionStorage + API check-session
AdminRoute

Protege:

/dashboard
/usuarios/*
/citas/*
/configuracion/*
/reportes

Roles permitidos:

ROLES.ADMIN
ROLES.PERSONAL_ADMINISTRATIVO
MedicoRoute

Protege:

/agenda-medico

Rol permitido:

ROLES.MEDICO
PatientRoute

Protege:

/paciente/*

Rol permitido:

ROLES.PACIENTE
🧩 Sistema de Roles en Frontend

Archivo:

src/constants/roles.js

Uso:

ROLES.ADMIN
ROLES.MEDICO
ROLES.PACIENTE

Eliminados completamente:

id_rol: 4
id_rol: 5
📅 Sistema de Citas
Backend

Controlador principal:

CitaController

Endpoints principales:

GET /api/citas
POST /api/cita
PUT /api/cita/{id}
PUT /api/citas/{id}/reagendar
POST /api/citas/{id}/atender
Frontend
Agenda administrativa
AgendaCitas.jsx

Características:

médicos colapsables

calendario

citas por médico

modales

filtros

Agenda médico
AgendaMedico.jsx

Características:

usa useCitas

filtra por doc_medico

permite atender cita

🏥 Capa Clínica

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

Endpoint clínico:

POST /api/citas/{id}/atender
👨‍⚕️ Atención Médica

Frontend:

AtenderCitaModal.jsx

Campos clínicos:

Diagnóstico

Tratamiento

Observaciones

Remisiones dinámicas

👤 Portal del Paciente

Layout principal:

PatientLayout.jsx

Rutas:

/paciente
/paciente/agendar
/paciente/citas
/paciente/historial
/paciente/perfil
Funcionalidades

El paciente puede:

agendar cita
reagendar cita
cancelar cita
ver historial médico
editar perfil
Wizard de Agendamiento

Flujo:

Fecha
Hora
Profesional
Motivo
Confirmar

Optimizado para móvil y con scroll mínimo.

Historial Médico

Refactorizado a Timeline médica interactiva.

Cada consulta muestra:

Diagnóstico
Tratamiento
Observaciones
Remisiones
Exámenes
Notificaciones

Sistema de notificaciones internas para:

recordatorios de citas
eventos clínicos
🌙 Experiencia de Usuario

Portal incluye:

Modo oscuro / claro
Wizard de agendamiento
Timeline clínica
Notificaciones
Perfil editable
Diseño responsive
🧱 Seeders Portables

El sistema funciona con:

php artisan migrate:fresh --seed

Seeders principales:

Seeder	Resultado
RolSeeder	roles del sistema
EstadoSeeder	estados
EmpresaSeeder	empresa base
EmpresaLicenciaSeeder	licencia activa
AdminUsuarioSeeder	usuario ADMIN
SuperadminSeeder	usuario SUPER ADMIN
UsuariosPruebaSeeder	usuarios de prueba
⚠ Riesgos Técnicos Detectados
Backend

Dependencia de PostgreSQL por ILIKE

Algunos endpoints aún sin API Resource

Frontend

Duplicación de algunos modales CRUD

Algunos hooks aún no unificados

🎯 Estado Actual del Proyecto
Backend

✔ Sistema de licencias
✔ Sistema de citas
✔ Capa clínica
✔ Remisiones
✔ Sistema de roles refactorizado
✔ Recordatorios automáticos de citas

Frontend

✔ Panel Admin completo
✔ Agenda administrativa
✔ Agenda médico funcional
✔ Portal paciente completo
✔ Route Guards por rol
✔ Redirecciones corregidas

🏗 Arquitectura del Router (Final)
<Routes>

  /login
  /confirm-email
  /reset-password

  <SuperAdminRoute>
     /SuperAdmin-*
  </SuperAdminRoute>

  <AdminRoute>
     /dashboard
     /usuarios/*
     /citas/*
     /configuracion/*
  </AdminRoute>

  <MedicoRoute>
     /agenda-medico
  </MedicoRoute>

  <PatientRoute>
     /paciente/*
  </PatientRoute>

</Routes>
🏛 Principio Rector del Proyecto
Primero estabilidad.
Luego estandarización.
Luego optimización.

Reglas del proyecto:

Nunca refactorizar sin diagnóstico completo

No parches temporales

Arquitectura limpia antes que rapidez