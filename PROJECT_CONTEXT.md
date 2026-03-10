Stack Tecnológico – Proyecto EPS (Actualizado 2026)
🔹 Backend

Framework

Laravel 12

PostgreSQL

Laravel Sanctum

Arquitectura

Arquitectura moderna (bootstrap/app.php)

Middleware personalizado licencia.activa

API Resources (uso mayoritario)

FormRequest (estructura consolidada)

Servicios desacoplados (inicio de ReportService)

Configuración extensible vía config/*.php

Sistema de Roles (Refactorizado)

Nuevo sistema centralizado de roles:

app/Constants/RolConstants.php

Roles del sistema:

ID	Rol
1	Super Admin
2	Admin
3	Personal Administrativo
4	Medico
5	Paciente
6	Farmaceutico

Todos los controladores ahora usan:

RolConstants::ADMIN
RolConstants::MEDICO
RolConstants::PACIENTE

Se eliminó completamente:

where('id_rol', 2)
case 4
case 5
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

Axios interceptor:

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
🛡 Sistema de Route Guards (Nuevo)

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

Se eliminaron todos los:

id_rol: 4
id_rol: 5
📅 Sistema de Citas
Backend

Controlador principal:

CitaController

Endpoints:

GET /api/citas
POST /api/cita
PUT /api/cita/{id}
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

Ahora:

usa useCitas

filtra por doc_medico

permite atender cita

🏥 Capa Clínica (Implementada)

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

Campos:

Diagnóstico

Tratamiento

Observaciones

Remisiones dinámicas

👤 Portal del Paciente (Nuevo)

Layout:

PatientLayout.jsx

Páginas:

/paciente
/paciente/agendar
/paciente/citas
/paciente/historial

Funciones:

agendar cita

cancelar cita

ver historial clínico

🧱 Seeders Portables

El sistema funciona con:

php artisan migrate:fresh --seed

Genera automáticamente:

Seeder	Resultado
RolSeeder	roles del sistema
EstadoSeeder	estados
EmpresaSeeder	empresa base
EmpresaLicenciaSeeder	licencia activa
AdminUsuarioSeeder	usuario ADMIN
SuperadminSeeder	usuario SUPER ADMIN
UsuariosPruebaSeeder	usuarios de prueba
⚠ Riesgos Técnicos Detectados

Backend:

dependencia PostgreSQL por ILIKE

algunos endpoints aún sin Resource

Frontend:

duplicación de modales CRUD

algunos hooks aún no unificados

🎯 Estado Actual del Proyecto
Backend

✔ Sistema de licencias
✔ Sistema de citas
✔ Capa clínica
✔ Remisiones
✔ Sistema de roles refactorizado

Frontend

✔ Panel Admin completo
✔ Agenda administrativa
✔ Agenda médico funcional
✔ Portal paciente
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

Nunca refactorizar sin diagnóstico completo.
No parches temporales.
Arquitectura limpia antes que rapidez.