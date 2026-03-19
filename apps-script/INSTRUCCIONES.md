# Instrucciones de configuración — Apps Script

## 1. Crear el Google Sheet de invitados

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva.
2. Llámala, por ejemplo, **Boda Andrea & Ferran**.
3. En la primera hoja, renómbrala **Invitados**.
4. Crea las columnas en la fila 1:

| A | B |
|---|---|
| Nombre | Apellido |

5. Rellena los invitados, uno por fila. Ejemplo:

| Nombre | Apellido |
|--------|----------|
| María  | García   |
| Juan   | López    |
| …      | …        |

---

## 2. Crear el proyecto de Apps Script

1. En la hoja, ve a **Extensiones → Apps Script**.
2. Borra el código que aparece por defecto.
3. Copia y pega el contenido de **`Code.gs`** (este mismo repositorio).
4. Guarda el proyecto (Ctrl+S / Cmd+S). Ponle nombre, p.ej. *Backend Boda*.

---

## 3. Generar los hashes

1. En el editor de Apps Script, selecciona la función **`generarHashes`** en el menú desplegable.
2. Pulsa el botón **▶ Ejecutar**.
3. La primera vez te pedirá permisos — acéptalos (cuenta de Google del propietario).
4. Al terminar verás un mensaje con el número de hashes generados.
5. Vuelve a la hoja: ahora verás las columnas **Hash** y **URL Invitación** rellenas.

> ⚠️ Ejecuta `generarHashes` **solo una vez** (o más veces si añades invitados nuevos — los que ya tienen hash no se tocan).

---

## 4. Publicar como Web App

1. En el editor de Apps Script, pulsa **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier usuario
4. Pulsa **Implementar** y copia la URL que aparece.
   Tiene este aspecto: `https://script.google.com/macros/s/AKfy.../exec`

---

## 5. Conectar la URL con la web

1. Abre el archivo `index.html` del repositorio.
2. Busca la línea:
   ```js
   const APPS_SCRIPT_URL = 'PEGA_AQUI_TU_URL';
   ```
3. Sustituye `PEGA_AQUI_TU_URL` por la URL que copiaste en el paso anterior.
4. Guarda, haz commit y push a la rama `prueba1` (o `main`).

---

## 6. Enviar las invitaciones

Cada invitado tiene su propia URL en la columna **URL Invitación** de la hoja.
Copia esa URL y envíasela por WhatsApp, correo o como prefieras.

Al abrir la URL, la web mostrará su nombre personalizado y el formulario RSVP.

---

## Hoja de respuestas

Las confirmaciones se guardan automáticamente en una segunda hoja llamada **Respuestas** con estas columnas:

| Timestamp | Hash | Nombre | Apellido | Asistencia | Acompañantes | Dieta | Canción | Notas |
|-----------|------|--------|----------|------------|--------------|-------|---------|-------|

---

## Notas

- Si alguien abre la web **sin hash** (URL normal), ve la invitación genérica sin nombre personalizado.
- Si alguien reenvía su link a otra persona, la otra persona verá el nombre del titular (no es un problema de seguridad crítico para una boda).
- Para regenerar la URL de un invitado concreto, simplemente borra su hash en la hoja y vuelve a ejecutar `generarHashes`.
