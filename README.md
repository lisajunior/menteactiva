# MenteActiva — Fase 1: núcleo mínimo (mobile-first)

Shell de la aplicación según el Documento de Diseño Fundacional v1.1
(`docs/DISENO-FUNDACIONAL-v1.1.md`). Sin frameworks, sin dependencias.

## Qué incluye esta fase

- Shell mobile-first (§5.bis): una columna a 360 px, `100dvh`, áreas seguras,
  sin scroll horizontal, acciones en la zona del pulgar.
- Navegación por hash: el botón físico "Atrás" del teléfono funciona solo.
- Las 4 secciones: Inicio, Todos los juegos (7 áreas), Mi progreso, Configuración.
- Configuración funcional: tamaño de texto (aplica en vivo), reducir animaciones,
  borrar datos con confirmación amable en línea.
- Almacenamiento versionado en LocalStorage (`menteactiva.v1`, esquema §11).
- Mensajes amables centralizados en `data/mensajes.json` (ADR-005).
- Manifest PWA: ya se puede "Agregar a la pantalla de inicio" y abre a pantalla
  completa (el funcionamiento offline con Service Worker llega en la Fase 5).

## Cómo probarla

Necesita servirse por HTTP (los datos se cargan con `fetch`):

    npx serve

Luego abrir la dirección que indique (ej. http://localhost:3000).

**Para verla en el celular:** con la computadora y el teléfono en la misma red
Wi-Fi, abrir en el teléfono `http://IP-DE-TU-COMPU:3000`. O publicar la carpeta
en GitHub Pages y abrir la URL desde el teléfono.

## Próximas fases

2. Sistema de plugins (SDK, registro generado, plantilla de juego)
3. Primeros 5 juegos · 4. Desafío del día + progreso completo · 5. PWA offline
