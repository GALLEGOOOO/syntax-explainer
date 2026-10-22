# Explicador de palabras clave

Al pasar el ratón sobre una palabra clave, además del hover normal aparece una breve explicación en español.

Lenguajes: JavaScript, TypeScript, React/JSX (`javascriptreact`, `typescriptreact`: JS + React), HTML, CSS/SCSS/Less, PHP, Python, Java y SQL.

## Instalación en Cursor / VS Code
1. Abre la Paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Ejecuta **"Extensions: Install from VSIX..."**.
3. Elige `explicador-palabras-clave-0.0.3.vsix` y recarga la ventana si te lo pide.

## Diccionario remoto (repo privado de GitHub)
Por defecto la extensión descarga `diccionario.json` del repo privado `GALLEGOOOO/explicador-palabras-clave` mediante la API de GitHub, al arrancar y luego cada 24 h. Necesita un token:

1. En GitHub ve a **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Ponle nombre y caducidad. En **Repository access** elige **Only select repositories** y marca solo `explicador-palabras-clave`.
3. En **Permissions → Repository permissions**, pon **Contents: Read-only** (Metadata: Read-only se añade solo). No des ningún otro permiso.
4. Genera el token y cópialo.
5. En Cursor/VS Code ejecuta **"Explicador: Configurar token de GitHub"** y pégalo. Se guarda cifrado en el almacén de secretos del editor (SecretStorage), nunca en los ajustes.

Otros comandos: **"Explicador: Actualizar diccionario ahora"** y **"Explicador: Borrar token"**. Sin token o sin conexión se usa la última copia en caché o el diccionario local, sin mostrar errores.

Para cambiar textos sin reinstalar la extensión, edita `diccionario.json` en el repo (mismo formato que abajo) y ejecuta "Actualizar diccionario ahora".

## Ajustes
- `explicadorPalabrasClave.enabled` (true/false): activa o desactiva las explicaciones.
- `explicadorPalabrasClave.remoteUrl` (por defecto, la URL de la API de GitHub del repo; vacío = solo local): URL de un JSON con la forma `{"python": {"def": "texto"}, "sql": {"select": "texto"}}`. Se descarga al activar la extensión (y al cambiar el ajuste), se guarda en caché y sus entradas tienen prioridad sobre las locales. Si no hay conexión, se usa la caché o solo el diccionario local, sin errores.

## Añadir palabras
Cada lenguaje tiene su archivo en `src/keywords/<lenguaje>.json` (`javascript`, `react`, `html`, `css`, `php`, `python`, `java`, `sql`). Añade `"palabra": "Explicación."`.
- En SQL y HTML escribe la palabra **en minúsculas** (la búsqueda no distingue mayúsculas).
- En CSS se admiten guiones, `@` y `:` (`justify-content`, `@media`, `:hover`).
- En PHP puedes incluir `$` (`$this`, `$_POST`).

Después ejecuta `npm test` y vuelve a empaquetar con `npx @vscode/vsce package --allow-missing-repository`.

Si añades palabras locales, regenera `diccionario.json` con `npm run diccionario`.
