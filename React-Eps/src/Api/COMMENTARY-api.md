# Comentario de capa API

## Proposito
Centralizar comunicacion HTTP con backend y comportamiento comun de autenticacion.

## Archivos clave
- `axios.js`: cliente principal para usuarios generales.
- `superadminAxios.js`: cliente dedicado para superadmin.
- `bloqueoAgenda.js`: funciones puntuales para operaciones de agenda.

## Nota
Se recomienda mantener toda llamada HTTP nueva encapsulada aqui o en hooks para evitar duplicidad.
