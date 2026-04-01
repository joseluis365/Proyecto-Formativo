# Comentario del backend por secciones (carpeta `api`)

Este documento complementa los comentarios inline del código y organiza todo el backend por secciones funcionales.

## 1) Rutas
- `routes/api.php`: rutas principales REST del sistema (autenticación, usuarios, citas, historial, farmacia, reportes, etc.).
- `routes/web.php`: rutas web mínimas para vistas Blade.
- `routes/console.php`: comandos programados (scheduler).
- `routes/channels.php`: autorización de canales para broadcasting.

## 2) Controladores API
- **Autenticación y acceso**: `AuthController.php`, `SuperadminAuthController.php`.
- **Gestión de usuarios y empresa**: `UsuarioController.php`, `EmpresaController.php`, `RegistroEmpresaController.php`, `EmpresaLicenciaController.php`, `LicenciaController.php`, `LicenciaChartController.php`.
- **Catálogos base**: `TipoDocumentoController.php`, `TipoCitaController.php`, `RolController.php`, `EstadoController.php`, `DepartamentoController.php`, `CiudadController.php`, `PrioridadController.php`, `CategoriaMedicamentoController.php`, `CategoriaExamenController.php`, `EspecialidadesController.php`, `MotivoConsultaController.php`, `ConcentracionController.php`, `FormaFarmaceuticaController.php`, `ConsultorioController.php`.
- **Clínica y atención médica**: `CitaController.php`, `AtencionMedicaController.php`, `HistorialClinicoController.php`, `ExamenClinicoController.php`, `PdfMedicoController.php`, `EnfermedadController.php`, `NotificacionPacienteController.php`.
- **Farmacia**: `MedicamentoController.php`, `AdminMedicamentoController.php`, `AdminPresentacionController.php`, `InventarioFarmaciaController.php`, `MovimientoInventarioController.php`, `RecetaFarmaciaController.php`, `DispensacionController.php`, `FarmaciaController.php`, `FarmaciaDashboardController.php`, `FarmaciaReportesController.php`.
- **Reportes y paneles**: `ReporteController.php`, `ReportController.php`, `PersonalReporteController.php`, `ExamenReporteController.php`, `AdminDashboardController.php`.
- **Soporte/PQR/contacto**: `PqrController.php`, `ContactoController.php`, `LocationController.php`.

## 3) Modelos de dominio (`app/Models`)
- **Identidad y seguridad**: `Usuario.php`, `Superadmin.php`, `Rol.php`, `Estado.php`, `TipoDocumento.php`.
- **Organización**: `Empresa.php`, `Licencia.php`, `EmpresaLicencia.php`, `Activity.php`.
- **Ubicación**: `Departamento.php`, `Ciudad.php`, `Consultorio.php`.
- **Agenda y clínica**: `Cita.php`, `HistorialClinico.php`, `HistorialDetalle.php`, `HistorialEnfermedad.php`, `Enfermedad.php`, `MotivoConsulta.php`, `Remision.php`, `Examen.php`, `TipoCita.php`, `HistorialReporte.php`.
- **Farmacia**: `Farmacia.php`, `Medicamento.php`, `CategoriaMedicamento.php`, `CategoriaExamen.php`, `Presentacion.php`, `Concentracion.php`, `FormaFarmaceutica.php`, `LoteMedicamento.php`, `InventarioFarmacia.php`, `MovimientoInventario.php`, `Receta.php`, `RecetaDetalle.php`, `Dispensacion.php`.
- **Calidad y atención al usuario**: `Pqr.php`, `Prioridad.php`.

## 4) Validaciones de entrada (Form Requests)
- **Autenticación**: `app/Http/Requests/Auth/*.php`.
- **Clínica y citas**: `StoreCitaRequest.php`, `UpdateCitaRequest.php`, `ReagendarCitaRequest.php`, `AtencionMedicaRequest.php`.
- **Usuarios y empresa**: `StoreUserRequest.php`, `UpdateUserRequest.php`, `StoreEmpresaRequest.php`, `UpdateEmpresaRequest.php`, `StoreEmpresaLicenciaRequest.php`.
- **Catálogos**: archivos `Store*Request.php` y `Update*Request.php` para tipo documento, tipo cita, rol, estado, especialidad, prioridad, ciudad, departamento, farmacia y categorías.
- **Farmacia**: `app/Http/Requests/Farmacia/*.php` para movimientos y dispensación.

## 5) Recursos API (serialización)
- `app/Http/Resources/*.php`: transforman modelos a respuestas JSON consistentes (`EmpresaResource`, `LicenciaResource`, `FarmaciaResource`, etc.).

## 6) Servicios de negocio
- `app/Services/ReportService.php`: construcción de reportes y lógica de agregación.
- `app/Services/Export/PdfExportService.php`: exportación y utilidades PDF.

## 7) Mails y notificaciones
- `app/Mail/*.php`: clases Mailable para eventos de negocio (citas, recetas, examenes, PQR, registro empresa, activación de licencia).

## 8) Middleware, reglas, eventos y proveedores
- `app/Http/Middleware/CheckLicenciaActiva.php`: control de licencia activa para acceso.
- `app/Http/Middleware/VerifyCsrfToken.php`: configuración CSRF.
- `app/Rules/UniqueIgnoreCase.php`: regla personalizada de validación.
- `app/Events/SystemActivityEvent.php`: evento para feed/actividad del sistema.
- `app/Providers/AppServiceProvider.php`: configuración de servicios globales.

## 9) Base de datos
- `database/migrations/*.php`: evolución del esquema (tablas clínicas, seguridad, farmacia, índices y ajustes).
- `database/seeders/*.php`: datos iniciales y de prueba (roles, estados, usuarios, catálogos y datos demo).

## 10) Vistas backend y reportes
- `resources/views/pdf/*.blade.php` y `resources/views/pdfs/*.blade.php`: plantillas para exportación de documentos.
- `resources/views/reports/*.blade.php`: vistas para reportes específicos.

## 11) Scripts utilitarios en raíz de `api`
- Archivos como `wipe_db.php`, `restore_db.php`, `extract_db_schema.php`, `run_sql.php`, `fix_identities.php` y scripts en `tmp/` sirven para mantenimiento y soporte de desarrollo.

## Estado de documentación
- Se agregaron comentarios inline en controladores y modelos principales para lectura rápida del dominio.
- Se añadieron encabezados comentados en archivos de rutas auxiliares (`web.php`, `console.php`, `channels.php`).
- Este documento cubre la visión completa por secciones para orientar mantenimiento, onboarding y auditoría técnica.
