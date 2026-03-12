# Proyecto EPS — Contexto Técnico (2026)

## Stack Tecnológico

### Backend
- Laravel 12
- PostgreSQL
- Laravel Sanctum

Arquitectura basada en:

bootstrap/app.php

Incluye:

- Middleware `licencia.activa`
- API Resources (uso mayoritario)
- FormRequest consolidado
- Servicios desacoplados (`ReportService`)
- Configuración extensible vía `config/*.php`

---

# Sistema de Roles

Archivo:

app/Constants/RolConstants.php

| ID | Rol |
|----|-----|
|1|Super Admin|
|2|Admin|
|3|Personal Administrativo|
|4|Medico|
|5|Paciente|
|6|Farmaceutico|

Uso en backend:


RolConstants::ADMIN
RolConstants::MEDICO
RolConstants::PACIENTE


Frontend:


src/constants/roles.js


Magic numbers eliminados.

---

# Sistema de Citas

Controlador:


CitaController


Endpoints:


GET /api/citas
POST /api/cita
PUT /api/cita/{id}
PUT /api/citas/{id}/reagendar
POST /api/citas/{id}/atender


---

# Capa Clínica

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


---

# Recordatorios Automáticos

Comando:


app/Console/Commands/SendAppointmentReminders.php


Cron:


0 8 * * *


Campo en tabla cita:


recordatorio_enviado


Previene envíos duplicados.

---

# Frontend

Stack:

- React
- Vite
- React Router v6
- Tailwind
- Framer Motion

Estructura:


src
├ Pages
├ layouts
├ components
├ hooks
├ Api
├ constants
└ assets


---

# Autenticación

### Usuarios normales

Storage:


localStorage


Claves:


token
user


Interceptor:


src/Api/axios.js


---

### Super Admin

Storage:


sessionStorage


Claves:


superadmin_token
superadmin_user


Cliente API:


src/Api/superadminAxios.js


---

# Route Guards

Ubicación:


src/components/Routes


### SuperAdminRoute

Protege:


/SuperAdmin-*


### AdminRoute

Protege:


/dashboard
/usuarios/*
/citas/*
/configuracion/*
/reportes


Roles:


ADMIN
PERSONAL_ADMINISTRATIVO


### MedicoRoute

Protege:


/agenda-medico


Rol:


MEDICO


### PatientRoute

Protege:


/paciente/*


Rol:


PACIENTE


---

# Portal del Paciente

Layout:


PatientLayout.jsx


Rutas:


/paciente
/paciente/agendar
/paciente/citas
/paciente/historial
/paciente/perfil


Funcionalidades:

- Agendar cita
- Reagendar
- Cancelar
- Historial clínico
- Perfil editable

---

# Experiencia de Usuario

Incluye:

- Modo oscuro / claro
- Wizard de agendamiento
- Timeline clínica
- Notificaciones
- Diseño responsive

---

# Seeders

Sistema portable con:


php artisan migrate:fresh --seed


Seeders:

- RolSeeder
- EstadoSeeder
- EmpresaSeeder
- EmpresaLicenciaSeeder
- AdminUsuarioSeeder
- SuperadminSeeder
- UsuariosPruebaSeeder

---

# Estado Actual del Proyecto

Backend:

✔ Licencias  
✔ Citas  
✔ Capa clínica  
✔ Remisiones  
✔ Roles refactorizados  
✔ Recordatorios automáticos

Frontend:

✔ Panel Admin completo  
✔ Agenda administrativa  
✔ Agenda médico funcional  
✔ Portal paciente completo  
✔ Guards por rol  
✔ Redirecciones corregidas

---

# Principio Rector

Primero estabilidad.  
Luego estandarización.  
Luego optimización.

Reglas:

- Nunca refactorizar sin diagnóstico completo
- No parches temporales
- Arquitectura limpia antes que rapidez