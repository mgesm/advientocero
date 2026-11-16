---
name: advientocero-backlog
description: >-
  Acts as a non-destructive idea notepad and feature backlog for ADVIENTO CERO.
  Use whenever the user wants to jot down, save, list, review, or organize ideas,
  changes, or future features for ADVIENTO CERO WITHOUT modifying app code directly.
---

# ADVIENTO CERO — Bloc de Notas y Backlog (Sin Cambios Directos)

Esta skill convierte al agente en un **bloc de notas seguro** para **ADVIENTO CERO** (`C:\Users\migue\.gemini\antigravity\scratch\advientocero`). Su objetivo es capturar ideas, mejoras o tareas futuras **sin alterar el código en producción** hasta que el usuario dé una orden explícita de implementación.

---

## 1. Archivo Canónico de Notas

Todas las notas se guardan en:
`C:\Users\migue\.gemini\antigravity\scratch\advientocero\BACKLOG_NOTAS.md`

---

## 2. Regla Innegociable: CERO CAMBIOS DIRECTOS EN LA APP

Cuando el usuario exprese una idea, mejora, petición de diseño o función futura mientras usa este bloc (o diga *"apunta"*, *"anota"*, *"guarda esta idea"*, *"para añadir luego"*, *"bloc de notas"*):

1. **NO edites** `index.html`, `css/*.css`, `js/*.js`, `data/*.js`, `config/*.js` ni `sw.js`.
2. **NO hagas `git commit` ni `git push` del código de la app** como si ya estuviera implementado (solo actualiza `BACKLOG_NOTAS.md`; puedes preguntar si quiere subir también el bloc al repo o dejarlo local).
3. **Lee primero** `BACKLOG_NOTAS.md` para evitar duplicados y mantener el formato.
4. **Añade la entrada** bajo `## Pendientes (Por implementar)` con este formato exacto:
   ```markdown
   - [ ] `YYYY-MM-DD` **[Categoría]** Título breve — Descripción clara de lo que quiere Miguel y archivos probablemente implicados (sin editarlos).
   ```
   Categorías recomendadas: `UI/Animaciones`, `Enigmas/Arte`, `Cooperativo/Sync`, `Regalo/Personalización`, `Sonido/UX`, `Bug/Ajuste`.
5. **Respeta siempre las dos reglas de oro del proyecto:**
   - **Cero Spoilers:** Nunca escribas en `BACKLOG_NOTAS.md` la identidad del culpable ni respuestas concretas de los enigmas.
   - **Cero Emojis:** Usa texto limpio y sintaxis Markdown estándar sin emojis Unicode.

---

## 3. Flujo de Trabajo según la Intención del Usuario

### Caso A: El usuario dicta una nueva idea o ajuste
1. Registra la nota en `BACKLOG_NOTAS.md` dentro de `## Pendientes (Por implementar)`.
2. Confirma brevemente al usuario qué se ha apuntado (con enlace clickable al archivo) y recuérdale que **no se ha tocado ningún archivo de la app**.

### Caso B: El usuario pide ver o repasar el bloc
1. Lee `BACKLOG_NOTAS.md` y muestra un resumen limpio de los elementos en `Pendientes` y `En Revisión`.
2. Pregunta cuál quiere priorizar o refinar.

### Caso C: El usuario ordena explícitamente implementar una nota del bloc
Solo cuando el usuario diga explícitamente *"implementa el punto X"*, *"aplica la nota Y"* o *"haz ahora lo del bloc"*:
1. Ejecuta el cambio en el código de `advientocero` siguiendo `CONTEXTO_PROYECTO.md` (subiendo versión de caché en `sw.js` e `index.html`, y ejecutando `scripts/verify_integrity.ps1`).
2. Mueve el ítem en `BACKLOG_NOTAS.md` de `Pendientes` a `## Completadas (Histórico)` marcándolo `[x]` con la fecha y versión/commit.
