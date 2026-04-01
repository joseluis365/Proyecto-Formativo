# Backend Commentary (api folder)

Este documento describe, a alto nivel, las partes principales del backend que se encuentra en la carpeta `api` de este repositorio. No modifica código alguno; su objetivo es facilitar la comprensión y revisión del proyecto.

## Resumen general
- El backend está construido con Laravel (PHP) y expone endpoints a través de `routes/api.php` y, en menor medida, `routes/web.php`.
- La capa de negocio se reparte entre controladores situados en `app/Http/Controllers`, modelos en `app/Models`, y recursos de API en `app/Http/Resources`.
- La persistencia se gestiona con migraciones en `database/migrations`, y datos de prueba o inicialización con seeders en `database/seeders`.
- Hay utilidades y scripts en la carpeta raíz `api/` como `wipe_db.php`, `extract_db_schema.php`, `restore_db.php` y otros scripts de mantenimiento.
- También hay vistas para generación de PDFs ubicadas en `resources/views/pdf*`.

## Estructura principal
- Routes: `api.php`, `web.php` (y rutas específicas para canales de Laravel Echo). Define grupos de rutas, middleware (p. ej. autenticación) y endpoints de la API.
- Controllers: `app/Http/Controllers` y subcarpetas (p. ej. `Api`, `Medico`, `Paciente`, `Admin`). Manejan la lógica de negocio y orquestan respuestas HTTP.
- Models: `app/Models` contiene las entidades del dominio (usuarios, historiales, citas, medicamentos, etc.).
- API Resources: `app/Http/Resources` describen la serialización de modelos para respuestas JSON.
- Requests (form requests): validaciones de entradas para endpoints de la API.
- Servicios: utilidades de negocio que encapsulan lógica compleja (p. ej. `ReportService`, `PdfExportService`).
- Migrations y Seeders: definición de estructuras de tablas y datos iniciales.
- Vistas: plantillas Blade para PDFs y otras vistas HTML necesarias para impresión/exportación.
- Scripts utilitarios: herramientas para mantenimiento de base de datos.
- Config y soporte: configuración de Cors, Sanctum, servicios y demás.

## Detalle por secciones
- Routes/API: `api/routes/api.php` define rutas de la API y sus middleware; `routes/web.php` contiene rutas web si aplica para la parte admin o páginas no API.
- Controladores: archivos dentro de `app/Http/Controllers` (incluye agrupaciones como `Api`, `Medico`, `Paciente`, `Admin`). Ejecutan operaciones CRUD, orquestan validaciones y devuelven respuestas JSON o vistas.
- Modelos: clases en `app/Models` que representan las tablas de la base de datos y sus relaciones (uno a muchos, muchos a muchos, etc.).
- Requests: validaciones centralizadas para entradas de endpoints, reduciendo lógica de validación en controladores.
- Recursos API: `app/Http/Resources` para estandarizar la forma en que los modelos se devuelven al cliente (estructuras, relaciones incluidas/excluidas).
- Servicios: clases bajo `app/Services` y `app/Services/Export` para operaciones complejas y generación de documentos (PDFs, informes).
- Migraciones/Seeders: `database/migrations` contiene tablas y cambios de esquema; `database/seeders` llena datos de ejemplo o iniciales (roles, usuarios, tipos de cita, etc.).
- Vistas/PDFs: plantillas Blade para generación de PDFs (evolución clínica, historial, remisiones, etc.).
- Utilitarios: scripts como `wipe_db.php`, `extract_db_schema.php` ayudan en desarrollo y pruebas.
- Config/Soporte: configuración de CORS, autenticación, cola, logs, y otros servicios.

## Observaciones y recomendaciones
- El proyecto parece tener un conjunto grande de modelos y endpoints. Mantener una convención clara de rutas y nombres de controladores ayuda a la escalabilidad.
- Considerar añadir docblocks en controladores y modelos para describir propiedades, relaciones y métodos principales.
- Evaluar si todas las migraciones y seeds están sincronizadas con el estado de la base de datos en producción y entornos de desarrollo.
- Revisar la configuración de seguridad (Cors, Sanctum) para entornos de desarrollo y producción.
- Si se va a colaborar, es útil mantener un README específico para el apartado backend con lista de endpoints y ejemplos de uso.

## ¿Qué sigue?
- Si quieres, puedo crear comentarios inline en archivos clave (p. ej. controladores principales, modelos y requests) para describir secciones específicas sin cambiar la lógica actual. También puedo generar una versión iterativa de este comentario en cada archivo para cubrir todo el backend.
