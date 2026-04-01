# Comentario Frontend (React-Eps)

Este documento resume la arquitectura del frontend ubicado en `React-Eps`.

## Vision general
- Aplicacion React con organizacion por modulos funcionales (Inicio, Admin, Medico, Paciente, Farmacia, SuperAdmin, Examenes).
- Ruteo central y composicion de layouts segun rol.
- Integracion API mediante clientes Axios y hooks personalizados.
- Componentizacion de tablas, modales, formularios y vistas de negocio.

## Capas principales
- `src/main.jsx` y `src/App.jsx`: arranque, ruteo y arbol principal.
- `src/layouts/*`: estructuras visuales por tipo de usuario y secciones compartidas.
- `src/Pages/*`: pantallas por dominio (negocio).
- `src/components/*`: componentes reutilizables de UI y funcionalidad.
- `src/hooks/*`: logica reutilizable para consumo API y estado derivado.
- `src/Api/*`: clientes HTTP y configuracion de interceptores.
- `src/schemas/*` y `src/utils/validations/*`: validaciones de formularios.
- `src/data/*`: configuraciones y datos estaticos de interfaz.

## Objetivo de comentarios inline
- Facilitar onboarding tecnico.
- Identificar rapidamente responsabilidad de cada archivo.
- Mantener trazabilidad funcional sin alterar comportamiento.
