# Guía de Configuración: Firebase + GitHub Pages (2 minutos)

Esta guía conecta la sincronización en tiempo real entre el móvil de **Miguel** y el de **Patri** usando el plan gratuito (Spark) de Firebase y GitHub Pages.

---

## Paso 1: Activar GitHub Pages
1. Entra en tu repositorio: `https://github.com/mgesm/advientocero`
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona **Source: Deploy from a branch**, rama **`main`**, carpeta **`/ (root)`** y pulsa **Save**.
4. En unos segundos la web quedará publicada en:
   `https://mgesm.github.io/advientocero/`

---

## Paso 2: Crear Firebase Realtime Database (Gratis)
1. Entra en [https://console.firebase.google.com/](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Pulsa **Agregar proyecto** (p. ej. `adviento-cero-2026`), desactiva Google Analytics si no lo necesitas y crea el proyecto.
3. En el menú izquierdo, entra en **Compilación → Realtime Database** y pulsa **Crear base de datos**.
4. Elige la ubicación **Europe (europe-west1)** y empieza en **Modo de prueba** (o aplica las reglas de abajo).
5. Ve a **Reglas** en Realtime Database y pega estas reglas endurecidas para restringir el acceso, impedir borrados accidentales de la sala real y validar el esquema y longitud de cada campo:
   ```json
   {
     "rules": {
       ".read": false,
       ".write": false,
       "rooms": {
         "miguel-patri-ventisquero-2026": {
           ".read": true,
           ".write": "newData.exists() && (!data.exists() || (newData.hasChild('meta') && (!newData.child('sharedNotes').exists() || (newData.child('sharedNotes').isString() && newData.child('sharedNotes').val().length <= 20000))))",
           "days": {
             "$dayKey": {
               ".validate": "newData.hasChildren(['solved']) && newData.child('solved').isBoolean()"
             }
           },
           "discardedIds": {
             "$idx": {
               ".validate": "newData.isString() && newData.val().length <= 8"
             }
           },
           "sharedNotes": {
             ".validate": "newData.isString() && newData.val().length <= 20000"
           },
           "fieldDispatch": {
             ".validate": "newData.isString() && newData.val().length <= 4000"
           },
           "suspectNotes": {
             "$sid": {
               ".validate": "newData.isString() && newData.val().length <= 600"
             }
           },
           "pinnedClues": {
             "$idx": {
               ".validate": "newData.isString() && newData.val().length <= 16"
             }
           },
           "finalProposal": {
             ".validate": "!newData.exists() || (newData.hasChildren(['culpritId', 'proposedBy']) && newData.child('culpritId').isString() && newData.child('culpritId').val().length <= 8)"
           },
           "presence": {
             "$role": {
               ".validate": "!newData.exists() || (newData.child('online').isBoolean() && newData.child('lastSeen').isNumber())"
             }
           },
           "meta": {
             ".validate": "newData.hasChildren(['updatedAt']) && newData.child('updatedAt').isNumber()"
           }
         },
         "miguel-patri-ventisquero-2026-test": {
           ".read": true,
           ".write": "!newData.exists() || !newData.child('sharedNotes').exists() || (newData.child('sharedNotes').isString() && newData.child('sharedNotes').val().length <= 20000)"
         }
       }
     }
   }
   ```
   *(Endurecimiento adicional recomendado — **Anonymous Auth**: si activas **Authentication → Sign-in method → Anónimo** en Firebase Console, puedes cambiar `".read": true` y `".write": ...` en la sala real por `"auth != null"` y `"auth != null && ..."` cargando `firebase-auth-compat.js`.)*
   *(Consejo: si cambias el `roomId` en `config/firebase-config.js`, usa exactamente el mismo nombre aquí).*
6. Para obtener tus credenciales (`firebaseConfig`), tienes **dos caminos equivalentes**:
   - **Camino rápido:** En el menú lateral izquierdo haz clic arriba del todo en **Descripción general del proyecto** (*Project Overview*). En el centro verás *"Comienza agregando Firebase a tu app"* con iconos redondos (`iOS`, `Android`, **`</>` Web**). Pulsa **`</>`**, escribe `advientocero-web` y haz clic en **Registrar app**.
   - **Desde ajustes:** En el menú lateral izquierdo, justo al lado de **Descripción general del proyecto**, pulsa el **icono del engranaje** → **Configuración del proyecto**. Baja hasta el final a la sección **Tus apps** y pulsa **`</>`** (o **Agregar app → Web `</>`**).
   - *(Nota: si el menú izquierdo está oculto, pulsa el icono de menú `≡` arriba a la izquierda para desplegarlo).*
7. Copia el objeto `const firebaseConfig = { ... }` que te muestra el asistente.
   - **Importante sobre `databaseURL`:** Si en ese bloque no viniera la línea `databaseURL`, vuelve a **Compilación → Realtime Database → Datos** y copia la URL `https://...firebasedatabase.app` que aparece justo encima de los datos.
8. Abre [`config/firebase-config.js`](config/firebase-config.js), pega esos valores dentro de `firebaseConfig` y haz `git commit` + `git push` a `main`.

---

## Paso 3: Personalizar tu regalo antes del 1 de diciembre
1. Abre [`config/gift-config.js`](config/gift-config.js) (100% libre de spoilers).
2. Edita `voucherTitle` y `voucherDescription` con la sorpresa real para Patri el 24 de diciembre.
3. Prueba la web abriendo `https://mgesm.github.io/advientocero/?admin=ventisquero`:
   - Verás la barra superior de **MODO TEST**.
   - Antes de regalársela a Patri, pulsa **"Resetear partida"** y **"Salir test"** para dejar las 24 puertas limpias para el 1 de diciembre.
